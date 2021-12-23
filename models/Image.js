
const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    title: {type: String},
    description: {type: String},
    author:{type:String},
    filename: {type: String},
    path: {type: String},
    originalname: {type: String},
    mimetype: {type: String},
    size: { type: Number},
    created_at: {type: Date, default: Date.now()},
    authorname:{type:String}
});
module.exports = model('Image', imageSchema);