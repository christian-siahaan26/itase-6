import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserCreate } from "./type/user";
import { getErrorMessage } from "../utils/error";

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
          throw new Error("Email are alredy exist");
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
}

export default UserRepository;
