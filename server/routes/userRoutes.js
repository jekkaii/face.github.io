import express from "express";
import {
  getUsers,
  addUser,
  editUser,
  deleteUser,
  updateStatus,
  getAllUsers,
  getUserById,
} from "../controller/adminController.js";
import upload from "../config/multer-config.js"; // Your multer config// multer config

const router = express.Router();

// User
router.get("/users", getUsers);
router.post("/users", addUser);
router.put("/users/:id", upload.single("photo"), editUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/status", updateStatus);
router.get("/users/:id", getUserById);
router.get("/users/all", getAllUsers);

export default router;
