const detail: AuthRoute.Route = {
  name: 'project-detail-control',
  path: '/project-detail-control',
  component: 'self',
  meta: {
    title: '系统控制',
    i18nTitle: 'routes.management.control',
    icon: 'oui:controls-horizontal',
    singleLayout: 'basic',
    order: 8,
    requiresAuth: true,
    hide: true,
    type: 'light'
  }
};

export default detail;
