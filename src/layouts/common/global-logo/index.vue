<template>
  <div class="flex-center w-full nowrap-hidden">
    <img
      v-if="routeStore.isProjectDetailOpened && projectStore.isLockProject"
      class="w-48px h-48px z-4"
      src="@/assets/images/common/lockLogo.png"
    />
    <img
      v-if="!routeStore.isProjectDetailOpened"
      class="z-4 mb-6px"
      :style="{
        width: appStore.siderCollapse ? '60px' : '80px',
        height: appStore.siderCollapse ? '30px' : '40px'
      }"
      src="@/assets/images/common/mideaLogo.png"
    />
    <img
      v-if="routeStore.isProjectDetailOpened && !projectStore.isLockProject"
      class="w-48px h-48px z-4"
      src="@/assets/images/common/logo.png"
    />
    <n-divider v-if="!routeStore.isProjectDetailOpened && !appStore.siderCollapse" class="bg-#333" vertical />
    <div v-if="routeStore.isProjectDetailOpened && !appStore.siderCollapse" class="ml-24px"></div>
    <div v-show="showTitle" class="flex flex-col items-start justify-center transition duration-300 ease-in-out">
      <div class="tracking-2px text-22px font-600">{{ logoTitle }}</div>
      <!-- <div class="text-8px font-400 tracking-2px">
        <span class="mr-5px">绿色双碳</span>
        <span>健康舒适</span>
      </div> -->
    </div>
    <!-- <div class="absolute w-full h-50vh mark z-0"></div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
// import { routePath } from '@/router';
import { useAppStore, useProjectStore, useRouteStore, useThemeStore } from '@/store';

const projectStore = useProjectStore();
const routeStore = useRouteStore();
const themeStore = useThemeStore();
const appStore = useAppStore();

const logoTitle = computed(() => {
  const themeColor = projectStore.isLockProject ? '#488FFF' : '#21B96C';
  themeStore.setThemeColor(themeColor);
  if (routeStore.isProjectDetailOpened) return !projectStore.isLockProject ? '美的商照' : '美的公寓';
  return '智慧园区';
});

function changeSelectCardTheme() {
  const selectedItems = document.querySelectorAll('.n-menu-item');
  Array.from(selectedItems).map(item => {
    item.classList.add(projectStore.isLockProject ? 'lock' : 'light');
    item.classList.remove(projectStore.isLockProject ? 'light' : 'lock');
    return item;
  });
}

watch(
  () => projectStore.isLockProject,
  () => {
    setTimeout(() => {
      changeSelectCardTheme();
    }, 0);
  },
  {
    immediate: true
  }
);

defineOptions({ name: 'GlobalLogo' });

interface Props {
  /** 显示名字 */
  showTitle: boolean;
}

defineProps<Props>();

// const routeHomePath = routePath('root');

// function back2Home() {
//   routeStore.handleOpenProjectDetail(false);
// }
</script>

<style scoped>
.mark {
  background-image: linear-gradient(125deg, #e3f5ea 5%, rgba(239, 247, 242, 0) 64%);
}

::v-deep .n-divider.n-divider--vertical {
  background-color: #333;
}
</style>
