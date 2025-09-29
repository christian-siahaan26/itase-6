import e, { Request, Response } from "express";
import UserService from "./services";
import { getErrorMessage } from "../utils/error";
import { AuthRequest } from "../middleware/auth";
import { generateToken, verifyToken } from "../utils/jwt";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response) {
    try {
      const {
        name,
        email,
        google_id,
        password,
        date_of_birth,
        gender,
        height,
        weight,
      } = req.body;

      if (
        !name ||
        !email ||
        !password ||
        !date_of_birth ||
        !gender ||
        !height ||
        !weight
      ) {
        return res.status(400).json({
          success: false,
          message: "All field are required",
        });
      }

      const {
        user_id,
        email: userEmail,
        error,
      } = await this.userService.register({
        name,
        email,
        google_id,
        password,
        date_of_birth: new Date(date_of_birth),
        gender,
        height,
        weight,
      });

      if (error) {
        return res.status(500).json({
          success: false,
          message: getErrorMessage(error),
        });
      }

      const token = generateToken(user_id as string, userEmail as string);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, google_id, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All field are required",
        });
      }

      const { token, error } = await this.userService.login(email, password);

      if (error) {
        return res.status(500).json({
          success: false,
          message: getErrorMessage(error),
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login success",
        data: token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  }

  async authorize(req: AuthRequest, res: Response) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1] ?? "";
      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      }

      const { user_id, email } = decoded;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      }

      const newToken = generateToken(user_id, email);
      return res.status(200).json({
        success: true,
        message: "Success",
        data: newToken,
      });
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: getErrorMessage(error),
      });
    }
  }
}

export default UserController;
