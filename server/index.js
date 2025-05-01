import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './database/db.js';
import { Router } from './Routes/index.js';


const PORT = process.env.PORT
const app = express()
app.use(cors())
app.use(cookieParser());
app.use(express.json()); // Parses JSON payloads
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); // Serves files from 'public' folder
app.use(express.urlencoded({ extended: true })); // ✅ Parses form-urlencoded

app.get('/',(req, res)=>{
    res.send("<h1>hello jaitin</h1>")
})
app.use('/',Router)
// Connect to MongoDB
const connectWithRetry = () => {
    connectDB()
        .then(() => {
            // If the connection is successful, we start the server
            app.listen(PORT, () => {
                console.log(`Server is running on port: ${PORT}`);
            });
        })
        .catch((err) => {
            // If there's an error, log the error and exit the process
            console.error("❌ MongoDB connection failed:", err.message);
            process.exit(1); // Exit with a failure code
        });
};

// Call the function to connect to MongoDB
connectWithRetry();
