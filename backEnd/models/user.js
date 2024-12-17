import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationToken: { type: String },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, default: 'user' },
    resetToken: { type: String },  
    resetTokenExpiration: { type: Date }
  });
  
  const User = mongoose.model('User', userSchema)

export default User
  