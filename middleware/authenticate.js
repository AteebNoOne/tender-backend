import jwt from 'jsonwebtoken';
import { User } from '../model/User.js';
import ErrorHandler from '../utils/errorHandler.js';

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

  if (!token) {
    return next(new ErrorHandler('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    return next(new ErrorHandler('Invalid token', 401));
  }
};

export default authenticate; // Default export
