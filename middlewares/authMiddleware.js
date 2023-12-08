import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Authentication failed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch user details, including avatar, from the database
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Attach user details to the request object
        req.userId = decoded.userId;
        req.userAvatar = user.avatar;

        next();
        console.log('Authentication successful', decoded);
    } catch (err) {
        console.log('Error decoding token:', err);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
