import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import UserRepository from "./repository";
import UserService from "./services";
import UserController from "./controller";
import jwt from "jsonwebtoken";
import passport from "passport";
import { authorize } from "../middleware/auth";

const router = Router();

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.post("/authorize", (req, res) => userController.authorize(req, res));

router.get("/:user_id", authorize, (req, res, next) =>
  userController.getUserData(req, res, next)
);
router.put("/:user_id", authorize, (req, res, next) =>
  userController.updateUserData(req, res, next)
);

// 1. Route untuk memulai proses login Google
// Frontend akan mengarah ke URL ini
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Route callback yang akan dipanggil oleh Google setelah user setuju
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login/failed`, // Arahkan jika gagal
    session: false, // Kita akan menggunakan JWT, bukan session
  }),
  (req, res) => {
    // req.user berisi data user dari callback passport.use di atas
    const user = req.user as any;

    // Buat JWT
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET!, // Pastikan ada JWT_SECRET di .env
      { expiresIn: "1d" }
    );

    // Redirect ke frontend dengan membawa token
    // Frontend harus bisa menangkap token ini dari URL parameter
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

export default router;
