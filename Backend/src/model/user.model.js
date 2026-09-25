import mongoose from 'mongoose';
import { USERNAME_MIN, USERNAME_MAX } from '../constants.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters`],
      maxlength: [USERNAME_MAX, `Username must be at most ${USERNAME_MAX} characters`],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;