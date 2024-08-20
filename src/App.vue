<template>
  <n-config-provider
    :theme="theme.naiveTheme"
    :theme-overrides="theme.naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="h-full"
  >
    <naive-provider>
      <router-view v-if="init" />
    </naive-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import { dateZhCN, zhCN } from 'naive-ui';
import { subscribeStore, useThemeStore, useAuthStore, useRouteStore } from '@/store';
import { useGlobalEvents, useRouterPush } from '@/composables';
import { localStg, sessionStg } from '@/utils';
import { fetchCheckDefault } from './service/api/gateway';

const init = ref(false);

const theme = useThemeStore();

subscribeStore();
useGlobalEvents();

const auth = useAuthStore();
auth.offlineAuth.username = localStg.get('username') as string;

function checkSession() {
  const isSessionActive = sessionStg.get('isSessionActive');

  if (!isSessionActive) {
    localStg.remove('token');
  }
}

function clearSession() {
  sessionStg.remove('isSessionActive');
}

onBeforeMount(async () => {
  checkSession();
  const checkRes = await fetchCheckDefault();
  if (!checkRes.error) {
    if (checkRes.data.isDefault === '1') {
      const route = useRouteStore();
      const { toLoginRedirect } = useRouterPush(false);
      await route.initAuthRoute();

      localStg.set('token', 'offlinetoken');

      // 跳转登录后的地址
      toLoginRedirect();

      // 登录成功弹出欢迎提示
      if (route.isInitAuthRoute) {
        window.$notification?.success({
          title: '登录成功',
          content: '首次进入',
          duration: 3000
        });
      }
    }
    init.value = true;
  }
});

onMounted(() => {
  window.addEventListener('beforeunload', clearSession);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', clearSession);
});
</script>

<style scoped>
/deep/ .n-card__content:first-child,
.n-card__content {
  padding: 10px 20px;
}

/deep/ .n-data-table-td {
  padding: 4px;
  line-height: 1.2;
}
</style>
