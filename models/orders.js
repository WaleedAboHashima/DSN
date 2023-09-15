const mongoose = require("mongoose");

const orderSchema = mongoose.model(
  "orders",
  mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  })
);

module.exports = orderSchema;
