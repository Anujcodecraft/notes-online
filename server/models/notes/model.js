import mongoose from "mongoose";

const notesSchema = mongoose.Schema({
    subject:{
        type:"string",
        req:true
    },
    year:{
        type:"string",
        req:true
    },
    uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // reference to the User model
    required: true,
  },
    branch:{
        type:"string",
        req:true
    },
    fileurl:{
     type:"string"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // referencing the users who upvoted
  }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    verified: { type: Boolean, default: false }


})
export const  notesModel = mongoose.model("notes",notesSchema)