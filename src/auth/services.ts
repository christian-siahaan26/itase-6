import UserRepository from "./repository";
import { getErrorMessage } from "../utils/error";
import UserModel from "./model";
import { UserCreate, UserUpdate } from "./type/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto"
import { sendPasswordResetOTP } from "../utils/mailer";

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
          return "Old password is incorrect";
        }

        const hashedNewPassword = await bcrypt.hash(userData.new_password, 10);

        userData.password = hashedNewPassword;
      } else if (userData.new_password && !userData.old_password) {
        return "Old password is need to change password";
      }

      delete userData.new_password;
      delete userData.old_password;

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

  async forgotPassword(email: string): Promise<string> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user || !user.password) {
        // Jangan beri tahu jika user ada atau tidak untuk keamanan
        // Juga, user Google tidak bisa reset password
        return "If an account with that email exists, a password reset code has been sent.";
      }

      // 1. Buat OTP
      const otp = crypto.randomInt(100000, 1000000).toString();

      // 2. Hash OTP sebelum disimpan di DB
      const hashedOtp = await bcrypt.hash(otp, 10);
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

      // 3. Simpan OTP dan expiry di DB
      await this.userRepository.setUserPasswordResetToken(
        user.user_id,
        hashedOtp,
        expiry
      );

      // 4. Kirim email berisi OTP (yang tidak di-hash)
      await sendPasswordResetOTP(user.email, otp);

      return "A password reset code has been sent to your email.";
    } catch (error) {
      // Return pesan generik bahkan jika ada error, untuk keamanan
      console.error(error);
      return "If an account with that email exists, a password reset code has been sent.";
    }
  }

  async resetPassword(
    email: string,
    otp: string,
    new_password: string
  ): Promise<string> {
    try {
      const user = await this.userRepository.findUserByEmail(email);

      if (
        !user ||
        !user.password_reset_token ||
        !user.password_reset_expired ||
        user.password_reset_expired < new Date()
      ) {
        return "Invalid or expired password reset code.";
      }

      const isOtpValid = await bcrypt.compare(otp, user.password_reset_token);

      if (!isOtpValid) {
        return "Invalid or expired password reset code.";
      }

      const hashedNewPassword = await bcrypt.hash(new_password, 10);
      await this.userRepository.resetUserPassword(
        user.user_id,
        hashedNewPassword
      );

      return "Password has been reset successfully.";
    } catch (error) {
      return getErrorMessage(error);
    }
  }
}

export default UserService;
