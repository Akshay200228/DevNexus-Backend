import jwt from 'jsonwebtoken';

// Authentication middleware
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token

        // Access user information using decodedToken._id, decodedToken.username, etc.

        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};
