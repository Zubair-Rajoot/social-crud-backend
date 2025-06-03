const jwt = require('jsonwebtoken');

const JWT_SECRET = "zubair123"
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied: No token provided');
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    if (verified) {
      next();
    }

  } catch (error) {
    res.status(403).send('Invalid Token');
  }
}


module.exports = authMiddleware