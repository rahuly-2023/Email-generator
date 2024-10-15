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

const { DB_USERNAME, DB_PASSWORD, DB_CLUSTER, DB_NAME } = process.env;

const encodedPassword = encodeURIComponent(DB_PASSWORD);

const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${encodedPassword}@${DB_CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));
  

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
