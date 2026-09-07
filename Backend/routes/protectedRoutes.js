const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/protected', auth, (req, res) => {
  res.status(200).json({
    message: 'Access granted',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

module.exports = router;
