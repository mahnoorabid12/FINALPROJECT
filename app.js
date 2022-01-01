//const exp = require('constants')
const express=require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const router=express.Router()
const app=express()
const mongoose=require('mongoose')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy=require("./config/passport")(passport)
//libraries for image manipulation ie uploading deleting 
const morgan = require('morgan');
const multer = require('multer');
const { uuid } = require('uuidv4');
const { format } = require('timeago.js');
const path = require('path');

//mongoose
mongoose.connect('mongodb://localhost:27017/TestDb',{useNewUrlParser: true, useUnifiedTopology : true})
.then(()=>console.log('mongooseDB is connected...'))
.catch((err)=>console.log('ERROR:  '+err))

//EJS
app.set('view engine','ejs');//Tells Express that you will be using ejs as your template engine
app.use(expressEjsLayouts);

//bodyparser
app.use(express.urlencoded({extended:false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());

//use flash
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
})

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({                        //We need to tell multer where we want to upload images 
    destination: path.join(__dirname, 'private/img/uploads'),//and by what name should the file be saved
    filename: (req, file, cb, filename) => {
        console.log(file);
        cb(null, uuid() + path.extname(file.originalname));
    }
}) 
app.use(multer({storage}).single('image'));
app.use(express.static(path.join(__dirname, 'private')));// static files

//routes
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));

app.listen(3000,()=>console.log('listening on port 3000...'))