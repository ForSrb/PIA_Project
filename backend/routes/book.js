const express = require("express");
const multer = require("multer");

const Book = require("../models/book");
const BookUser = require("../models/book_user");
const BookRequest = require("../models/book_request");

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
            cb(error, "backend/book_images");
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

router.post("/add", multer({storage: storage}).single("image"), (req, res, next) => {

    let imagePath;

    if(req.file != undefined) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/book_images/" + req.file.filename;
    }
    else{
        imagePath = "http://localhost:3000/book_images/book-default.png";
    }


    const book = new Book({
        imagePath: imagePath,
        name: req.body.name,
        authors: req.body.authors,
        publishDate: req.body.publishDate,
        genres: req.body.genres,
        description: req.body.description,
        averageReview: 0
    });
    book.save()
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
})

router.post("/add-request", multer({storage: storage}).single("image"), (req, res, next) => {
    let imagePath;

    if(req.file != undefined) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/book_images/" + req.file.filename;
    }
    else{
        imagePath = "http://localhost:3000/book_images/book-default.png";
    }


    const bookRequest = new BookRequest({
        imagePath: imagePath,
        name: req.body.name,
        authors: req.body.authors,
        publishDate: req.body.publishDate,
        genres: req.body.genres,
        description: req.body.description,
        averageReview: 0,
        status: req.body.status
    });
    bookRequest.save()
        .then(result => {
            res.status(200).json({
                result: result
            })
        })
})

router.get("/get-requests", (req, res, next) => {
    BookRequest.find({ status: "pending" })
        .then(documents => {
            res.status(200).json({
                requests: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.get("/get-declined-requests", (req, res, next) => {
    BookRequest.find({ status: "declined" })
        .then(documents => {
            res.status(200).json({
                requests: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.post("/accept-request/:id", (req, res, next) => {
    //console.log(req.params);
    //console.log(req.body);
    BookRequest.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
    const book = new Book({
        imagePath: req.body.imagePath,
        name: req.body.name,
        authors: req.body.authors,
        publishDate: req.body.publishDate,
        genres: req.body.genres,
        description: req.body.description,
        averageReview: req.body.averageReview
    })
    book.save()
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

router.put("/decline-request/:id", (req, res, next) => {
    BookRequest.updateOne({ _id: req.params.id }, { status: req.body.status })
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

router.put("/update-book/:id", (req, res, next) => {
    //console.log(req.params.id);
    //console.log(req.body);
    Book.updateOne({ _id: req.params.id}, {name: req.body.name, authors: req.body.authors,
    publishDate: req.body.publishDate, genres: req.body.genres, description: req.body.description})
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

router.get("/get", (req, res, next) => {
    Book.find()
        .then(documents => {
            res.status(200).json({
                books: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                message: "Ne postoji knjiga"
            })
        });
})

router.get("/get/:id", (req, res, next) => {
    Book.findById(req.params.id)
        .then(book => {
            res.status(200).json({
                book: book
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Neuspesno ucitavanje knjige"
            })
        })
})

router.put("/update-review", (req, res, next) => {
    Book.updateOne({ _id : req.body.bookId }, { averageReview: req.body.averageReview})
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

router.post("/add-book-user" , (req, res, next) => {
    console.log(req.body);
    const bookUser = new BookUser({
        user: req.body.user,
        bookId: req.body.bookId,
        status: req.body.status,
        readPages: req.body.readPages,
        numberOfPages: req.body.numberOfPages
    });
    bookUser.save()
        .then(result => {
            //console.log(result);
            res.status(200).json({
                result: result
            })
        })
        .catch(error => {
            //console.log(error);
            res.status(500).json({
                error: error
            })
        })
})

router.put("/update-book-user", (req, res, next) => {
    console.log(req.body);
    BookUser.updateOne({ user: req.body.user, bookId: req.body.bookId}, { status: req.body.status, readPages: req.body.readPages, numberOfPages: req.body.numberOfPages})
        .then(result => {
            //console.log(result);
            res.status(200).json({
                result: result
            })
        })
        .catch(error => {
            //console.log(error);
            res.status(500).json({
                error: error
            })
        })
})

router.get("/get-book-user/:parameters", (req, res, next) => {
    let parameters = req.params.parameters.split(",");
    BookUser.findOne({ user: parameters[0], bookId: parameters[1] })
    .then(bookUser => {
        res.status(200).json({
            bookUser: bookUser
        })
    })
    .catch(error => {
        res.status(500).json({
            error: error
        })
    })
}) 

router.delete("/delete-book-user/:parameters", (req, res, next) => {
    let parameters = req.params.parameters.split(",");
    BookUser.deleteOne({ user: parameters[0], bookId: parameters[1] })
        .then(result => {
            //console.log(result);
            res.status(200).json({
                result: result
            })
        })
        .catch(error => {
            //console.log(error);
            res.status(500).json({
                error: error
            })
        })
})

router.get("/get-book-users/:user", (req, res, next) => {
    BookUser.find({ user: req.params.user })
        .then(documents => {
            res.status(200).json({
                bookUsers: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})





module.exports = router;