import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173'], // 프론트엔드 주소 (필요 시 여러 개 추가 가능)
    credentials: true, // 쿠키/인증 헤더 허용 시
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
