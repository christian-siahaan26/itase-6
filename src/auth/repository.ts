import { PrismaClient, Prisma, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserCreate, UserUpdate } from "./type/user";
import { getErrorMessage } from "../utils/error";
import UserModel from "./model";

class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(user: UserCreate) {
    try {
      return await this.prisma.user.create({
        data: user,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          const target = error.meta?.target as string[];

          if (target.includes("name")) {
            throw new Error("Name already exist");
          }

          if (target.includes("email")) {
            throw new Error("Email already exist");
          }
        }
      }

      throw new Error(getErrorMessage(error));
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  async findUserById(user_id: string): Promise<UserModel | string | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_id,
        } as Prisma.UserWhereInput,
      });

      return user ? UserModel.formEntity(user) : null;
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async updateUserData(
    user_id: string,
    userData: UserUpdate
  ): Promise<UserModel | string> {
    try {
      const user = await this.prisma.user.update({
        where: {
          user_id,
        } as Prisma.UserWhereUniqueInput,
        data: {
          ...userData,
          updated_at: new Date(),
        },
      });

      return UserModel.formEntity(user);
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async findUserByPasswordResetToken(token: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        password_reset_token: token,
        password_reset_expired: {
          gt: new Date(),
        },
      },
    });
  }

  async setUserPasswordResetToken(
    user_id: string,
    token: string,
    expires: Date
  ): Promise<void> {
    await this.prisma.user.update({
      where: { user_id },
      data: {
        password_reset_token: token,
        password_reset_expired: expires,
      },
    });
  }

  async resetUserPassword(
    user_id: string,
    hashed_password: string
  ): Promise<void> {
    await this.prisma.user.update({
      where: { user_id },
      data: {
        password: hashed_password,
        password_reset_token: null,
        password_reset_expired: null,
        updated_at: new Date(),
      },
    });
  }
}

export default UserRepository;
