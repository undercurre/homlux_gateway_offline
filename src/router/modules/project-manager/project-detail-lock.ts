const detail: AuthRoute.Route = {
  name: 'project-detail-lock',
  path: '/project-detail-lock',
  component: 'self',
  meta: {
    title: '门锁管理',
    i18nTitle: 'routes.management.lock',
    icon: 'icon-park-solid:electronic-door-lock',
    singleLayout: 'basic',
    order: 8,
    requiresAuth: true,
    hide: true,
    type: 'lock'
  }
};

export default detail;
