const detail: AuthRoute.Route = {
  name: 'project-detail-check-in',
  path: '/project-detail-check-in',
  component: 'self',
  meta: {
    title: '入住管理',
    i18nTitle: 'routes.management.checkIn',
    icon: 'cbi:roomsother',
    singleLayout: 'basic',
    order: 8,
    requiresAuth: true,
    hide: true,
    type: 'lock'
  }
};

export default detail;
