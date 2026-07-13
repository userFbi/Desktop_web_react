const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();

// ── Middleware ─────────────────────────
app.use(cors({
  origin: "*",
  credentials: false
}));
app.use(express.json());
app.use(cookieParser());

// ── DB ────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Tp";
mongoose.connect(MONGO_URI)
  .then(() => console.log(`DB CONNECTED ✅ (${MONGO_URI.startsWith("mongodb+srv") ? "Atlas" : "Local"})`))
  .catch(err => console.log(err));

// ── Routes (AFTER middleware) ──────────────────
const authRouter = require('./routes/auth');
const plannerRouter = require('./routes/planner');
const vaultRoutes = require("./routes/vault");
const expenseRoutes = require("./routes/expense");
const habitRoutes = require("./routes/habit");
const notesRoutes = require("./routes/notes");
const dayflowRoutes = require("./routes/dayflow");
const scratchRoutes = require("./routes/scratch");

app.use('/api/auth', authRouter);
app.use("/planner", plannerRouter);
app.use("/vault", vaultRoutes);
app.use("/expense", expenseRoutes);
app.use("/habits", habitRoutes);
app.use("/notes", notesRoutes);
app.use("/dayflow", dayflowRoutes);
app.use("/scratch", scratchRoutes);

// ── Test Route ────────────────────────────────
app.get("/", (req, res) => res.send("API WORKING 🚀"));

// ── Error Handler ─────────────────────────────
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// ── Start Server ──────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SERVER RUNNING ON ${PORT} 🚀`));