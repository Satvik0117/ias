const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));

// Express- Session Middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}))

// Connect Flash
app.use(flash());

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


mongoose.connect('mongodb://localhost:27017/panini', {useNewUrlParser: true,useUnifiedTopology: true});

const user=require('./routes/user.js');



app.use('/',user);


app.listen(3000,function(req,res){
    console.log("Server Started");
})