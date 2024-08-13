import type { RouteComponent } from 'vue-router';

export const views: Record<
  PageRoute.LastDegreeRouteKey,
  RouteComponent | (() => Promise<{ default: RouteComponent }>)
> = {
  403: () => import('./_builtin/403/index.vue'),
  404: () => import('./_builtin/404/index.vue'),
  500: () => import('./_builtin/500/index.vue'),
  'constant-page': () => import('./_builtin/constant-page/index.vue'),
  login: () => import('./_builtin/login/index.vue'),
  'not-found': () => import('./_builtin/not-found/index.vue'),
  dashboard: () => import('./dashboard/index.vue'),
  exception_403: () => import('./exception/403/index.vue'),
  exception_404: () => import('./exception/404/index.vue'),
  exception_500: () => import('./exception/500/index.vue'),
  'merchant-manager': () => import('./merchant-manager/index.vue'),
  'project-detail-check-in': () => import('./project-detail-check-in/index.vue'),
  'project-detail-control': () => import('./project-detail-control/index.vue'),
  'project-detail-lock': () => import('./project-detail-lock/index.vue'),
  'project-detail-log': () => import('./project-detail-log/index.vue'),
  'project-detail-member': () => import('./project-detail-member/index.vue'),
  'project-detail-personal': () => import('./project-detail-personal/index.vue'),
  'project-detail-scene': () => import('./project-detail-scene/index.vue'),
  'project-detail-statistics': () => import('./project-detail-statistics/index.vue'),
  'project-manager': () => import('./project-manager/index.vue'),
  'setting_reset-pwd': () => import('./setting/reset-pwd/index.vue'),
  'user-manager': () => import('./user-manager/index.vue')
};
