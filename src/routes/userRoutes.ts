import express from "express";
import {
  allUsers,
  registerUser,
  sendProfile,
  signIn,
  verifyEmail,
} from "controllers/userControllers";
import { validate } from "src/middleware/validate";
import { newUserSchema, verifyTokenSchema } from "utils/validationSchema";
import { protect } from "src/middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", validate(newUserSchema), registerUser);
authRouter.post("/verify", validate(verifyTokenSchema), verifyEmail);
authRouter.post("/sign-in", signIn);
authRouter.post("/profile", protect, sendProfile);

authRouter.get("/", allUsers);

export default authRouter;
