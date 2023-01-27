require("dotenv").config();
const express = require("express");
const cors = require("cors");


const app = express();
require("./config/database");


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// register route
app.post("/register", async (req, res) => {
    res.send("<h1>Welcome to register route</h1>")
})

// login route
app.post("/login", async (req, res) => {
    res.send("<h1>Welcome to login route</h1>")
})

// protected profile route
app.get("/profile", async (req, res) => {
    res.send("<h1>Welcome to protected profile route</h1>")
})




// Home route
app.get("/", async (req, res) => {
    res.send("<h1>Welcome to the server</h1>")
})

// route not found 
app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    })
})

// server error
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


module.exports = app;