import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
export const checkAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET as string);
    const { _id, role } = verify as { _id: string; role: string };
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User not present in the DB" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Auth failed", message: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Auth failed", message: "Unknown error occurred" });
    }
  }
};
