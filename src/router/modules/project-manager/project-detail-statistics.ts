const detail: AuthRoute.Route = {
  name: 'project-detail-statistics',
  path: '/project-detail-statistics',
  component: 'self',
  meta: {
    title: '项目大盘',
    i18nTitle: 'routes.management.statistics',
    icon: 'wpf:statistics',
    singleLayout: 'basic',
    order: 7,
    requiresAuth: true,
    hide: true,
    type: 'light'
  }
};

export default detail;
