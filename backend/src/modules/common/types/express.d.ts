/**
 * Express.js类型扩展模块
 *
 * 扩展Express的Request接口，添加用户和文件处理相关的类型定义
 * @module common/types/express
 */

import { User } from '@prisma/client';

declare global {
  namespace Express {
    /**
     * 扩展Express请求接口
     */
    interface Request {
      /**
       * 已认证的用户信息
       */
      user?: {
        /** 用户ID */
        id: string;
        /** 用户电子邮件 */
        email: string;
        /** 用户名 */
        username: string;
        /** 用户角色 */
        role: string;
      };

      /**
       * 上传的文件
       */
      file?: Express.Multer.File;
    }
  }
}
