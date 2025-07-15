import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to DB");
  } catch (error) {
    console.log(error, "DB Connection Error");
  }
}
