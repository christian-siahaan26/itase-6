import AnalyseRepository from "./repository";
import AnalyseModel from "./models/analyse";
import { AnalyseCreate } from "./types/analyse";
import { getErrorMessage } from "../utils/error";

class AnalyseService {
  private analyseRepository: AnalyseRepository;

  constructor(analyseRepository: AnalyseRepository) {
    this.analyseRepository = analyseRepository;
  }

  async findAnalyseById(analyse_id: string): Promise<AnalyseModel | string> {
    try {
      const analyse = await this.analyseRepository.findAnalyseById(analyse_id);

      if (typeof analyse === "string") {
        return analyse;
      }

      if (!analyse) {
        return "Analyse not found";
      }

      return analyse;
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async createAnalyse(
    analyseData: AnalyseCreate
  ): Promise<AnalyseModel | string> {
    try {
      const analyse = await this.analyseRepository.createAnalysis({
        ...analyseData,
      });

      if (typeof analyse === "string") {
        return analyse;
      }

      return analyse;
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async deleteAnalyse(analyse_id: string) {
    try {
      const existingAnalyse = await this.analyseRepository.findAnalyseById(
        analyse_id
      );

      if (typeof existingAnalyse === "string") {
        return existingAnalyse;
      }

      if (!existingAnalyse) {
        return "Analyse not found";
      }

      const result = await this.analyseRepository.deleteAnalyse(analyse_id);

      if (typeof result === "string") {
        return result;
      }
      return result;
    } catch (error) {
      return getErrorMessage(error);
    }
  }
}

export default AnalyseService;
