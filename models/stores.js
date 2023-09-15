const mongoose = require("mongoose");

const storeSchema = mongoose.model(
  "stores",
  mongoose.Schema({
    storeName: {
      type: String,
      required: true,
    },
    storeDescription: {
      type: String,
      required: true,
    },
    termsOfUse: {
      type: String,
      required: true,
    },
  })
);

module.exports = storeSchema;