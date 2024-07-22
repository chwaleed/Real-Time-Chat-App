import { sign } from "jsonwebtoken";
import User from "../models/UserModel";

const tokenAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, password) => {
  return sign({ email, password }, process.env.JWT_KEY);
};
export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password is required");
    }
    const user = await User.create({ email, password });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
