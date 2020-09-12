const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {ensureAuth} = require('../config/auth.js');

const Student = require('../models/student.js');
const { deserializeUser } = require('passport');
const passport = require('passport');

router.post('/payment/success/1',ensureAuth,function(req,res){
    var s = req.user;
    s.fees = 1;
    Student.findOneAndUpdate({'email' : req.user.email}, s ,  function(err, result){
        req.flash('success_msg','Enrolled successfully.');
        res.redirect('/course1');
    });    
});

router.post('/payment/success/2',ensureAuth,function(req,res){
    var s = req.user;
    s.fees = 2;
    Student.findOneAndUpdate({'email' : req.user.email}, s ,  function(err, result){
        req.flash('success_msg','Enrolled successfully.');
        res.redirect('/course2');
    });    
});


router.get('/admin',function(req,res){
    // res.send(req.user.name);
    Student.find({},function(err,data){
        res.render('admin',{data});
    });
});




router.get('/enroll',ensureAuth,function(req,res){
    // res.send(req.user.name);
    res.render('cource',{user:req.user});
});

router.get('/courses',ensureAuth,function(req,res){
    // res.send(req.user.name);
    res.render('cource',{user:req.user});
});

router.get('/course1',ensureAuth,function(req,res){
    // res.send(req.user.name);
    res.render('course-details-1',{user:req.user});
});

router.get('/course2',ensureAuth,function(req,res){
    // res.send(req.user.name);
    res.render('course-details-2',{user:req.user});
});

router.get('/',function(req,res){
    res.render('index');
});

router.get('/interviews',function(req,res){
    res.render('about');
});

router.get('/programs',function(req,res){
    res.render('cource');
});

router.get('/login',function(req,res){
    res.render('login');
});


router.get('/register',function(req,res){
    res.render('register');
});


router.post('/register',function(req,res){
    // console.log(req.body);

    const {name,email,phone,password,password2} = req.body;
    
    let errors =[];
    if(password !== password2)errors.push({msg : 'Passwords do not match'});
    
    if(password.length < 6)errors.push({msg : 'Passwords should be atleast 6 characters'});

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            phone,
            password,
            password2
        });
    }else{
        Student.findOne({ email:email })
        .then(user =>{
            if(user){
                errors.push({msg : "A user with this e-mail already exists."})
                res.render('register',{
                    errors,
                    name,
                    email,
                    phone,
                    password,
                    password2
                });
            }else{
                var s = new Student({
                    name : name,
                    phone : phone,
                    email : email,
                    password : password,
                    fees : 0
                });

                bcrypt.genSalt(10, (err,salt) => bcrypt.hash(s.password,salt, (err,hash) => {
                    if(err)throw err;

                    s.password = hash;
                    s.save()
                    .then(user => {
                        req.flash('success_msg','Successfully Registered. Please login.');
                        res.redirect('/login');
                    })
                    .catch(err => console.log(err));
                }));

            }
        });
    }

});

router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect : '/courses',
        failureRedirect : '/login',
        failureFlash : true

    })(req,res,next);
});



module.exports = router;