const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  banned: {
    type: Boolean,
    default: false
  },
  banreason: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = User = mongoose.model('users', UserSchema);