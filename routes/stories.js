const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');







router.get('/', async (req, res)=>{
    
    
    const stories = await Story.find({status:'public'}).populate('user').sort({date:'desc'});
    
    
    res.render('stories/index', {stories});
    
});


router.get('/add', requireLogin,  (req, res)=>{
    
    
    res.render('stories/add');
    
});


router.get('/show/:id', async (req, res)=>{
    
    const story = await Story.findOne({_id: req.params.id}).populate('user').populate('comments.commentUser');
    
    if((story.status === 'private' && !req.user) || (story.status === 'private' && story.user.id !== req.user.id) ){
        
        return res.redirect('/');
    } 
    
     else {
            res.render('stories/show', {story});
            
            }        
    
    
    
});

router.get('/user/:id', async (req, res)=>{
    
    const stories = await Story.find({user: req.params.id, status:'public'}).populate('user');
    
    res.render('stories/index', {stories});
    
});

router.get('/my',requireLogin, async (req, res)=>{
    
    const stories = await Story.find({user: req.user.id}).populate('user');
    
    res.render('stories/index', {stories});
    
});


router.get('/edit/:id',requireLogin, async (req, res)=>{
    
    
    const story = await Story.findOne({_id: req.params.id}).populate('user');
    
    if(story.user.id === req.user.id) {
    
        res.render('stories/edit', {story});
    
    }
    
    else {
        
       res.redirect('/stories'); 
        
    }
    
});




router.post('/', async (req, res)=>{
    

   const {title, body, status, allowComments} = req.body;
    
   const newStory = await new Story({title, body, status, allowComments: allowComments?true:false , user:req.user.id}).save();
    
   res.redirect(`/stories/show/${newStory.id}`);
    
    
});


router.post('/comment/:id', async (req, res)=>{
    

   const {commentBody} = req.body;
    
   const story = await Story.findOne({_id:req.params.id});
    
   story.comments.unshift({commentBody, commentUser:req.user.id});
    
   const newStory = await story.save();    
    
   res.redirect(`/stories/show/${newStory.id}`);
    
    
});




router.put('/:id', async (req, res)=>{
    
    const {title, body, status, allowComments} = req.body;
    
    const story = await Story.findOne({_id:req.params.id});
    
    story.title = title;
    story.body = body;
    story.status = status;
    story.allowComments = allowComments?true:false;
    
    await story.save();
    
    res.redirect('/dashboard');
    
});




router.delete('/:id',requireLogin, async (req, res)=>{

             await Story.remove({_id: req.params.id});


             //req.flash('success_msg', 'Video Idea Removed');    
             res.redirect('/dashboard');       

            });







module.exports = router;