// models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  venue: String,
  time: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model("Event", EventSchema);