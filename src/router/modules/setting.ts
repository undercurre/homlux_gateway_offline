const setting: AuthRoute.Route = {
  name: 'setting_reset-pwd',
  path: '/setting/reset-pwd',
  component: 'self',
  meta: {
    title: '修改密码',
    i18nTitle: 'routes.setting.reset-pwd',
    icon: 'carbon:password',
    singleLayout: 'basic',
    order: 10,
    requiresAuth: true,
    hide: true
  }
};

export default setting;
