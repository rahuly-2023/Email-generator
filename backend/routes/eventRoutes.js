
const axios = require('axios');


// router.post("/create-event", async (req, res) => {
//   const { name, venue, date, time, description, ownerEmail } = req.body;

//   try {
    
//     const owner = await User.findOne({ email: ownerEmail });
//     if (!owner) {
//       return res.status(404).json({ message: "Owner not found" });
//     }


//     const newEvent = new Event({ name, venue, date, time, description, owner: owner._id});
//     await newEvent.save();
//     console.log("E created");
    

//     if (req.body.contacts) {
//       const commaSeparatedContacts = req.body.contacts;
//       for (const contact of commaSeparatedContacts) {
//         const newInvitee = new Invitee({ email: contact, event: newEvent._id, qrCode:"R" });
//         await newInvitee.save();
//         // console.log("I ",res);
//         // await axios.post("http://localhost:5000/api/add-invitee", {email:contact, event:newEvent._id });
//       }
//       res.status(200).json({message: "Event created and mail sent successfully"});
//     } else if (req.file) {
//       const csvData = [];
//       fs.createReadStream (req.file.path)
//         .pipe(csv())
//         .on("data", (data) => csvData.push(data))
//         .on("end", async () => {
//           for (const contact of csvData) {
//             const newInvitee = new Invitee({ email: contact.email, event: newEvent._id });
//             await newInvitee.save();
//             // console.log("I ",res);
//             // await axios.post("http://localhost:5000/api/add-invitee", {email:contact.email, event:newEvent._id });
//           }
//           res.status(200).json({message: "Event created and mail sent successfully"});
//         });
//     }
//     else{
//       res.status(200).json({ message: "Event created successfully, You can proceed to add invitee" });
//     }

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Event creation failed" });
//   }
// });

// router.get("/view-event", async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.status(200).json(events);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Event retrieval failed" });
//   }
// });

// router.post("/add-invitee", async (req, res) => {
//   const { email, event } = req.body;

//   try {
//     const newInvitee = new Invitee({ email: email, event: event, qrcode: "e" });
//     await newInvitee.save();
//     console.log("I added")
//     // res.status(200).json({ message: "User added to event successfully" });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "User addition to event failed" });
//   }
// });

// module.exports = router;






















const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Invitee = require("../models/Invitee");
const User = require("../models/User");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const qrcode = require("qrcode");
const nodemailer = require("nodemailer");
const upload = multer({ dest: "uploads/" });

router.post("/create-event", async (req, res) => {
  try {
    console.log(req.body);
    
    const { name, venue, date, time, description, ownerEmail } = req.body;

    const owner = await User.findOne({ email: ownerEmail });
    console.log("Owner");
    
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    console.log("Owner found")

    const newEvent = new Event({ name, venue, date, time, description, owner: owner._id });
    await newEvent.save();
    console.log("E created");
    

    res.status(200).json({ message: "Event created successfully", eventId: newEvent._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Event creation failed" });
  }
});

router.post("/add-invitee", async (req, res) => {
  try {
    const { eventId, contacts } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    console.log(contacts)

    const commaSeparatedContacts = contacts.split(",");
    for (const contact of commaSeparatedContacts) {
      const newInvitee = new Invitee({ email: contact, event: eventId });
      await newInvitee.save();

      // Generate a QR code for the invitee
      const qrCode = await qrcode.toDataURL(String(newInvitee._id));
      const qrCodeBuffer = Buffer.from(qrCode.replace(/^data:image\/png;base64,/, ""), "base64");
      newInvitee.qrCode = qrCode;
      await newInvitee.save();

      // Send an email to the invitee with the QR code
      await sendEmail(contact, event, qrCodeBuffer);
    }

    res.status(200).json({ message: "Invitees added and emails sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invitee addition failed" });
  }
});

router.post("/add-invitee/csv", upload.single("csvFile"), async (req, res) => {
  try {
    const { eventId } = req.body;
    const csvFile = req.file;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const csvData = [];
    fs.createReadStream(csvFile.path)
      .pipe(csv())
      .on("data", (data) => csvData.push(data))
      .on("end", async () => {
        for (const contact of csvData) {
          const newInvitee = new Invitee({ email: contact.email, event: eventId });
          await newInvitee.save();

          // Generate a QR code for the invitee
          const qrCode = await qrcode.toDataURL(String(newInvitee._id));
          const qrCodeBuffer = Buffer.from(qrCode.replace(/^data:image\/png;base64,/, ""), "base64");
          newInvitee.qrCode = qrCode;
          await newInvitee.save();

          // Send an email
          await sendEmail(contact.email, event, qrCodeBuffer);
        }

        res.status(200).json({ message: "Invitees added and emails sent successfully" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invitee addition failed" });
  }
});

async function sendEmail(email, event, qrCodeBuffer) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
      user: "rahul8700yadav@gmail.com",
      pass: "pomozhmycxvilkkn"
    }
  });

  const mailOptions = {
    from: "rahul8700yadav@gmail.com",
    to: "rahul2483yadav@gmail.com",
    subject: `Invitation to ${event.name}`,
    text: `You are invited to ${event.name} on ${event.date} at ${event.time}. Please scan the QR code to check-in.`,
    html: `
    <h1>Invitation to ${event.name}</h1>
    <p>You are invited to ${event.name} on ${event.date} at ${event.time}.</p>
      <p>Please scan the QR code to check-in.</p>
    `,
    attachments: [
      {
        filename: "qr_code.png",
        content: qrCodeBuffer,
        cid: "qr_code"
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}













router.get("/view-events", async (req, res) => {
  try {
    const ownerEmail = req.query.ownerEmail;
    const user = await User.findOne({ email: ownerEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const events = await Event.find({ owner: user._id });
    // console.log("Events retrieved ", events);
    
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching events" });
  }
});



router.get("/view-events/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id).populate("owner", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching event" });
  }
});

router.get("/view-events/:id/invitees", async (req, res) => {
  try {
    const id = req.params.id;
    const invitees = await Invitee.find({ event: id });
    res.status(200).json(invitees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching invitees" });
  }
});


module.exports = router;