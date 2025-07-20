import { Request, Response, Errback } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { inngest } from "../inngest/client";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, skills = [] } = req.body;
    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      skills,
    });
    await inngest.send({ name: "user/signup", data: { email } });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );
    const { password: _password, ...safeUser } = user.toObject();
    res.status(200).json({ user: safeUser, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Sign up failed", message: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Sign up failed", message: "Unknown error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    const { password: _password, ...safeUser } = user.toObject();
    res.status(200).json({ user: safeUser, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Login failed", message: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Login failed", message: "Unknown error occurred" });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // need to make
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Logout failed", message: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Logout failed", message: "Unknown error occurred" });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, role, skills, id } = req.body;
    // if (req?.user?.role !== "admin") {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (role === "admin") {
      user.role = role;
    }
    user.name = name;
    user.skills = skills;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Update failed", message: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Update failed", message: "Unknown error occurred" });
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user, message: "User fetched successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Get user failed", message: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Get user failed", message: "Unknown error occurred" });
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const skip = Number.isNaN(Number(req.query.skip))
      ? 0
      : parseInt(req.query.skip as string, 10); // for situation like "abc" => NaN & undefined → NaN

    let limit = Number.isNaN(Number(req.query.limit))
      ? 10
      : parseInt(req.query.limit as string, 10);
    limit = parseInt(req.query.limit as string) || 10;
    if (limit > 50) {
      limit = 50;
    }

    const users = await User.find().select("-password").skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.status(200).json({
      users,
      TotalUsers: total,
      message: "Users fetched successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: "Get users failed", message: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Get users failed", message: "Unknown error occurred" });
    }
  }
};
