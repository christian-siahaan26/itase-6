-- CreateTable
CREATE TABLE "public"."users" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "google_id" TEXT,
    "password" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "bmr" DOUBLE PRECISION,
    "calorie" DOUBLE PRECISION,
    "carbohydrate" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "vitamin_a" DOUBLE PRECISION,
    "vitamin_c" DOUBLE PRECISION,
    "vitamin_d" DOUBLE PRECISION,
    "vitamin_e" DOUBLE PRECISION,
    "vitamin_k" DOUBLE PRECISION,
    "calsium" DOUBLE PRECISION,
    "iron" DOUBLE PRECISION,
    "calium" DOUBLE PRECISION,
    "magnesium" DOUBLE PRECISION,
    "natrium" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."analyses" (
    "analyse_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("analyse_id")
);

-- CreateTable
CREATE TABLE "public"."identified_foods" (
    "food_id" TEXT NOT NULL,
    "analyse_id" TEXT NOT NULL,
    "food_name" TEXT NOT NULL,
    "user_input_weight" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identified_foods_pkey" PRIMARY KEY ("food_id")
);

-- CreateTable
CREATE TABLE "public"."food_compositions" (
    "composition_id" TEXT NOT NULL,
    "food_id" TEXT NOT NULL,
    "nutrient_id" TEXT NOT NULL,
    "food_name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "food_compositions_pkey" PRIMARY KEY ("composition_id")
);

-- CreateTable
CREATE TABLE "public"."nutrients" (
    "nutrient_id" TEXT NOT NULL,
    "nutrient_name" TEXT NOT NULL,
    "benefit_info" TEXT NOT NULL,
    "risk_info" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nutrients_pkey" PRIMARY KEY ("nutrient_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "public"."users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "public"."users"("google_id");

-- AddForeignKey
ALTER TABLE "public"."analyses" ADD CONSTRAINT "analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."identified_foods" ADD CONSTRAINT "identified_foods_analyse_id_fkey" FOREIGN KEY ("analyse_id") REFERENCES "public"."analyses"("analyse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."food_compositions" ADD CONSTRAINT "food_compositions_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "public"."identified_foods"("food_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."food_compositions" ADD CONSTRAINT "food_compositions_nutrient_id_fkey" FOREIGN KEY ("nutrient_id") REFERENCES "public"."nutrients"("nutrient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
