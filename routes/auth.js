const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('users');


module.exports = router;


router.get('/google', passport.authenticate('google', {scope:['profile', 'email']}));


router.get('/google/callback', passport.authenticate('google', {failureRedirect:'/'}), 
          
          (req, res)=>{
    
    
           res.redirect('/dashboard');
    


           });


router.get('/verify', (req, res)=>{
    
    if(req.user){
        
        console.log(req.user);
    }
    
    else{
        
        console.log('Not auth');
        
    }
    
    
    
});


router.get('/logout', (req, res)=>{
    
    req.logout();
    res.redirect('/');
    
    
});










