//jshint esversion:6

require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

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

    const user = new User({
        email: req.body.username,
        password: md5(req.body.password)
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

app.post("/login", function(req, res){
    const email = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email: email}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
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