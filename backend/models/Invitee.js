const mongoose = require("mongoose");

const inviteeSchema = new mongoose.Schema({
    email: String,
    qrCode: String,
    checkedIn: { type: Boolean, default: false },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  });

  
module.exports = mongoose.model("Invitee", inviteeSchema);
