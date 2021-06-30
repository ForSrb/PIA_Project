const express = require("express");
const multer = require("multer");
const fs = require("fs");

const User = require("../models/user");
const UserRequest = require("../models/user_request");
const Event = require("../models/event");
const Follow = require("../models/follow");
const Message = require("../models/message");

const checkRegistration = require("../middleware/check-registration");
const checkChangePassword = require("../middleware/check-change-password");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file != null) {
            const isValid = MIME_TYPE_MAP[file.mimetype];
            let error = new Error("Invalid mime type");
            if (isValid) {
                error = null;
            }
            cb(error, "backend/images");  
        }
    },
    filename: (req, file, cb) => {
        if(file != null) {
            const name = file.originalname.toLowerCase().split(' ').join('-');
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, name + '-' + Date.now() + '.' + ext);
        }
        
    }
});

router.post("/signup", multer({storage: storage}).single("image"), (req, res, next) => {
    
    let firstIsLetter = /^[A-Za-z]/;
    let oneNumber = /\d+/;
    let oneBigLetter = /[A-Z]+/;
    let oneSpecialCharacter = /[!@#$%^&*]+/;
    let password = "";
    if (!req.body.password.match(firstIsLetter) ||
        !req.body.password.match(oneNumber) ||
        !req.body.password.match(oneBigLetter) ||
        !req.body.password.match(oneSpecialCharacter) || req.body.password.length < 7) {
        return res.status(401).json({
            message: "Lozinka mora da sadrzi najmanje 7 karaktera, bar jedno veliko slovo, jedan broj, jedan specijalni karakter i mora pocinjati slovom"
        });
    }
    if (req.body.password != req.body.passwordAgain) {
        return res.status(401).json({
            message: "Unete lozinke se ne poklapaju"
        });
    }
    
    let imagePath;

    if(req.file != undefined) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    else{
        imagePath = "http://localhost:3000/images/anonymous-user.png";
    }

    const userRequest = new UserRequest({
        name: req.body.name,
        surrname: req.body.surrname,
        imagePath: imagePath,
        username: req.body.username,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth,
        city: req.body.city,
        country: req.body.country,
        email: req.body.email,
        type: req.body.type,
        status: "pending"
    });
    userRequest.save()
    .then(result => {
        res.status(201).json({
            message: "User created!",
            result: result
        });
    })
    .catch(err => {
        //fs.unlink("/backend/images" + req.file.filename);
        res.status(500).json({
            message: "Vec je poslat zahtev za registraciju pod ovim korisnickim imenom i/ili email-om ili vec postoji korisnik sa ovim korisnickim imenom i/ili email-om"
        })
    })

})

router.post("/login", (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Nepostojeci username!"
                });
            }
            if (user.password != req.body.password) {
                return res.status(401).json({
                    message: "Neispravna lozinka!"
                });
            }
            res.status(200).json({
                user: user
            });
        });
})

router.put("/changepassword/:username", checkChangePassword, (req, res, next) => {
    User.updateOne({ username: req.params.username, password: req.body.oldPassword}, {password: req.body.newPassword})
        .then(result => {
            if(result.nModified <= 0 ) {
                return res.status(401).json({ message: "Niste uneli ispravnu staru lozinku "})
            }
            res.status(200).json({ message: "Update uspesan"})
        })
})

router.put("/changeattribute/:username", multer({storage: storage}).single("image"), (req, res, next) => {
    //console.log(req.body);
    //console.log(req.params.username);
    let imagePath;

    if(req.file != undefined) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    else{
        imagePath = "http://localhost:3000/images/anonymous-user.png";
    }

    //console.log(imagePath);

    User.updateOne({ username: req.params.username}, {name: req.body.name, surrname: req.body.surrname, imagePath: imagePath, 
    dateOfBirth: req.body.dateOfBirth, city: req.body.city, country: req.body.country, email: req.body.email})
       .then(result => {
            if(result.nModified <= 0 ) {
                return res.status(401).json({ message: "Doslo je do greske pri promeni atributa korisnika ili su atributi ostali nepromenjeni"})
            }
            res.status(200).json({ message: "Update uspesan"})
        })
        .catch(error => {
            res.status(500).json({
                message: "Zauzeta email adresa"
            })
        })
})

router.get("/get-requests", (req, res, next) => {
    UserRequest.find({ status: "pending"})
        .then(documents => {
            res.status(200).json({
                userRequests: documents
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Trenutno ne postoje zahtevi za registraciju"
            })
        })
})

router.get("/get/:username", (req, res, next) => {
    User.findOne({ username: req.params.username})
        .then(document => {
            res.status(200).json({
                user: document
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Doslo je do greske pri dohvatanju korisnika"
            })
        })
})

router.get("/get-users", (req, res, next) => {
    //console.log("Dohvatanje svih usera");
    User.find()
        .then(documents => {
            //console.log(documents);
            res.status(200).json({
                users: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.post("/add-event", (req, res, next) => {
    //console.log(req.body);

    const event = new Event({
        creator: req.body.creator,
        name: req.body.name,
        beginDate: req.body.beginDate,
        endDate: req.body.endDate,
        description: req.body.description,
        isPrivate: req.body.isPrivate,
        isActive: req.body.isActive,
        participants: req.body.participants
    })
    event.save()
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
})

router.get("/get-events", (req, res, next) => {
    Event.find()
        .then(documents => {
            res.status(200).json({
                events: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.put("/update-participants/:id", (req, res, next) => {
    Event.updateOne({ _id: req.params.id }, { participants: req.body.participants})
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
})

router.put("/update-activeness/:id", (req, res, next) => {
    Event.updateOne({ _id: req.params.id}, { isActive: req.body.isActive })
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
})

router.post("/post-message", (req, res, next) => {
    const message = new Message({
        eventId: req.body.eventId,
        user: req.body.user,
        message: req.body.message
    })
    message.save()
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
})

router.get("/get-messages/:id", (req, res, next) => {
    Message.find({ eventId: req.params.id })
        .then(documents => {
            res.status(200).json({
                messages: documents
            })
        })
})

router.get("/get-user-messages/:parameters", (req, res, next) => {
    let parameters = req.params.parameters.split(",");
    Message.find({ eventId: parameters[0], user: parameters[1] })
        .then(documents => {
            res.status(200).json({
                messages: documents
            })
        })
})

router.post("/follow-user", (req, res, next) => {
    const follow = new Follow({
        userFollowing: req.body.userFollowing,
        followedUser: req.body.followedUser
    })
    follow.save()
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.delete("/unfollow-user/:parameters", (req, res, next) => {
    let parameters = req.params.parameters.split(",");
    Follow.deleteOne({ userFollowing: parameters[0], followedUser: parameters[1]})
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
})

router.get("/get-follow/:parameters", (req, res, next) => {
    let parameters = req.params.parameters.split(",");
    //console.log(parameters[0]);
    //console.log(parameters[1]);
    Follow.findOne({ userFollowing: parameters[0], followedUser: parameters[1]})
        .then(document => {
            console.log(document);
            res.status(200).json({
                follow: document
            })
        })
})

router.get("/get-follows/:username", (req, res, next) => {
    Follow.find({ userFollowing: req.params.username })
        .then(documents => {
            res.status(200).json({
                follows: documents
            })
        })
})

module.exports = router;