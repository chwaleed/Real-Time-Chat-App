import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

// This can also be done
// userSchema.pre("save", async function (next) {
//   try {
//     const salt = await genSalt();
//     this.password = await hash(this.password, salt);
//     next();
//   } catch (error) {
//     console.error("Error hashing password:", error);
//     next(error);
//   }
// });

const User = mongoose.model("Users", userSchema);

export default User;
