import UserRepository from "./repository";
import { getErrorMessage } from "../utils/error";
import UserModel from "./model";
import { UserCreate } from "./type/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
}

export default UserService;
