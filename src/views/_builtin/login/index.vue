<template>
  <div class="relative flex-center wh-full" :style="{ backgroundColor: bgColor }">
    <div class="absolute left-48px top-24px z-3 text-20px flex items-center">
      <img class="w-80px h-80px" src="@/assets/images/common/firstLogo.png" />
      <div class="ml-48px flex-col justify-between">
        <span class="text-36px text-#23322A tracking-3px font-500">智慧园区</span>
        <div class="text-18px text-#666666 tracking-3px font-400">
          <span class="mr-20px">绿色双碳</span>
          <span>健康舒适</span>
        </div>
      </div>
    </div>
    <img class="absolute right-0 w-36.3% h-full z-3" src="@/assets/images/login/formBg.png" />
    <div class="absolute right-0 z-4 w-36.3% h-full bg-transparent">
      <div class="w-full h-full flex-col justify-between items-center">
        <header class="flex-y-center justify-between">
          <span class="text-40px mt-120px mb-80px text-#23322A tracking-3px font-500">登录账号</span>
        </header>
        <main class="w-full">
          <div class="w-full mb-20px">
            <n-tabs
              default-value="pwd-login"
              size="large"
              justify-content="space-evenly"
              :on-update:value="updateTabValue"
            >
              <n-tab-pane name="pwd-login" tab="手机号登录"></n-tab-pane>
              <n-tab-pane name="code-login" tab="验证码登录"></n-tab-pane>
            </n-tabs>
          </div>
        </main>
        <div class="w-full px-96px flex-1">
          <transition name="fade-slide" mode="out-in" appear>
            <component :is="activeModule.component" />
          </transition>
        </div>
      </div>
    </div>
    <login-bg :dark="theme.darkMode" />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { loginModuleLabels } from '@/constants';
import { useThemeStore } from '@/store';
import { mixColor } from '@/utils';
import { CodeLogin, LoginBg, PwdLogin, ResetPwd } from './components';

const route = useRoute();

const theme = useThemeStore();

const curModuleKey = ref('pwd-login');

interface LoginModule {
  key: UnionKey.LoginModule;
  label: string;
  component: Component;
}

const modules: LoginModule[] = [
  { key: 'pwd-login', label: loginModuleLabels['pwd-login'], component: PwdLogin },
  { key: 'code-login', label: loginModuleLabels['code-login'], component: CodeLogin },
  { key: 'reset-pwd', label: loginModuleLabels['reset-pwd'], component: ResetPwd }
];

const activeModule = computed(() => {
  const active: LoginModule = { ...modules[0] };
  const findItem = modules.find(item => item.key === curModuleKey.value);
  if (findItem) {
    Object.assign(active, findItem);
  }
  return active;
});

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff';
  const ratio = theme.darkMode ? 0.5 : 0.2;
  return mixColor(COLOR_WHITE, theme.themeColor, ratio);
});

function updateTabValue(value: string | number) {
  curModuleKey.value = value as string;
}

onMounted(() => {
  curModuleKey.value = route.params.module as string;
});
</script>

<style scoped>
/deep/.n-tabs-bar {
  width: 80px;
  height: 4px;
  background-image: linear-gradient(-90deg, #7cd06a 0%, #20b86c 96%);
  border-radius: 2px;
}
/deep/.n-tabs-tab {
  font-size: 22px;
  color: #999999;
  text-align: center;
  font-weight: 400;
  padding-bottom: 20px;
}
/deep/.n-tabs.n-tabs--bar-type .n-tabs-tab.n-tabs-tab--active {
  font-size: 22px;
  color: #23322a;
  text-align: center;
  font-weight: 500;
}
</style>
