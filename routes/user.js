const express= require('express')
const router=express.Router();
const User = require("../models/user.js")
const Image = require('../models/Image.js');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const {ensureAuthenticated} = require("../config/auth.js")
const { Router } = require('express');
const path = require('path');
const { unlink } = require('fs-extra');
const { format } = require('timeago.js');
const Favourite = require('../models/Favourite.js');
const { title } = require('process');
//require("./config/passport")(passport)

//login handle
router.get('/login',(req,res)=>{//Lines 5 to 9:Handle the respective GET requests and render the appropriate pages
    res.render('login')
})
router.get('/register', (req,res)=>{
    res.render('registerform')
})
//register handle // Handle the respective POST requests.
router.post('/register',(req,res)=>{
    const{name,email,password,password2}=req.body//Extract the values from the elements in the form. You are taking out the email, the name of the user, his password
    let errors=[]
    console.log(' Name :' + name+ ' email :' + email+ ' pass:' + password);
    if(!name || !email || !password || !password2) {  //If any of the fields has not been filled, add an appropriate message to the error array.
        errors.push({msg : "Please fill in all fields"})
    }
    //check if match
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }
    //check if password is more than 6 characters
    if(password.length < 6 ) {
            errors.push({msg : 'password atleast 6 characters'})
    }
    if(errors.length>0){
        res.render('register',{errors : errors, name : name,email : email,password : password,password2 : password2 })
    }
    else {
        //validation passed
        User.findOne({email : email}).exec((err,user)=>{
            console.log(user);   
            if(user) {
                errors.push({msg: 'email already registered'});
                //render(res,errors,name,email,password,password2);
            }
            else
            {
                const newUser = new User({
                    name : name,
                    email : email,
                    password : password})
                
                //hash password
                //Generate a salt, hash the user’s password. Assign this 
                //encrypted value to the user’s password and then save the client to the database.
                bcrypt.genSalt(10,(err,salt)=> 
                bcrypt.hash(newUser.password,salt,
                    (err,hash)=> {
                        if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                        //save user
                        newUser.save()
                        //When the document is saved without errors, 
                        //then redirect the user to the login directory, 
                        //where the user will now log in with their credentials.
                        .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!')
                        res.redirect('/user/login');
                    })
                    .catch(value=> console.log(value));
                }));
            }
        });        
    } //ELSE statement ends here
})
router.post('/login',(req,res)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/user/login',
        failureFlash : true,
        })(req,res);
        /*If the user has successfully logged in, they will be redirected to the dashboard directory (successRedirect).
        If the user does not log in successfully, redirect them to the login directory (failureRedirect).
        Get flash messages when an error occurs (failureFlash). */
    })

//logout
router.get('/logout',(req,res)=>{
    //req.session.destroy();
    req.logout();
    req.flash('success_msg','Now logged out');
    //res.session.destroy();
    res.redirect('/user/login');
})



router.get('/Favourite', async(req, res) => {
    
    const images = await Image.find();
    const favourites =await Favourite.find() ;
    res.render('Favourite',{ 
        images,
        favourites,
        user:req.user
});
})
router.get('/Favourite', async(req, res) => {
    
    const images = await Image.find();
    const favourites =await Favourite.find() ;
    res.render('Favourite',{ 
        images,
        favourites,
        user:req.user
});
})

router.post('/upload', async (req, res) => {
    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;
    image.authorname=req.body.authorname; 
    console.log(req.body.authorname + " Name of user");
    image.authorid=req.body.authorid; 
    
    await image.save();
    res.redirect('/user/feed');
});
router.post('/addtofavourite', async (req, res) => {
    const favourite = new Favourite();
    favourite.imageid=req.body.imageid;
    favourite.Currentuser=req.body.Currentuser
    await favourite.save();
    res.redirect('/user/Favourite');
});
/*router.get('/search', async (req, res) => {
    const { imagetitle } = req.query;
    const image = await Image.findOne({_id: req.query.imagetitle})
    res.render('profile', { image });
   }) */
   router.get('/activity', async (req, res) => {
    const image = await Image.find()
    const favourite = await Favourite.find()
    res.render('activity', { image, favourite, user:req.user });
   })
router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    res.render('profile', { user: req.user ,image });
});

router.get('/image/:id/delete', async (req, res) => {
    const { id } = req.params;
    const imageDeleted = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('./private' + imageDeleted.path));
    res.redirect('/dashboard');
});
router.get('/image/:id/remove', async (req, res) => {
    const { id } = req.params;
    const removefav = await Favourite.findByIdAndDelete(id);
    res.redirect('/user/Favourite');
});
module.exports=router;

console.log('file user.js ran succesfully')