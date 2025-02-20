import express from "express";
import cors from "cors"; //For cross platform compatability
import dotenv from "dotenv"; // Used to manage environment variables like URL front and back and mongodb
import { connectToDatabase } from "./database/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import faceRecognitionRoutes from "./routes/faceRecognitionRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/teacher", studentRoutes, classRoutes, attendanceRoutes);
app.use("/api/admin", userRoutes, faceRecognitionRoutes);

// Serve static files (for uploaded images)
app.use("/uploads", cors(), express.static("uploads"));

app.listen(process.env.PORT, () => {
  connectToDatabase();
  console.log(`Server is running on port ${process.env.PORT}!`);
});
