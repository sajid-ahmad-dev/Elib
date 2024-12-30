import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import { userModel } from "./userModel";
import bcrypt from "bcrypt";
import { config } from "../config/config";
import { sign } from "jsonwebtoken";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    // Check if the user already exists
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return next(createHttpError(400, "User already exists"));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err); // Pass any errors to the global error handler
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }
  try {
    const userExist = await userModel.findOne({
      email,
    });
    if (userExist) {
      const comparePassword = await bcrypt.compare(
        password,
        userExist.password
      );
      if (!comparePassword) {
        return next(createHttpError(400, "Wrong credentials"));
      }
      const token = sign({ sub: userExist._id }, config.jwtSecret as string);
      res
        .status(200)
        .json({ message: "You are logged In successfully", token: token });
    }
  } catch (err) {
    next(err);
  }
};

export { createUser, login };
