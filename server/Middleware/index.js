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
  
  next();
};
