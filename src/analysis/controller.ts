import AnalyseService from "./service";
import { getErrorMessage } from "../utils/error";
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { cloudinary } from "../utils/cloudinary";
import streamifier from "streamifier";

class AnalyseController {
  private analyseService: AnalyseService;

  constructor(analyseService: AnalyseService) {
    this.analyseService = analyseService;
  }

  async getAnalyseById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized",
          });
        }

      const result = await this.analyseService.findAnalyseById(
        req.params.analyse_id
      );

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Success get analyse",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAnalyse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          success: false,
          message: "File image are required",
        });
      }

      const streamUpload = (buffer: Buffer): Promise<string> => {
        return new Promise((resolve, rejects) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "analyse" },
            (error, result) => {
              if (result?.secure_url) {
                resolve(result.secure_url);
              } else {
                rejects(error || new Error("Upload failed"));
              }
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const uploadedImageUrl = await streamUpload(req.file.buffer);

      const result = await this.analyseService.createAnalyse({
        image_url: uploadedImageUrl,
        email: req.user.email,
      });

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Success create analyse",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAnalyse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized",
          });
        }

      const result = await this.analyseService.deleteAnalyse(
        req.params.analyse_id
      );

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      return res.status(204).json({
        success: true,
        message: "Success delete analyse",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AnalyseController;
