import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
require("dotenv").config();

(async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api/v1");

  const options = new DocumentBuilder()
    .setTitle("CTP Backend")
    .setDescription("CTP API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  app.useGlobalPipes(new ValidationPipe());

  // if (process.env.NODE_ENV === "dev") {
    app.useStaticAssets(join(__dirname, "..", "static"));
  // }

  await app.listen(3000);
})();
