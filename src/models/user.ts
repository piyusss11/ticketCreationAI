import mongoose from "mongoose";
interface IUser {
  name: string;
  email: string;
  password: string;
  roles: string;
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
    roles: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    skills: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
