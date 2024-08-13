declare namespace PageRoute {
  /**
   * the root route key
   * @translate 根路由
   */
  type RootRouteKey = 'root';

  /**
   * the not found route, which catch the invalid route path
   * @translate 未找到路由(捕获无效路径的路由)
   */
  type NotFoundRouteKey = 'not-found';

  /**
   * the route key
   * @translate 页面路由
   */
  type RouteKey =
    | '403'
    | '404'
    | '500'
    | 'constant-page'
    | 'login'
    | 'not-found'
    | 'dashboard'
    | 'exception'
    | 'exception_403'
    | 'exception_404'
    | 'exception_500'
    | 'merchant-manager'
    | 'project-detail-check-in'
    | 'project-detail-control'
    | 'project-detail-lock'
    | 'project-detail-log'
    | 'project-detail-member'
    | 'project-detail-personal'
    | 'project-detail-scene'
    | 'project-detail-statistics'
    | 'project-manager'
    | 'setting'
    | 'setting_reset-pwd'
    | 'user-manager';

  /**
   * last degree route key, which has the page file
   * @translate 最后一级路由(该级路有对应的页面文件)
   */
  type LastDegreeRouteKey = Extract<
    RouteKey,
    | '403'
    | '404'
    | '500'
    | 'constant-page'
    | 'login'
    | 'not-found'
    | 'dashboard'
    | 'exception_403'
    | 'exception_404'
    | 'exception_500'
    | 'merchant-manager'
    | 'project-detail-check-in'
    | 'project-detail-control'
    | 'project-detail-lock'
    | 'project-detail-log'
    | 'project-detail-member'
    | 'project-detail-personal'
    | 'project-detail-scene'
    | 'project-detail-statistics'
    | 'project-manager'
    | 'setting_reset-pwd'
    | 'user-manager'
  >;
}
