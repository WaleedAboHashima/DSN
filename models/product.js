const mongoose = require("mongoose");

const productSchema = mongoose.model(
  "products",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  })
);

module.exports = productSchema;