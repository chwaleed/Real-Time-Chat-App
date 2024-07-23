import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

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
    const user = await User.create({ email, password });
    const token = createToken(email, user.id);
    response.cookie("jwt", token, {
      maxAge: tokenAge, // Set the cookie expiration to match the JWT
      secure: true, // Ensure HTTPS is used
      sameSite: "None", // Only use if necessary and properly secured
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
