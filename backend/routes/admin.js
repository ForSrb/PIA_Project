const express = require("express");

const User = require("../models/user");
const UserRequest = require("../models/user_request");
const Genre = require("../models/genre");

const router = express.Router();

router.put("/accept/:username", (req, res, next) => {
    UserRequest.updateOne({ username: req.params.username }, { status: "accepted"})
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            return res.status(500).json({
                message: "Neuspesno prihvatanje zahteva"
            })
        });
    const user = new User({
        name: req.body.name,
        surrname: req.body.surrname,
        imagePath: req.body.imagePath,
        username: req.body.username,
        password: req.body.password,
        dateOfBirth: req.body.dateOfBirth,
        city: req.body.city,
        country: req.body.country,
        email: req.body.email,
        type: "regular"
    })
    user.save()
        .then(result => {
            res.status(201).json({
                message: "Prihvacena registracija!",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Neuspesna registracija"
            })
        })
})

router.delete("/delete/:username", (req, res, next) => {
    UserRequest.deleteOne({ username: req.params.username})
        .then(result => {
            res.status(201).json({
                message: "Odbijena registracija!",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Neuspesno odbijanje registracije"
            })
        })
})

router.put("/change-type/:username", (req, res, next) => {
    User.updateOne({ username: req.params.username }, { type: req.body.type})
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

router.post("/add-genre", (req, res, next) => {
    const genre = new Genre({
        genre: req.body.genre
    })
    genre.save()
        .then(result => {
            res.status(200).json({
                message: "Uspesno dodavanje zanra"
            })
        })
        .catch(error => {
            res.status(500).json({
                message: "Vec postoji zanr u bazi"
            })
        })
})

router.get("/get-genres", (req, res, next) => {
    Genre.find()
        .then(documents => {
            res.status(200).json({
                genres: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.delete("/delete-genre/:genre", (req, res, next) => {
    Genre.deleteOne({ genre: req.params.genre})
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

module.exports = router;