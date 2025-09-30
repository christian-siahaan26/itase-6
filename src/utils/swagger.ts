import { Express } from "express";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

const swaggerUICss =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

export function setupSwagger(app: Express) {
  let swaggerDocument;

  try {
    // Try multiple paths for different environments
    const possiblePaths = [
      path.resolve(__dirname, "../../docs/swagger.json"), // For production build
      path.resolve(__dirname, "../docs/swagger.json"),    // Alternative path
      path.join(process.cwd(), "docs/swagger.json"),      // From project root
      path.join(process.cwd(), "src/docs/swagger.json"),  // If docs in src folder
    ];

    let loaded = false;
    for (const swaggerPath of possiblePaths) {
      if (fs.existsSync(swaggerPath)) {
        swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
        console.log(`✅ Swagger loaded from: ${swaggerPath}`);
        loaded = true;
        break;
      }
    }

    if (!loaded) {
      // Fallback: try require if file system fails (for bundled environments)
      try {
        swaggerDocument = require("../../docs/swagger.json");
        console.log("✅ Swagger loaded via require");
      } catch (requireError) {
        console.error("❌ Could not load swagger.json from any location");
        throw new Error("Swagger document not found");
      }
    }
  } catch (error) {
    console.error("Failed to load swagger.json:", error);
    // Return early if swagger document cannot be loaded
    return;
  }

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss:
        ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
      customCssUrl: swaggerUICss,
    })
  );

  console.log("📚 Swagger docs available at /api-docs");
}