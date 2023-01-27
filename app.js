require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("./model/user.model")



const app = express();
require("./config/database");


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// /userEmail: req.body.userEmail// 


// register route
app.post("/register", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (user) return res.status(400).send("User already exists");
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            const newUser = new User({
                userEmail: req.body.userEmail,
                username: req.body.username,
                password: hash,
            })
            await newUser
                .save()
                .then((user) => {
                    res.send({
                        success: true,
                        message: "User is created Successfully",
                        user: {
                            id: user._id,
                            userEmail: user.userEmail,
                            username: user.username
                        }
                    });
                })
                .catch((error) => {
                    res.send({
                        success: false,
                        message: "Something is error, user is not created",
                        error: error
                    })
                });
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});




// login route
app.post("/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
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
      username: user.username,
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