import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Authentication failed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Pass the user's ID to the request object
        req.userId = decoded.userId;
        next();
        console.log('Successful', decoded);
    } catch (err) {
        console.log('Error decoding token:', err);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
