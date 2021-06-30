const express = require("express");

const Comment = require("../models/comment");

const router = express.Router();


router.post("/add", (req, res, next) => {
    console.log(req.body);
    const comment = new Comment({
        user: req.body.user,
        bookId: req.body.bookId,
        review: req.body.review,
        content: req.body.content
    })
    comment.save()
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
    Comment.find()
        .then(documents => {
            res.status(200).json({
                comments: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.get("/get-user/:user", (req, res, next) => {
    Comment.find({ user: req.params.user })
        .then(documents => {
            res.status(200).json({
                comments: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.get("/get-book/:bookId", (req, res, next) => {
    Comment.find({ bookId: req.params.bookId })
        .then(documents => {
            res.status(200).json({
                comments: documents
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.get("/get-comment/:id", (req, res, next) => {
    Comment.findOne({ _id: req.params.id })
        .then(document => {
            res.status(200).json({
                comment: document
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
})

router.put("/change-comment/:id", (req, res, next) => {
    //console.log(req.body);
    Comment.updateOne({ _id: req.params.id }, { review: req.body.review, content: req.body.content })
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