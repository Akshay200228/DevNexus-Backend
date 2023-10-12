import jwt from 'jsonwebtoken';

// Authentication middleware
export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    try {
        // Verify the token with your JWT secret
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            // Access user information using decodedToken._id, decodedToken.username, etc.
            req.user = decodedToken; // Add the user data to the request object for later use
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export default authenticate;
