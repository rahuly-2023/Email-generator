const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Invitee = require("../models/Invitee");
const User = require("../models/User");



router.post("/scan-qr", async (req, res) => {
  try {
    const { qrCode, eventId } = req.body;
    console.log(qrCode, eventId);

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("event found");
    const invitee = await Invitee.findById(qrCode);
    if (!invitee) {
      return res.status(404).json({ message: "Invitee not found" });
    }
    console.log("invitee found");
    if (invitee.checkedIn) {
      return res.status(200).json({ message: "QR code scanned successfully", invitee });
    }
    invitee.checkedIn = true;
    await invitee .save();
    return res.status(200).json({ message: "QR code scanned successfully", invitee });
  } catch (error) {
    console.error(error);
 return res.status(500).json({ message: "Error scanning QR code" });
  }
});




router.put("/update-invitee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("in to update ",id);
    const invitee = await Invitee.findById(id);
    console.log("invitee found");
    if (!invitee) {
      return res.status(404).json({ message: "Invitee not found" });
    }
    invitee.checkedIn = req.body.checkedIn;
    await invitee.save();
    console.log("checked in")
    return res.status(200).json({ message: "Invitee updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating invitee" });
  }
});








module.exports = router;