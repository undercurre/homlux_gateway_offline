const management: AuthRoute.Route = {
  name: 'project-manager',
  path: '/project-manager',
  component: 'self',
  meta: {
    title: '项目管理',
    i18nTitle: 'routes.management._value',
    localIcon: 'project',
    singleLayout: 'basic',
    order: 9,
    requiresAuth: true
  }
};

export default management;
