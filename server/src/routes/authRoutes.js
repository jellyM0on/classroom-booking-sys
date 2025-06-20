import express from "express";
import { register } from "../controllers/authController.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";
import { auth } from "../configs/firebase.js";

const router = express.Router();

router.post("/register", verifyToken, verifyAdmin, register);

router.post("/check-user-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    await auth.getUserByEmail(email);
    return res.status(200).json({ exists: true });
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
});

export default router;
