/**
 * 应用程序入口文件
 *
 * 配置和引导NestJS应用程序
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // 配置跨域
  app.enableCors();

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('Atom Video API')
    .setDescription('Atom Video应用程序的API文档')
    .setVersion('1.0')
    .addTag('auth', '认证相关接口')
    .addTag('user', '用户相关接口')
    .addTag('video', '视频相关接口')
    .addTag('creator', '创作者相关接口')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 启动应用
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`应用程序已启动，访问: http://localhost:${port}`);
  console.log(`API文档访问: http://localhost:${port}/api/docs`);
}

bootstrap();
