import express from 'express'
import { userModel } from '../models/user/model.js';
import pyqModel from '../models/pyq/model.js'
import { CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT } from '../utils/statuscode.js';
import { mainmiddleware } from '../Middleware/index.js';
import { generateToken } from '../services/auth.js';
import { notesModel } from '../models/notes/model.js';
import multer from 'multer';
import { storage } from '../cloudinary/index.js';
import verifyGoogleToken from '../Middleware/googleAuth.js'
import bcrypt from "bcrypt"
export const Router = express.Router();
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const upload = multer({ storage });




Router.post('/signup', async (req, res) => {
  try {
    console.log("yha huna");

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(NO_CONTENT).json({ message: "Please provide all fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) return res.status(NO_CONTENT).json({ message: "Service unavailable" });
    const token = generateToken(user)
    res.cookie('token', token, {  maxAge: 7 * 24 * 60 * 60 * 1000 });
    const { name:nametoSend, email:emailtoSend, verified } = user; // or newly created user
    return res.status(CREATED).json({
      message: "User Registered Successfully",
      token,
      user: { nametoSend, emailtoSend, verified }
    });

  } catch (error) {
    console.log(error);
    return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});


Router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const userone = await userModel.findOne({ email });
      console.log(userone)
      if (!userone) return res.status(404).json({ message: 'User not found' });
  
      const isMatch =  bcrypt.compare(password, userone.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = generateToken(userone)
    const { name:nametoSend, email:emailtoSend, verified } = userone; // or newly created user

      res.cookie('token', token, {  maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(200).json({ token,  user: { nametoSend, emailtoSend, verified } });
    } catch (err) {
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  });

Router.post('/google-auth', verifyGoogleToken, async (req, res) => {
  try {
      // console.log(req.user)
      const { name, email, picture } = req.user;
      let user = await userModel.findOne({ email });
      if (!user) {
          user = await userModel.create({
              name,
              email,
              provider: "google",
              profilePicture:picture
          });
          if (!user) {
              return res.status(500).json({
                  message: "User  creation failed",
              });
          }
      }
      const token = generateToken({_id:user._id, email:email});
      res.status(200).json({ user: {nametoSend:name, emailtoSend:email, verified:true}, token });
  } catch (error) {
      return res.status(500).json({
          message: error.message,
      });
  }
})

Router.post('/upload-notes', mainmiddleware, upload.single('file'), async (req, res) => {
  try {
    console.log(req.file);
    console.log("Received upload request");
    const { year, branch, subject, email } = req.body;

    // Find the user by email
    const UUser = await userModel.findOne({ email });

    // if ( UUser.role !== 'uploader') {
    //   return res.status(403).json({ error: 'Approval required for uploading' });
    // }

    if (!UUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create note
    const note = await notesModel.create({
      year,
      branch,
      subject,
      user: UUser._id,
      fileurl: req.file.path,
    });
    console.log("the uploader id is as follows",note.user)

    // Add note ID to user's notes array
    await userModel.findByIdAndUpdate(UUser._id, {
      $push: { notes: note._id },
    });

    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Note upload failed', details: err.message });
  }
});
  
  Router.get('/notes', mainmiddleware, async (req, res) => {
    try {
      const { subject, branch, year } = req.query;

      // Validate query params
      const filter = {};
    
      const page = parseInt(req.query.page) || 0;
      
      if (year) filter.year = year;
      if (branch) filter.branch = branch;
      if (subject) filter.subject = subject;
      
      const notes = await notesModel.find(filter).skip(page*6).limit(6)
      .populate('user', 'name') // Populate the uploader field with just the name
      .exec();
    
      res.status(200).json(notes);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to fetch notes', details: err.message });
    }
  });
  

  const allowedTitles = ['Mini', 'Mid', 'End'];
  const allowedBranches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'CHE'];
  // Add more allowed values for year and subject as needed
  
  Router.post('/upload-pyqs', mainmiddleware, upload.single('file'), async (req, res) => {
    try {
        const { title, year, branch, subject,email } = req.body;
        // const { email } = req.user; // Get email from authenticated user

        console.log("Received data:", { title, year, branch, subject, email });



        // Validate required fields
        if (!title || !year || !branch || !subject || !req.file) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['title', 'year', 'branch', 'subject', 'file']
            });
        }

        // Validate title enum
        if (!allowedTitles.includes(title)) {
            return res.status(400).json({ 
                error: 'Invalid title',
                allowedTitles: allowedTitles
            });
        }

        // Validate branch
        if (!allowedBranches.includes(branch)) {
            return res.status(400).json({ 
                error: 'Invalid branch',
                allowedBranches: allowedBranches
            });
        }

        // Sanitize inputs
        const sanitizedYear = year.trim();
        const sanitizedSubject = subject.trim();

        // Find user by email from authenticated request
        const UUser = await userModel.findOne({ email });
        
      // if ( UUser.role !== 'uploader') {
      //   return res.status(403).json({ error: 'Approval required for uploading' });
      // }
        if (!UUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create PYQ entry
        const pyq = await pyqModel.create({
          title,
          year: sanitizedYear,
          branch,
          subject: sanitizedSubject,
          user: UUser._id,
          fileurl: req.file.path,
          // Remove this line: upvotes: 0,
          createdAt: new Date()
        });
        console.log("the user uploader is",pyq.uploader);
        
        // Update User Model
        await userModel.findByIdAndUpdate(
            UUser._id, 
            { $push: { pyqs: pyq._id } },
            { new: true, runValidators: true }
        ).catch(err => {
            console.error('Failed to update user:', err);
        });

        // Return success response
        res.status(201).json({
            message: 'PYQ uploaded successfully',
            pyq: {
                id: pyq._id,
                title: pyq.title,
                year: pyq.year,
                branch: pyq.branch,
                subject: pyq.subject,
                fileurl: pyq.fileurl,
                uploader: {
                    id: UUser._id,
                    name: UUser.name,
                    email: UUser.email
                }
            }
        });

    } catch (err) {
        console.error('PYQ upload error:', err);
        
        // Handle specific errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: err.errors 
            });
        }

        // Generic error response
        res.status(500).json({ 
            error: 'PYQ upload failed',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


Router.get('/pyqs',  async (req, res) => {
  try {
    const { title, year, branch, subject } = req.query;
    const filter = {};
    
    if (title) filter.title = title;
    if (year) filter.year = year;
    if (branch) filter.branch = branch;
    if (subject) filter.subject = subject;
    
    const pyqs = await pyqModel.find(filter)
    .populate('user', 'name') // Populate the uploader field with just the name
    .exec();
  
    res.status(200).json(pyqs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch PYQs' });
  }
});



Router.post('/notes/:id/upvote', mainmiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;
    const email = req.body.email;
    console.log("heyy")
    const user = await userModel.findOne({ email: email });
    // From middleware (decoded JWT)
    console.log("the name of owner are",user)

   
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const note = await notesModel.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Check if the user has already upvoted
    if (note.upvotes.includes(user._id)) {
      return res.status(400).json({ error: 'You have already upvoted this PYQ' });
    }

    note.upvotes.push(user._id);
    await note.save();

    res.status(200).json({
      message: 'Note upvoted successfully',
      totalUpvotes: note.upvotes.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upvote note', details: err.message });
  }
});


  Router.get('/my-notes', async (req, res) => {
    try {
      const { email } = req.query;
      console.log("the email is that getting ",email)
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      // Find user and populate their uploaded notes
      const user = await userModel.findOne({ email }).populate('notes');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user.notes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch notes', details: err.message });
    }
  });


  Router.get('/my-pyqs', async (req, res) => {
    try {
      const { email } = req.query;
      console.log("the email is that getting ",email)
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
      // Find user and populate their uploaded notes
      console.log("here at pos2 ")
      const user = await userModel.findOne({ email }).populate('pyqs');
       console.log("the user is ",user)
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      console.log("now i am herer at current ")
      res.status(200).json(user.pyqs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch pyqs', details: err.message });
    }
  });

  Router.delete('/delete-note/:noteId', async (req, res) => {
    try {
      const { noteId } = req.params;
  
      // Find the note
      const note = await notesModel.findById(noteId);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      // Delete the note
      await notesModel.findByIdAndDelete(noteId);
  
      // Remove note reference from user's notes array
      await userModel.updateOne(
        { notes: noteId },
        { $pull: { notes: noteId } }
      );
  
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
      console.error('Error deleting note:', err);
      res.status(500).json({ error: 'Failed to delete note', details: err.message });
    }
  });
  
  Router.post('/pyqs/:id/upvote', mainmiddleware, async (req, res) => {
    try {
      const pyqId = req.params.id;
      const email = req.body.email; // From the authenticated user

      console.log("am here",email)
     
      const user = await userModel.findOne({ email: email });
  
      const pyq = await pyqModel.findById(pyqId);
  
      if (!pyq) return res.status(404).json({ error: 'PYQ not found' });
  
      // Check if the user has already upvoted
      if (pyq.upvotes.includes(user._id)) {
        return res.status(400).json({ error: 'You have already upvoted this PYQ' });
      }
      console.log(user._id)
  
      // Add user ID to upvotes array
      pyq.upvotes.push(user._id);
      await pyq.save();
  
      res.status(200).json({
        message: 'PYQ upvoted successfully',
        totalUpvotes: pyq.upvotes.length
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upvote PYQ', details: err.message });
    }
  });


  Router.delete('/delete-pyq/:pyqId', async (req, res) => {
    try {
      const { pyqId } = req.params;
  
      // Find the note
      const pyq = await pyqModel.findById(pyqId);
      if (!pyq) {
        return res.status(404).json({ error: 'pyq not found' });
      }
  
      // Delete the note
      await pyqModel.findByIdAndDelete(pyqId);
  
      // Remove note reference from user's notes array
      await pyqModel.updateOne(
        { pyqs: pyqId },
        { $pull: { pyqs: pyqId } }
      );
  
      res.status(200).json({ message: 'pyq deleted successfully' });
    } catch (err) {
      console.error('Error deleting pyq:', err);
      res.status(500).json({ error: 'Failed to delete pyq', details: err.message });
    }
  });


  const otpStorage = new Map();


  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  
  const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: otp,
      html: `<p>Your OTP code is: <b>${otp}</b></p><p>It is valid for the next 5 minutes.</p>`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };
  
  
  const generateOtp = (userid) => {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000);
      otpStorage.set(userid, { otp, expiresAt: Date.now() + 300000 });
      return otp;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }


  Router.post('/send-otp', async (req, res)=>{
    try {
      const {email} = req.body;
      const otp = generateOtp(email);
      // console.log("otp is ", otpStorage.get(email))
      const response = await sendOtpEmail(email, otp);
      if(!response){
        return res.status(401).json({message:"Failed to Send OTP"});
      }
      return res.status(200).json({message:"Sent OTP"})
    } catch (error) {
      console.log(error.message)
    }
  })

  Router.post('/verify-otp', async(req, res)=>{
    try {
      const { email, otp } = req.body;
      // console.log("otp storage ", otpStorage)
      const savedOtp = otpStorage.get(email);
      // console.log("otps are ", savedOtp, otp)
      if(String(savedOtp['otp'])===otp){
        return res.status(200).json({message:"Verified"});
      }
      return res.status(401).json({message:"Wrong Otp"})
    } catch (error) {
      console.log(error)
    }
  })