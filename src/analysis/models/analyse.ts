import { Analyse as PrismaAnalyse } from "@prisma/client";

class AnalyseModel {
  private analyse_id: string;
  private user_id: string;
  private image_url: string;
  private created_at: Date;
  private updated_at: Date;

  constructor(
    analyse_id: string,
    user_id: string,
    image_url: string,
    created_at: Date,
    updated_at: Date
  ) {
    this.analyse_id = analyse_id;
    this.user_id = user_id;
    this.image_url = image_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static formEntiry(prismaAnalyse: PrismaAnalyse) {
    return new AnalyseModel(
      prismaAnalyse.analyse_id,
      prismaAnalyse.user_id,
      prismaAnalyse.image_url,
      prismaAnalyse.created_at,
      prismaAnalyse.updated_at
    );
  }

  toDTO() {
    return {
      analyse_id: this.analyse_id,
      user_id: this.user_id,
      image_url: this.image_url,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export default AnalyseModel
