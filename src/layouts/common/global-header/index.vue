<template>
  <dark-mode-container class="global-header flex-y-center h-full" :inverted="theme.header.inverted">
    <global-logo v-if="showLogo" :show-title="true" class="h-full" :style="{ width: theme.sider.width + 'px' }" />
    <div v-if="!showHeaderMenu" class="flex-1-hidden flex-y-center h-full">
      <menu-collapse v-if="showMenuCollapse || isMobile" />
      <global-breadcrumb v-if="theme.header.crumb.visible && !isMobile && !routeStore.isProjectDetailOpened" />
      <div v-if="routeStore.isProjectDetailOpened" class="flex-1-hidden flex-y-center h-full">
        <n-select
          :value="projectStore.curId"
          class="w-20% min-w-300px"
          :options="options"
          :on-update:value="selectHandler"
          :fallback-option="false"
        />
        <n-button v-if="authStore.hasFirstPage" type="primary" class="ml-20px" @click="backToHome">返回首页</n-button>
      </div>
    </div>
    <header-menu v-if="showHeaderMenu" />
    <div class="flex justify-end h-full">
      <!-- <global-search /> -->
      <!-- <github-site /> -->
      <full-screen />
      <theme-mode />
      <!-- <toggle-lang /> -->
      <system-message v-if="false" />
      <setting-button v-if="false" />
      <user-avatar />
    </div>
  </dark-mode-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useThemeStore, useProjectStore, useRouteStore, useAuthStore } from '@/store';
import { useBasicLayout, useRouterPush } from '@/composables';
import { routeName } from '~/src/router';
import GlobalLogo from '../global-logo/index.vue';
// import GlobalSearch from '../global-search/index.vue';
import {
  FullScreen,
  // GithubSite,
  GlobalBreadcrumb,
  HeaderMenu,
  MenuCollapse,
  SettingButton,
  SystemMessage,
  ThemeMode,
  UserAvatar
  // ToggleLang
} from './components';

defineOptions({ name: 'GlobalHeader' });

interface Props {
  /** 显示logo */
  showLogo: App.GlobalHeaderProps['showLogo'];
  /** 显示头部菜单 */
  showHeaderMenu: App.GlobalHeaderProps['showHeaderMenu'];
  /** 显示菜单折叠按钮 */
  showMenuCollapse: App.GlobalHeaderProps['showMenuCollapse'];
}

defineProps<Props>();

const theme = useThemeStore();
const { isMobile } = useBasicLayout();

const authStore = useAuthStore();
const projectStore = useProjectStore();
const routeStore = useRouteStore();

// projectStore.getAllProject();

const options = computed(() => {
  return projectStore.projects.map(item => {
    return {
      label: item.projectName,
      value: item.projectId
    };
  });
});

const router = useRouterPush();

function backToHome() {
  router.routerPush({ name: routeName('project-manager') });
  routeStore.handleOpenProjectDetail(false);
  projectStore.clearCurProjectId();
}

function selectHandler(value: string) {
  projectStore.curId = value;
  projectStore.cacheCurProjectId();
  const project = projectStore.projects.find(item => item.projectId === value);
  if (project && project.projectType === '01') {
    router.routerPush({ name: routeName('project-detail-statistics') });
  } else {
    router.routerPush({ name: routeName('project-detail-lock') });
  }
  routeStore.handleOpenProjectDetail(true);
}

onMounted(() => {
  projectStore.initCurProjectId();
  routeStore.initIsProjectDetailOpened();
  authStore.getDictList();
});
</script>

<style scoped>
.global-header {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
