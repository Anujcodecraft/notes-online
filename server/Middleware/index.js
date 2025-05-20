import { verifyToken } from "../services/auth.js";

export const mainmiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Get the token after "Bearer"

  const result = verifyToken(token);
  if (!result) {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }

  req.user = result;
  // console.log("result in middleware ", req.user, req.body)
  // req.body.email = result.email;
  next();
};


const REGEX_EMAIL_TYPE=/^[a-zA-Z0-9._%+-]+@stu\.manit\.ac\.in$/;

export const checkEmail = (req, res, next) =>{
  const email = req.user.email || req.body.email;
  if(!REGEX_EMAIL_TYPE.test(email)){
    return res.status(401).json({message:"Please enter valid email id of campus"});
  }
  next();
}