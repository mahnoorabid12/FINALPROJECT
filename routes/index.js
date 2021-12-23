const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const router  = express.Router();
const ensureAuthenticated = require("../config/auth.js")
const Image = require('../models/Image.js');
//login page
router.get('/', (req,res)=>{//When the user navigates to the root directory
    res.render('welcome.ejs'); //(performs a GET request) render the welcome.ejs page  
})

//register page
router.get('/register', (req,res)=>{//When the user does a GET request to the register page,
    res.render('registerform');         // render the register.ejs page.
})
router.get('/dashboard',ensureAuthenticated,async(req,res)=>{
     res.render('dashboard',{
        user: req.user
        });
})
router.get('/user/feed',ensureAuthenticated,async (req,res)=>{
    const images = await Image.find();
    res.render('index', { images });
    })
    


module.exports = router;  //Export the router instance so that it can be used in other files
console.log('file index.js ran successfully')