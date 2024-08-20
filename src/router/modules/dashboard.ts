const dashboard: AuthRoute.Route = {
  name: 'dashboard',
  path: '/dashboard',
  component: 'self',
  meta: {
    title: '网关联网',
    localIcon: 'overview',
    order: 1,
    singleLayout: 'basic',
    requiresAuth: true,
    hide: true
  }
};

export default dashboard;
