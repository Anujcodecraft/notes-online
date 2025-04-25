import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  notes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "notes",
  },
  pyq: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pyq",
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
