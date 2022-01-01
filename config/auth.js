module.exports = 
   function ensureAuthenticated (req,res,next) {
        if(req.isAuthenticated()) {
        return next();
    }
    else
    {
        req.flash('error_msg' , 'please login to view this resource');
        res.redirect('/user/login');
    }
    }

