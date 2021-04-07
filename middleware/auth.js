const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    res.redirect('superhans');
  } else {
    try {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          res.redirect('superhans');
        } else {
          req.user = decoded.user;
          next();
        }
      });
    } catch (err) {
      console.error('something wrong with auth middleware');
      res.status(500).json({ msg: 'Server Error' });
    }
  }
};

module.exports = auth;
