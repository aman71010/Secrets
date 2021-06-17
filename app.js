//jshint esversion:6

require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const user = new User({
            email: req.body.username,
            password: hash
        });
        user.save(function(err){
            if(err){
                console.log(err);
            }
            else{
                res.render("secrets");
            }
        });
    });

});

app.post("/login", function(req, res){
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({email: email}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets");
                    } 
                });
            }
        }
    });

});

app.get("/login", function(req, res){
    res.render("login");
});

app.listen(3000, function(){
    console.log("server started on port 3000");
});