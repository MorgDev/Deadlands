const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const verify = require('../../middleware/verify');

const User = require('../../models/User');

const privKey = fs.readFileSync('./config/private.key', 'utf8');

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post(
  '/',
  [
    check('username', 'Username must be at least 6 characters.')
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    check('password', 'Password must be at least 8 characters')
      .not()
      .isEmpty()
      .isLength({ min: 8 })
  ],
  async (req, res) => {
    // Check for errors in our request body
    const errors = validationResult(req);

    // If we have errors, return them to the client.
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
      // See if username exists in database.
      let user = await User.findOne({ username });

      // If the username exists, ask the client for a new one.
      if (user)
        return res
          .status(400)
          .json({
            errors: [{ msg: 'Username already exists. Please choose another.' }]
          });

      // Define default role
      let role = 'user';

      // Get an array of all users
      const allUsers = await User.find();

      // If there are no users, this user is the Superadmin
      if (allUsers.length < 1) role = 'superadmin';

      // Build new user object
      user = new User({
        username,
        password,
        role
      });

      // Hash the password
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);

      // Save the user to the database
      await user.save();

      // Create a payload for our jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      // Create signing options for our jsonwebtoken
      const signOptions = {
        expiresIn: '12h',
        algorithm: 'RS256'
      };

      // Create our token and send it to the client.
      jwt.sign(payload, privKey, signOptions, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res
        .status(500)
        .send('Error creatin new user. Please contact a site admin.');
    }
  }
);

module.exports = router;