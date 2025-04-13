/**
 * 模块类型声明
 */

declare module './prisma/prisma.module' {
  export class PrismaModule {}
}

declare module './modules/auth/auth.module' {
  export class AuthModule {}
}

declare module './modules/user/user.module' {
  export class UserModule {}
}

declare module './modules/common/common.module' {
  export class CommonModule {}
}

declare module './modules/video/video.module' {
  export class VideoModule {}
}

declare module './modules/interaction/interaction.module' {
  export class InteractionModule {}
}
