import mongoose from "mongoose";

const solutionSchema = mongoose.Schema({
   
    title:{
        type:String,
        enum: ['Mini', 'Mid','End'],
        req:true
    },
    subject:{
        type:"string",
        req:true
    },
    year:{
        type:"string",
        req:true
    },
    branch:{
        type:"string",
        req:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    upvotes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"upvotes"
    },
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
export const solutionModel = mongoose.model("solution",solutionSchema)