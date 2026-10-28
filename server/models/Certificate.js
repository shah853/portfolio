const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    recipientName: {
      type: String,
      trim: true,
    },
    issuer: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);