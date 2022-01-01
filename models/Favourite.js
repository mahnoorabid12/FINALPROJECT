
const { Schema, model } = require('mongoose');

const FavouriteSchema = new Schema({
    Currentuser: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
      imageid: {
          type: Schema.Types.ObjectId,
          ref:'Image'
      }
});
module.exports = model('Favourite', FavouriteSchema);