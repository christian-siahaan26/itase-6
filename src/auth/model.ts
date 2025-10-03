import { type User as PrismaUser } from "@prisma/client";

class UserModel {
  private user_id: string;
  private name: string | null;
  private email: string;
  private google_id: string | null;
  private password: string | null;
  private date_of_birth: Date | null;
  private gender: string | null;
  private height: number | null;
  private weight: number | null;
  private bmr: number | null;
  private calorie: number | null;
  private carbohydrate: number | null;
  private protein: number | null;
  private fat: number | null;
  private vitamin_a: number | null;
  private vitamin_c: number | null;
  private vitamin_d: number | null;
  private vitamin_e: number | null;
  private vitamin_k: number | null;
  private calsium: number | null;
  private iron: number | null;
  private calium: number | null;
  private magnesium: number | null;
  private natrium: number | null;
  private created_at: Date;
  private updated_at: Date;

  constructor(
    user_id: string,
    name: string | null,
    email: string,
    google_id: string | null,
    password: string | null,
    date_of_birth: Date | null,
    gender: string | null,
    height: number | null,
    weight: number | null,
    bmr: number | null,
    calorie: number | null,
    carbohydrate: number | null,
    protein: number | null,
    fat: number | null,
    vitamin_a: number | null,
    vitamin_c: number | null,
    vitamin_d: number | null,
    vitamin_e: number | null,
    vitamin_k: number | null,
    calsium: number | null,
    iron: number | null,
    calium: number | null,
    magnesium: number | null,
    natrium: number | null,
    created_at: Date,
    updated_at: Date
  ) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.google_id = google_id;
    this.password = password;
    this.date_of_birth = date_of_birth;
    this.gender = gender;
    this.height = height;
    this.weight = weight;
    this.bmr = bmr;
    this.calorie = calorie;
    this.carbohydrate = carbohydrate;
    this.protein = protein;
    this.fat = fat;
    this.vitamin_a = vitamin_a;
    this.vitamin_c = vitamin_c;
    this.vitamin_d = vitamin_d;
    this.vitamin_e = vitamin_e;
    this.vitamin_k = vitamin_k;
    this.calsium = calsium;
    this.iron = iron;
    this.calium = calium;
    this.magnesium = magnesium;
    this.natrium = natrium;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static formEntity(prismaUser: PrismaUser) {
    return new UserModel(
      prismaUser.user_id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.google_id,
      prismaUser.password,
      prismaUser.date_of_birth,
      prismaUser.gender,
      prismaUser.height,
      prismaUser.weight,
      prismaUser.bmr,
      prismaUser.calorie,
      prismaUser.carbohydrate,
      prismaUser.protein,
      prismaUser.fat,
      prismaUser.vitamin_a,
      prismaUser.vitamin_c,
      prismaUser.vitamin_d,
      prismaUser.vitamin_e,
      prismaUser.vitamin_k,
      prismaUser.calsium,
      prismaUser.iron,
      prismaUser.calium,
      prismaUser.magnesium,
      prismaUser.natrium,
      prismaUser.created_at,
      prismaUser.updated_at
    );
  }

  toDTO() {
    return {
      user_id: this.user_id,
      name: this.name,
      email: this.email,
      google_id: this.google_id,
      password: this.password,
      date_of_birth: this.date_of_birth,
      gender: this.gender,
      height: this.height,
      weight: this.weight,
      bmr: this.bmr,
      calorie: this.calorie,
      carbohydrate: this.carbohydrate,
      protein: this.protein,
      fat: this.fat,
      vitamin_a: this.vitamin_a,
      vitamin_c: this.vitamin_c,
      vitamin_d: this.vitamin_d,
      vitamin_e: this.vitamin_e,
      vitamin_k: this.vitamin_k,
      calsium: this.calsium,
      iron: this.iron,
      calium: this.calium,
      magnesium: this.magnesium,
      natrium: this.natrium,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export default UserModel;
