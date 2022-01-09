const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema ({
    title : {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 4, 
    }
},{versionKey: false})

module.exports = mongoose.model ('movies', moviesSchema)