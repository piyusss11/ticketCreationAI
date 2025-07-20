import mongoose from "mongoose";
export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: string;
  skills: string[];
}
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    skills: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
