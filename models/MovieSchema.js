const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: String,
  releaseDate: Date,
  rating: Number,
  actorIDs: [String],
  status: String,  
});


module.exports = mongoose.model('Movie', MovieSchema);