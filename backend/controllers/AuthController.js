import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
// import { compare } from "bcrypt";
import bcrypt from "bcrypt";

const tokenAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, password) => {
  return jwt.sign({ email, password }, process.env.JWT_KEY, {
    expiresIn: tokenAge,
  });
};
export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const exsistingUser = await User.findOne({ email });
    if (exsistingUser) {
      return response
        .status(409)
        .json({ message: "User already exsits with this email" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ email, password: hashPassword });
    await user.save();
    response.cookie("jwt", createToken(email, user.id), {
      maxAge: tokenAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const signin = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "Email and Password is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ message: "User not Found" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return response.status(400).json({ message: "Password is incorrect" });
    }
    response.cookie("jwt", createToken(email, user.id), {
      maxAge: tokenAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: `Error : ${error}` });
  }
};
