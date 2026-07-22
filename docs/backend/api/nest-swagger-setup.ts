/**
 * Reference: how the NestJS backend will serve Swagger UI and emit an
 * openapi.json identical in shape to ./openapi.yaml.
 *
 * The hand-written openapi.yaml is the design contract; once the backend exists,
 * the spec is GENERATED from decorators (@ApiTags, @ApiOperation, DTOs) so code
 * and docs never drift. Frontend types come from `openapi-typescript`.
 *
 * This file is documentation — it is not wired into the frontend build.
 */
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
// import { AppModule } from "./app.module";
declare const AppModule: unknown;

export async function bootstrap() {
  const app = await NestFactory.create(AppModule as never);

  app.use(helmet());
  app.enableCors({ origin: process.env.WEB_ORIGINS?.split(",") ?? [], credentials: true });

  // URI versioning → routes are served under /v1
  app.setGlobalPrefix("");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1", prefix: "v" });

  // Global validation — DTOs (class-validator) are enforced here.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // 400 on unexpected properties
      transform: true, // coerce types (query params → number, etc.)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("WebHack Academy API")
    .setDescription("REST API for the WebHack Academy LMS")
    .setVersion("1.0.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "bearerAuth")
    .addServer("https://api.webhackacademy.com/v1", "Production")
    .addServer("http://localhost:4000/v1", "Local")
    .addTag("Auth")
    .addTag("Catalog")
    .addTag("Enrollment")
    .addTag("Quizzes")
    .addTag("Assignments")
    .addTag("Certificates")
    .addTag("Billing")
    .addTag("Admin")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI at /v1/docs ; raw spec at /v1/openapi.json
  SwaggerModule.setup("v1/docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
    jsonDocumentUrl: "v1/openapi.json",
  });

  await app.listen(process.env.PORT ?? 4000);
}
