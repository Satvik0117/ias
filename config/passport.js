const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Student = require('../models/student.js');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField : 'email'}, (email,password,done) =>{
            // Match User
            Student.findOne({email : email})
                .then(user => {
                    if(!user)return done(null,false,{message : 'There is no account linked with this e-mail.'});
                    // Match Password
                    bcrypt.compare(password,user.password, (err, isMatch) => {
                        if(err)throw err;

                        if(isMatch) return done(null,user);
                        else done(null,false,{message : 'Incorrect Password'});
                    });
                })
                .catch(err => console.log(err));
        })
        
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        Student.findById(id, function(err, user) {
          done(err, user);
        });
    });
}