import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

export function setupSwagger(app: Express) {
  const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Documentation for ITASE Project",
        version: "1.0.0",
        description:
          "Dokumentasi REST API untuk proyek Predictive Lead Scoring",
      },
      servers: [
        {
          url: "https://itase-6.vercel.app", // URL base proyek Anda
        },
      ],
    },
    // Pastikan path ini menunjuk ke file rute Anda yang berisi komentar JSDoc
    apis: ["./src/routes/*.ts"],
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  // Gunakan setup default tanpa kustomisasi CSS/JS untuk kesederhanaan di Vercel
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("📚 Swagger docs available at /api-docs");
}
