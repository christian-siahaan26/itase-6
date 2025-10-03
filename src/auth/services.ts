import UserRepository from "./repository";
import { getErrorMessage } from "../utils/error";
import UserModel from "./model";
import { UserCreate, UserUpdate } from "./type/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { time } from "console";

const SECRET_KEY = process.env.JWT_SECRET as string;

class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async register(userData: UserCreate): Promise<{
    user_id: string | null;
    email: string | null;
    error: string | null;
  }> {
    try {
      if (!userData.password) {
        return {
          user_id: null,
          email: null,
          error: "Password is required for standard registration.",
        };
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const { user_id, email } = await this.userRepository.createUser({
        ...userData,
        password: hashedPassword,
      });

      return {
        user_id,
        email,
        error: null,
      };
    } catch (error) {
      return {
        user_id: null,
        email: null,
        error: getErrorMessage(error),
      };
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string | null; error: string | null }> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) return { token: null, error: "Invalid email or password" };

      if (!user.password) {
        return {
          token: null,
          error:
            "This account is registered with Google. Please log in with Google.",
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return { token: null, error: "Invalid email or password" };

      const token = jwt.sign(
        {
          user_id: user.user_id,
          email: user.email,
        },
        SECRET_KEY,
        {
          expiresIn: 3600,
        }
      );

      return {
        token,
        error: null,
      };
    } catch (error) {
      return {
        token: null,
        error: getErrorMessage(error),
      };
    }
  }

  async findUserData(user_id: string): Promise<UserModel | string> {
    try {
      const userData = await this.userRepository.findUserById(user_id);

      if (typeof userData === "string") {
        return userData;
      }

      if (!userData) {
        return "User data not found";
      }

      return userData;
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async updateUserData(
    user_id: string,
    userData: UserUpdate & { old_password?: string; new_password?: string }
  ): Promise<UserModel | string> {
    try {
      const existingUser = await this.userRepository.findUserById(user_id);

      if (typeof existingUser === "string") {
        return existingUser;
      }

      if (!existingUser) {
        return "User not found";
      }

      if (userData.new_password && userData.old_password) {
        if (!existingUser.toDTO().password) {
          return "Cannot change password for an account registered with Google.";
        }

        const isOldPasswordCorrect = await bcrypt.compare(
          userData.old_password,
          existingUser.toDTO().password!
        );

        if (!isOldPasswordCorrect) {
          return "Old password is incorrect"
        }

        const hashedNewPassword = await bcrypt.hash(userData.new_password, 10)
        
        userData.password = hashedNewPassword
      } else if (userData.new_password && !userData.old_password) {
        return "Old password is need to change password"
      }

      delete userData.new_password
      delete userData.old_password

      const result = await this.userRepository.updateUserData(
        user_id,
        userData
      );

      if (typeof result === "string") {
        return result;
      }

      return result;
    } catch (error) {
      return getErrorMessage(error);
    }
  }
}

export default UserService;
