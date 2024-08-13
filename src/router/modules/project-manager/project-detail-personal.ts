const personal: AuthRoute.Route = {
  name: 'project-detail-personal',
  path: '/project-detail-personal',
  component: 'self',
  meta: {
    title: '人员管理',
    i18nTitle: 'routes.management.personal',
    icon: 'tdesign:member',
    singleLayout: 'basic',
    order: 8,
    requiresAuth: true,
    hide: true,
    type: 'lock'
  }
};

export default personal;
