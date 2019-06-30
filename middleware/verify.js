const jwt = require('jsonwebtoken');
const fs = require('fs');

const pubKey = fs.readFileSync('./config/public.key', 'utf8');

module.exports = (req, res, next) => {
  // Get token from the header
  const token = req.header('x-auth-token');

  // If no token, deny access
  if (!token) return res.status(401).json({ msg: 'Access Denied' });

  // Now verify the token
  try {
    const decoded = jwt.verify(token, pubKey, {expiresIn: '12h', algorithm: ['RS256']});
    
    req.user = decoded.user;

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Access Denied, there has been an error' });    
  }
};