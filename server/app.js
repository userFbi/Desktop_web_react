const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();

// DB
mongoose.connect('mongodb://localhost:27017/Tp')
  .then(() => console.log('DB CONNECTED ✅'))
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const plannerRouter = require('./routes/planner');
app.use("/planner", plannerRouter);

// Test route
app.get("/", (req, res) => {
  res.send("API WORKING 🚀");
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT} 🚀`);
});