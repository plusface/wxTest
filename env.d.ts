/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_MODE: 'development' | 'production';
  VITE_BASE: string;
  /**
   * 接口请求前缀
   */
  VITE_WX_API_URL: string;
  /**
   * 请求后端地址
   */
  VITE_API_TARGET: string;
  /**
   * 项目所在层级
   */
  VITE_BASE_URL: string;
  // 更多环境变量...
}
