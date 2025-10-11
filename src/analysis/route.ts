import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import AnalyseRepository from "./repository";
import AnalyseService from "./service";
import AnalyseController from "./controller";
import upload from "../middleware/upload";
import { authorize } from "../middleware/auth";

const router = Router();

const prisma = new PrismaClient();
const analyseRepository = new AnalyseRepository(prisma);
const analyseService = new AnalyseService(analyseRepository);
const analyseController = new AnalyseController(analyseService);

router.post("/", authorize, upload.single("image_url"), (req, res, next) =>
  analyseController.createAnalyse(req, res, next)
);
router.get("/:analyse_id", (req, res, next) =>
  analyseController.getAnalyseById(req, res, next)
);
router.delete("/:analyse_id", (req, res, next) =>
  analyseController.deleteAnalyse(req, res, next)
);

export default router;
