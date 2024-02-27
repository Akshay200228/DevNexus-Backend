// Middleware
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    const jwtTokenUser = process.env.JWT_SECRET;

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Authentication failed' });
    }

    try {
        console.log("Start middleware")
        const decoded = jwt.verify(token, jwtTokenUser);
        const user = await User.findById(decoded.userId);

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Attach user details to the request object
        req.userId = decoded.userId;

        next();
        console.log("Done middleware")
    } catch (err) {
        console.log('Error decoding token:', err);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
