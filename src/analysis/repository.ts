import { PrismaClient, Prisma } from "@prisma/client";
import AnalyseModel from "./models/analyse";
import { AnalyseCreate } from "./types/analyse";
import { getErrorMessage } from "../utils/error";
import { time } from "console";

class AnalyseRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAnalyseById(
    analyse_id: string
  ): Promise<AnalyseModel | string | null> {
    try {
      const analyse = await this.prisma.analyse.findFirst({
        where: {
          analyse_id,
        },
      });

      return analyse ? AnalyseModel.formEntiry(analyse) : null;
    } catch (error) {
      throw getErrorMessage(error);
    }
  }

  async createAnalysis(
    analyseData: AnalyseCreate
  ): Promise<AnalyseModel | string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: analyseData.email,
        },
      });

      if (!user) {
        return `User with email ${analyseData.email} not found`;
      }

      const analyse = await this.prisma.analyse.create({
        data: {
          image_url: analyseData.image_url,
          users: {
            connect: {
              email: analyseData.email,
            },
          },
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return AnalyseModel.formEntiry(analyse);
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async deleteAnalyse(analyse_id: string) {
    try {
      return await this.prisma.analyse.delete({
        where: {
          analyse_id,
        },
      });
    } catch (error) {
      return getErrorMessage(error);
    }
  }
}

export default AnalyseRepository;
