const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

/* ================= DB CONNECTION ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(">>> SYSTEM_CONNECTED_TO_CLOUD_DB"))
  .catch(err => console.error(">>> DB_SYNC_FAILED", err));

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* ================= ROUTES ================= */
// ❌ REMOVE indexRouter (not needed)
// const indexRouter = require('./routes/index');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const vaultRouter = require('./routes/vault');

app.use('/api/vault', vaultRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found"
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message
  });
});

module.exports = app;