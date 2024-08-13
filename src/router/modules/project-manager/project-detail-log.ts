const detail: AuthRoute.Route = {
  name: 'project-detail-log',
  path: '/project-detail-log',
  component: 'self',
  meta: {
    title: '项目日志',
    i18nTitle: 'routes.management.log',
    icon: 'octicon:log-16',
    singleLayout: 'basic',
    order: 11,
    requiresAuth: true,
    hide: true,
    type: 'light'
  }
};

export default detail;
