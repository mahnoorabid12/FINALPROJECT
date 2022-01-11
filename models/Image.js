
const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    title: {type: String, required:true},
    description: {type: String},
    filename: {type: String},
    path: {type: String},
    originalname: {type: String},
    mimetype: {type: String},
    size: { type: Number},
    created_at: {type: Date, default: Date.now()},
    authorname: {type:String},
    
      authorid: {                                      // update here
        type: Schema.Types.ObjectId, 
        ref: 'User'
      }
    
});
module.exports = model('Image', imageSchema);