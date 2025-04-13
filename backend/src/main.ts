/**
 * 应用程序入口点
 *
 * 初始化NestJS应用并配置全局中间件
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // 创建NestJS应用实例
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 全局前缀
  app.setGlobalPrefix('api');

  // 配置全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // 配置安全和性能中间件
  app.use(helmet());
  app.use(compression());

  // 配置CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // 配置Swagger API文档
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Atom Video API')
      .setDescription('Atom Video平台API文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  // 启动应用
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
