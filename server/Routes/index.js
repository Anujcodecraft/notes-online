import express from 'express'
import { userModel } from '../models/user/model.js';
import pyqModel from '../models/pyq/model.js'
import { CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT } from '../utils/statuscode.js';
import { mainmiddleware } from '../Middleware/index.js';
import { generateToken,verifyToken } from '../services/auth.js';
import { notesModel } from '../models/notes/model.js';
import multer from 'multer';
import { storage } from '../cloudinary/index.js';
import bcrypt from "bcrypt"
export const Router = express.Router();

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
  
      const isMatch = await bcrypt.compare(password, userone.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = generateToken(userone)
    const { name:nametoSend, email:emailtoSend, verified } = userone; // or newly created user

      res.cookie('token', token, {  maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.status(200).json({ token,  user: { nametoSend, emailtoSend, verified } });
    } catch (err) {
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  });

  Router.post('/upload-notes', mainmiddleware, upload.single('file'), async (req, res) => {
    try {
      console.log("hello anuj");
  
      const { year, branch, subject } = req.body;
  
      const note = await notesModel.create({
        year,
        branch,
        subject,
        uploader: req.user.id,
        fileurl: req.file.path
      });
  
      console.log(req.file.mimetype);
  
      // Update the user's uploadedNotes array
      await userModel.findByIdAndUpdate(req.user.id, {
        $push: { uploadedNotes: note._id }
      });
  
      res.status(201).json(note);
    } catch (err) {
      console.log(err);
      console.log("ghii");
      res.status(400).json({ error: 'Note upload failed', details: err.message });
    }
  });
  Router.get('/notes', async (req, res) => {
    try {
      const { subject, branch, year } = req.query;
      console.log(subject,branch,year)
  
      // Validate query params
      if (!subject || !branch || !year) {
        return res.status(400).json({ error: 'Subject, Branch, and Year are required.' });
      }
  
      const notes = await notesModel.find({ subject, branch, year });

      console.log("the notes are",notes)
  
      res.status(200).json(notes);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to fetch notes', details: err.message });
    }
  });

  Router.post('/upload-pyqs', mainmiddleware, upload.single('file'), async (req, res) => {
    try {
      const { title, year, branch, subject } = req.body;
  
      // Validate title enum
      const allowedTitles = ['Mini', 'Mid', 'End'];
      if (!allowedTitles.includes(title)) {
        return res.status(400).json({ error: 'Invalid title. Must be one of mini, mid, end.' });
      }
  
      // Create PYQ entry
      const pyq = await pyqModel.create({
        title,
        year,
        branch,
        subject,
        uploader: req.user.id,
        fileurl: req.file.path,
      });
  
      // Update User Model
      await userModel.findByIdAndUpdate(req.user.id, {
        $push: { uploadedPYQs: pyq._id },
      });
  
      res.status(201).json(pyq);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'PYQ upload failed', details: err.message });
    }
  });

  Router.get('/pyqs', async (req, res) => {
    try {
      const { title, year, branch, subject } = req.query;
  
      const filter = {};
      if (title) filter.title = title;
      if (year) filter.year = year;
      if (branch) filter.branch = branch;
      if (subject) filter.subject = subject;
  
      const pyqs = await pyqModel.find(filter);
  
      res.status(200).json(pyqs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch PYQs', details: err.message });
    }
  });


  Router.post('/notes/:id/upvote', mainmiddleware, async (req, res) => {
    try {
      const noteId = req.params.id;
      const userId = req.user.id;
  
      const note = await notesModel.findById(noteId);
  
      if (!note) return res.status(404).json({ error: 'Note not found' });
  
      if (note.upvotes.includes(userId)) {
        return res.status(400).json({ error: 'You have already upvoted this note' });
      }
  
      note.upvotes.push(userId);
      await note.save();
  
      res.status(200).json({ message: 'Note upvoted successfully', totalUpvotes: note.upvotes.length });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upvote note', details: err.message });
    }
  });

  Router.get('/Profile',async (req,res)=>{
    try {
      //  console.log(req.body.email,req.body.name)
      console.log(req.body)
       res.status(200).json({ message: 'profile updated' });
    } catch (error) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
    }
  })