const mongoose = require("mongoose");
const userSchema = mongoose.model(
  "users",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
      enum: [500, 501],
    },
    QR: {
      type: String,
    },
    whatsApp: {
      type: String,
    },
  })
);

module.exports = userSchema;
