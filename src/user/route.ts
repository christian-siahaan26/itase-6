import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import UserRepository from "./repository";
import UserService from "./services";
import UserController from "./controller";

const router = Router();

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));
router.post("/authorize", (req, res) => userController.authorize(req, res));

export default router;
