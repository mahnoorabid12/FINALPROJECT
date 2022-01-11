const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const router = express.Router();
const ensureAuthenticated = require("../config/auth.js")
const Image = require('../models/Image.js');
const Favourite = require('../models/Favourite.js');
const { format } = require('timeago.js');
//login page
router.get('/', (req, res) => {//When the user navigates to the root directory
    res.render('welcome.ejs'); //(performs a GET request) render the welcome.ejs page  
})

//register page
router.get('/register', (req, res) => {//When the user does a GET request to the register page,
    res.render('registerform');         // render the register.ejs page.
})
//users dashboard feed upload
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    
    const images = await Image.find();
    res.render('dashboard', {
        user: req.user,
        images
    });
})

router.get('/user/feed', ensureAuthenticated, async (req, res) => {
    let q = req.query.title;
    const favourite = await Favourite.find();
    if (q == null) {
        console.log('since no query..');
        const images = await Image.find();
        const favourite = await Favourite.find();
        res.render('index', { images, user: req.user, favourite });
    }
    else {
        console.log(q);
        const images = await Image.find({ title: q });
        const favourite = await Favourite.find();
        res.render('index', { images, user: req.user, favourite });
    }
})
router.get('/user/upload', ensureAuthenticated, async (req, res) => {
    res.render('upload',
        {
            user: req.user
        });
})


module.exports = router;  //Export the router instance so that it can be used in other files
console.log('file index.js ran successfully')