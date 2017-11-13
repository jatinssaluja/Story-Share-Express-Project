const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

const User = mongoose.model('users');


module.exports = (passport)=>{
    
    
    passport.serializeUser((user, done)=>{
    
    done(null, user.id);
    
});


passport.deserializeUser((id, done)=>{
    
    User.findById(id)
    .then((user)=> done(null, user));
    
    
});  
    
    
    
    
    
    
    passport.use(new GoogleStrategy({
        
        clientID: keys.clientId,
        clientSecret: keys.clientSecret,
        callbackURL:'/auth/google/callback'
        
        
    }, async (accessToken, refreshToken, profile, done)=>{
        
        
        //console.log(accessToken);
        //console.log(profile);
        
        const {id, name, emails, photos } = profile;
        
        const existingUser = await User.findOne({googleId: id});
        
        if(!existingUser){
            
            // insert into db
            
            const newUser = await new User({
                
                googleId: id,
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                image: photos[0].value.substring(0, photos[0].value.indexOf('?'))
                
                
            }).save();
            
            done(null, newUser);
            
        }
        
        
         else {
             
             done(null, existingUser);
             
         }
        
           
        
    }));
    
    
    
    
};