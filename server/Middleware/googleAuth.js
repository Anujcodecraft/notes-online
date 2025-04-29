import admin from '../config/firebase/firebase.js'
// This is theMiddleware to verify Firebase token
const verifyGoogleToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
//   console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};
export default verifyGoogleToken