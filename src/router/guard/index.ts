import { nextTick } from 'vue';
import type { Router } from 'vue-router';
// import { useProjectStore, useRouteStore } from '~/src/store';
import { useAuthStore, useProjectStore, useRouteStore } from '~/src/store';
import { createPermissionGuard } from './permission';

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const projectStore = useProjectStore();
    console.log('守卫触发', to, from, projectStore.projects, projectStore.curId);
    if (projectStore.projects.length === 0) {
      await projectStore.getAllProject();
      if (projectStore.projects.length > 0) projectStore.curId = projectStore.projects[0].projectId;
    }
    const routeStore = useRouteStore();
    if (/setting/.test(to.name as string) || /login/.test(to.name as string)) {
      // 开始 loadingBar
      window.$loadingBar?.start();
      // 页面跳转权限处理
      await createPermissionGuard(to, from, next);
    } else {
      // 开始 loadingBar
      window.$loadingBar?.start();
      // 页面跳转权限处理
      await createPermissionGuard(to, from, next);
      const isProjectDetailOpened = /project-detail-/.test(to.name as string);
      if (!authStore.hasFirstPage && !isProjectDetailOpened) {
        if (!projectStore.curProject && projectStore.projects.length > 0) {
          projectStore.curId = projectStore.projects[0].projectId;
          projectStore.cacheCurProjectId();
          routeStore.handleOpenProjectDetail(true);
        }
        if (projectStore.curProject && projectStore.curProject.projectType === '01') {
          next('/project-detail-control');
        } else if (projectStore.curProject && projectStore.curProject.projectType === '02') {
          next('/project-detail-lock');
        }
      } else {
        nextTick(() => {
          next();
        });
      }
    }
  });
  router.afterEach(() => {
    // 设置document title
    // useTitle(to.meta.i18nTitle ? $t(to.meta.i18nTitle) : to.meta.title);
    // 结束 loadingBar
    window.$loadingBar?.finish();
  });
}
