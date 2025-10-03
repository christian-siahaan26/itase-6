import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import UserRepository from "./repository";
import UserService from "./services";
import UserController from "./controller";
import passport from "passport";
import { generateToken } from "../utils/jwt";
import { authorize } from "../middleware/auth";

const router = Router();

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=true`,
    session: false,
  }),
  (req, res) => {
    const user = req.user as any;

    if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=true`);
    }

    const token = generateToken(user.user_id, user.email);

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.post("/authorize", (req, res) => userController.authorize(req, res));

router.get("/:user_id", authorize, (req, res, next) =>
  userController.getUserData(req, res, next)
);
router.patch("/:user_id", authorize, (req, res, next) =>
  userController.updateUserData(req, res, next)
);

router.post("/forgot-password",(req, res, next) => userController.forgotPassword(req, res, next));
router.post("/reset-password", (req, res, next) => userController.resetPassword(req, res, next));

export default router;
