export type UserDTO = {
  user_id: string;
  name: string;
  email: string;
  google_id: string;
  password: string;
  date_of_birth: Date;
  gender: string;
  height: number;
  weight: number;
  bmr?: number;
  calorie?: number;
  carbohydrate?: number;
  protein?: number;
  fat?: number;
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  vitamin_e?: number;
  vitamin_k?: number;
  calsium?: number;
  iron?: number;
  magnesium?: number;
  calium?: number;
  natrium?: number;
  created_at: Date;
  updated_at: Date;
};

export type UserCreate = {
  name: string;
  email: string;
  google_id?: string;
  password: string;
  date_of_birth: Date;
  gender: string;
  height: number;
  weight: number;
};

export type UserUpdate = {
  name?: string;
  email?: string;
  google_id?: string;
  password?: string;
  date_of_birth?: Date;
  gender?: string;
  height?: number;
  weight?: number;
};

export type UserFilters = {
  search?: string;
  start_date?: Date;
  end_data?: Date;
};
