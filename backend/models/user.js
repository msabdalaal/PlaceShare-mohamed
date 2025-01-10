import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 3,
    select: false,
  },
  image: { type: String, required: true },
  places: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Place",
    },
  ],
});
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save",async function (next){
  if(this.password)
    {this.password=await bcrypt.hash(this.password,12);}
  next()
})
userSchema.methods.checkPassword=async function(pass1,pass2){
  return await bcrypt.compare(pass1,pass2); 
}
const User = mongoose.model.User || mongoose.model("User", userSchema);
export default User;
