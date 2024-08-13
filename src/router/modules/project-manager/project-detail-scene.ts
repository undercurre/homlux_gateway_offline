const detail: AuthRoute.Route = {
  name: 'project-detail-scene',
  path: '/project-detail-scene',
  component: 'self',
  meta: {
    title: '自动控制',
    i18nTitle: 'routes.management.scene',
    icon: 'cbi:scene-dynamic',
    singleLayout: 'basic',
    order: 9,
    requiresAuth: true,
    hide: true,
    type: 'light'
  }
};

export default detail;
