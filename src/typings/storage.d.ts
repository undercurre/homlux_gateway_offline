declare namespace StorageInterface {
  /** localStorage的存储数据的类型 */
  interface Session {
    /** 主题颜色 */
    themeColor: string;
    /** 主题配置 */
    themeSettings: Theme.Setting;
    isSessionActive: boolean;
  }

  /** localStorage的存储数据的类型 */
  interface Local {
    /** 用户token */
    token: string;
    /** 用户刷新token */
    refreshToken: string;
    /** 用户信息 */
    userInfo: ApiAuth.UserInfo;
    /** 多页签路由信息 */
    multiTabRoutes: App.GlobalTabRoute[];
    /** 项目详情打开情况 */
    isProjectDetailOpened: boolean;
    /** 项目选择 */
    curProjectId: string;
    /** 本地语言缓存 */
    lang: I18nType.LangType;
    username: string;
  }
}
