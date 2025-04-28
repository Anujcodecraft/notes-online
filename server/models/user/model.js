import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'uploader', 'admin'],
    default: 'student'
  },
  isApproved: { type: Boolean, default: false },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "notes",
  }],
  pyqs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "pyqs",
  }],
  
  upvotes: { 
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'User',
    default: []  // Initialize as empty array
  },
  solution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "solution",
  },
  password: {
    type: String,
    required: true,
  },
  upvotes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "upvotes",
  },
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
  },
});

// 🔐 Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// ✅ Instance method to compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const userModel = mongoose.model("user", userSchema);
