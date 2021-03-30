const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

/// db and models setup
const dbHost = process.env.DB_HOST,
    dbName = process.env.DB_NAME,
    dbUser = process.env.DB_USER,
    dbPass = process.env.DB_PASS;

const db = mongoose
    .connect(dbHost + "/" + dbName, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: dbUser,
        pass: dbPass,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

module.exports = db;
