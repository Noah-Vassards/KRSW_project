import { NestFactory } from '@nestjs/core';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module';

const port = 3001

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidateInputPipe());
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
