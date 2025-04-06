/**
 * Express模块类型声明
 *
 * 扩展Express命名空间以添加用户认证信息
 */

import { UserRole } from '../middleware/auth.middleware';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
      [key: string]: any;
    }

    // 扩展Request接口，添加user属性
    interface Request {
      user?: User;
    }
  }
}
