import jwt from 'jsonwebtoken';


export const authenticate = (req, res, next) => {

    console.log('Authenticating request...')
  
    const token = req.headers.authorization?.split(' ')[1];
  
    console.log('Token:', token)
  
    if (!token) {
      console.log('No token provided')
      return res.status(401).json({ message: 'Authentication failed' }); 
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      console.log('Token decoded:', decoded);
  
      req.user = decoded; 

      next();

      console.log("Sucessfull")
  
    } catch (err) {
      console.log('Error decoding token:', err)
      res.status(401).json({ message: 'Authentication failed' });
    }
  };
  