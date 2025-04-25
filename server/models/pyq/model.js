import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ['Mini', 'Mid', 'End'],
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  fileurl: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // referencing the users who upvoted
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  }
});

const pyqModel = mongoose.model("pyq", pyqSchema);
export default pyqModel;
