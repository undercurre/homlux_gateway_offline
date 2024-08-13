const management: AuthRoute.Route = {
  name: 'user-manager',
  path: '/user-manager',
  component: 'self',
  meta: {
    title: '账号管理',
    i18nTitle: 'routes.management.user',
    localIcon: 'user',
    singleLayout: 'basic',
    order: 10,
    requiresAuth: true,
    permissions: [0, 1]
  }
};

export default management;
