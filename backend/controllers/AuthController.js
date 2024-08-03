import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
// import { compare } from "bcrypt";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const tokenAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
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

export const getUserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response
        .status(404)
        .json({ message: "User with given id not found" });
    }
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    return response.status(500).json({ message: `Error : ${error}` });
  }
};

export const updateProfile = async (request, response, next) => {
  try {
    const { userId } = request;
    const { firstName, lastName, color } = request.body;
    if (!firstName || !lastName) {
      return response.status(400).json({
        message: "Firstname, Lastname and color is required.",
      });
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log("Error");
  }
};

export const addProfileImage = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).json({ message: "File not found" });
    }
    const date = Date.now();
    let filename = "uploads/profiles/" + date + request.file.originalname;
    renameSync(request.file.path, filename);
    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: filename },
      { new: true, runValidators: true }
    );
    return response.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;
    // console.log(request);
    // console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found." });
    }
    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();
    return response
      .status(200)
      .json({ message: "Profile Image removed Successfuly" });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
};

export const logOut = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).json({ message: "Logout successfuly" });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
