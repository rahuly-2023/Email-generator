// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*", // Replace with your frontend URL if needed
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true, // Allow cookies to be sent
}));

app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Import routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const qrRoutes = require("./routes/qrRoutes");

// Use routes
app.use("/api", authRoutes);
app.use("/api", eventRoutes);
app.use("/api", qrRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Event Management API");
});



// const authMiddleware = require("./middleware/authMiddleware");
// const JWT_SECRET = "your_jwt_secret"; // Replace with a secure secret





// Listen on specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
