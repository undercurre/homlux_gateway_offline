<template>
  <n-scrollbar class="flex-1-hidden">
    <n-menu
      :value="activeKey"
      :collapsed="app.siderCollapse"
      :collapsed-width="theme.sider.collapsedWidth"
      :collapsed-icon-size="22"
      :options="menus"
      :expanded-keys="expandedKeys"
      :indent="18"
      :inverted="!theme.darkMode && theme.sider.inverted"
      :render-label="renderLabel"
      @update:value="handleUpdateMenu"
      @update:expanded-keys="handleUpdateExpandedKeys"
    />
  </n-scrollbar>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuGroupOption, MenuOption } from 'naive-ui';
import { useAppStore, useRouteStore, useThemeStore } from '@/store';
import { useRouterPush } from '@/composables';
import { getActiveKeyPathsOfMenus, translateMenuLabel } from '@/utils';

defineOptions({ name: 'VerticalMenu' });

const route = useRoute();
const app = useAppStore();
const theme = useThemeStore();
const routeStore = useRouteStore();
const { routerPush } = useRouterPush();

const menus = computed(() => translateMenuLabel(routeStore.menus as App.GlobalMenuOption[]));

const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string);
const expandedKeys = ref<string[]>([]);

function handleUpdateMenu(_key: string, item: MenuOption) {
  const menuItem = item as App.GlobalMenuOption;
  routerPush(menuItem.routePath);
}

function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys;
}
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
  <path fill="white" d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8l-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0"/>
</svg>`;

function renderLabel(option: MenuOption | MenuGroupOption) {
  // 使用h函数创建VNode
  const vnode = h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    },
    [
      h('span', {
        innerHTML: option.label
      }),
      h('div', {
        innerHTML: svgContent
      })
    ]
  );
  return vnode;
}

watch(
  () => route.name,
  () => {
    expandedKeys.value = getActiveKeyPathsOfMenus(activeKey.value, menus.value);
  },
  { immediate: true }
);
</script>

<style scoped>
/deep/.n-menu-item-content.n-menu-item-content--selected::before {
  background-image: linear-gradient(155deg, #1bca40 0%, #abe785 100%),
    linear-gradient(167deg, #1bca40 12%, #b9ea8c 100%);
  border-radius: 16px;
}

/deep/.lock .n-menu-item-content.n-menu-item-content--selected::before {
  background-image: linear-gradient(155deg, #488fff 0%, #85d5e7 100%),
    linear-gradient(167deg, #488fff 12%, #85d5e7 100%);
  border-radius: 16px;
}

/deep/.n-menu-item-content.n-menu-item-content--selected .n-menu-item-content__icon {
  color: #fff;
}

/deep/.n-menu-item-content.n-menu-item-content--selected .n-menu-item-content-header {
  color: #fff;
}

/deep/.n-menu-item-content:not(.n-menu-item-content--disabled).n-menu-item-content--selected:hover
  .n-menu-item-content-header {
  color: #fff;
}

/deep/.n-menu-item-content:not(.n-menu-item-content--disabled).n-menu-item-content--selected:hover
  .n-menu-item-content__icon {
  color: #fff;
}

/deep/.n-menu-item-content:not(.n-menu-item-content--disabled):hover::before {
  border-radius: 16px;
}
</style>
