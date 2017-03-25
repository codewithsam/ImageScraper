const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let imageSchema = new Schema({
    payload: String,
    items: [],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

let ImageDB = mongoose.model('Image', imageSchema);

module.exports = ImageDB;