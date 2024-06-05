require ('dotenv').config({path:'./.env'});
const jwt = require('jsonwebtoken');
const AUTH_SECRET = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.status(401).json({ message: "No token provided." });
    }
  
    jwt.verify(token, AUTH_SECRET, (err, user) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ message: "Token has expired." });
        } else if (err instanceof jwt.JsonWebTokenError) {
          return res.status(403).json({ message: "Token is invalid." });
        }
        return res.status(500).json({ message: "Internal server error." });
      }
  
      req.user = user;
      next();
    });
  };

module.exports = authenticateToken