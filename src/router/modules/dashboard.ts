const dashboard: AuthRoute.Route = {
  name: 'dashboard',
  path: '/dashboard',
  component: 'self',
  meta: {
    title: '系统大盘',
    localIcon: 'overview',
    order: 1,
    singleLayout: 'basic',
    i18nTitle: 'routes.dashboard._value',
    requiresAuth: true
  }
};

export default dashboard;
