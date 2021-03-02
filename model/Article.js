const mongoose = require('mongoose');

//     'learn-react': { upvotes: 0, downvotes: 0, comments: [] },

const articleSchema = new mongoose.Schema({
    name: String,
    upvotes: Number,
    downvotes: Number,
    comments: []
});

module.exports = mongoose.model('Article', articleSchema);