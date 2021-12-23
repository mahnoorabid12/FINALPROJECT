const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
  name :{type:String,required : true} ,
  email :{type  : String,required : true} ,
  password :{type  : String,required : true} ,
  date :{type : Date,default : Date.now}
});

const User= mongoose.model('User',UserSchema);//we’re using that schema in my User model.
                                           // All of your users will have the data in this format.
module.exports = User;
