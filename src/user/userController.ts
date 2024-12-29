import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import { userModel } from "./userModel";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  const userExist = await userModel.findOne({
    email,
  });
  if (!userExist) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } else {
    const userExistError = createHttpError(400, "User Already Exist");
    return next(userExistError);
  }
  res.status(200).json({ message: "User Registered" });
};
export default createUser;
