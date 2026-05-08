require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();

// DB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('DB CONNECTED ✅'))
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const plannerRouter = require('./routes/planner');
const vaultRoutes = require("./routes/vault");
const expenseRoutes = require("./routes/expense");
const habitRoutes = require("./routes/habit");
const noteRoutes = require("./routes/note");
const dayflowRoutes = require("./routes/dayflow");

app.use("/planner", plannerRouter);
app.use("/vault", vaultRoutes);
app.use("/expense", expenseRoutes);
app.use("/habits", habitRoutes);
app.use("/notes", noteRoutes);
app.use("/dayflow", dayflowRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API WORKING 🚀");
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT} 🚀`);
});