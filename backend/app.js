const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const bookRoutes = require("./routes/book");
const commentRoutes = require("./routes/comment");

const app = express();

mongoose.connect("mongodb+srv://forsrb:4vfzxtePPO51QM9l@pia-cluster.hfw1t.mongodb.net/pia-project-database?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json({ type: 'application/json' }));

app.use("/images", express.static(path.join("backend/images")));
app.use("/book_images", express.static(path.join("backend/book_images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
})

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/comment", commentRoutes);

module.exports = app;