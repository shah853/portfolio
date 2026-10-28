const mongoose = require('mongoose');
const { PROJECT_STATUS } = require('../constants');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    stack: {
      type: [String],
      required: true,
    },
    links: {
      github: {
        type: String,
      },
      live: {
        type: String,
      },
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        PROJECT_STATUS.COMPLETED,
        PROJECT_STATUS.IN_PROGRESS,
        PROJECT_STATUS.PLANNED,
      ],
      default: PROJECT_STATUS.COMPLETED,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);