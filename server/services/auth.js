import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET; // Use consistent env key naming

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
     
    },
    secret,
    { expiresIn: '7d' } // Optional: token expiration
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null; // Or throw error if you want to handle it explicitly
  }
};
