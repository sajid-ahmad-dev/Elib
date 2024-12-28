import { config } from "./config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected to database successfully");
    });
    mongoose.connection.on("error", (err) => {
      console.log("error in connecting to database", err);
    });
    await mongoose.connect(config.database_Url as string);
  } catch (err) {
    console.error("Failed to connect to database", err);
    process.exit(1);
  }
};

export default connectDB;
