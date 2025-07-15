import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db/mongoose";
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log("Sever running on Port", port);
    });
  })
  .catch((err) => console.log(err, "Server Starting Error"));
