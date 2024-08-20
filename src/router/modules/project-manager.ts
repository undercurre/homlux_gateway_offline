const management: AuthRoute.Route = {
  name: 'project-manager',
  path: '/project-manager',
  component: 'self',
  meta: {
    title: '项目管理222',
    localIcon: 'project',
    singleLayout: 'basic',
    order: 10,
    requiresAuth: true,
    hide: true
  }
};

export default management;
