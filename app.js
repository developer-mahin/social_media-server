require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("./model/user.model");
const saltRounds = 10;

const app = express();
require("./config/database");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

require("./config/passport");




/* 
    create user 
    login user 
    and profile
*/
// register route
app.post("/register", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already exists");
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            });
            await newUser
                .save()
                .then((user) => {
                    res.send({
                        success: true,
                        message: "User is created Successfully",
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email
                        },
                    });
                })
                .catch((error) => {
                    res.send({
                        success: false,
                        message: error.message,
                        error: error,
                    });
                });
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// // login route
app.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(401).send({
            success: false,
            message: "User is not found",
        });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).send({
            success: false,
            message: "Incorrect password",
        });
    }

    const payload = {
        id: user._id,
        name: user.name,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "2d",
    });

    return res.status(200).send({
        success: true,
        message: "User is logged in successfully",
        token: "Bearer " + token,
    });
});


// // profile route
app.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
        return res.status(200).send({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            },
        });
    }
);


/* 
    user mongoDB for crud operation
*/

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dsgthpk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function run() {

    const usersDataCollection = client.db("social_media_task").collection("usersData")

    try {

        app.get("/users", async (req, res) => {
            const query = {}
            const result = await usersDataCollection.find(query).toArray()
            res.send(result)
        })


        app.get("/jwt", async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const user = await usersDataCollection.findOne(query)
            const token = jwt.sign(user, process.env.JWT_TOKEN, { expiresIn: "2d" })
            return res.send({ token: token })
        })


    } finally {

    }

}

run()


// home route
app.get("/", (req, res) => {
    res.send("<h1> Welcome to the server </h1>");
});


//resource not found
app.use((req, res, next) => {
    res.status(404).json({
        message: "route not found",
    });
});

//server error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

module.exports = app;