const management: AuthRoute.Route = {
  name: 'merchant-manager',
  path: '/merchant-manager',
  component: 'self',
  meta: {
    title: '代理商管理',
    i18nTitle: 'routes.management.merchant',
    localIcon: 'merchant',
    singleLayout: 'basic',
    order: 10,
    requiresAuth: true,
    permissions: [0]
  }
};

export default management;
