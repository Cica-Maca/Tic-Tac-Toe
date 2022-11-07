const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name!'],
    minLength: 5,
    maxLength: 20,
    unique: [true, 'Name is already in use!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email address!'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email!',
    ],
    unique: [true, 'Email is already in use!'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minLength: 6,
  },
  pointsVsBot: {
    type: Number,
    default: 0,
  },
  statsVsBot: {
    type: Map,
    of: Number,
    default: {
      won: 0,
      drew: 0,
      lost: 0,
    },
  },
});

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { UserID: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
