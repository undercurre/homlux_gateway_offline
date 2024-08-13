const detail: AuthRoute.Route = {
  name: 'project-detail-member',
  path: '/project-detail-member',
  component: 'self',
  meta: {
    title: '项目成员',
    i18nTitle: 'routes.management.member',
    icon: 'tdesign:member',
    singleLayout: 'basic',
    order: 10,
    requiresAuth: true,
    hide: true,
    type: 'light'
  }
};

export default detail;
