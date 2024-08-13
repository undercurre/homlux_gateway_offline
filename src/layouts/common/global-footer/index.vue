<template>
  <dark-mode-container class="text-16px leading-30px h-full" :inverted="theme.footer.inverted">
    <n-space align="center" justify="space-between">
      <div></div>

      <span>Copyright ©2023 美智光电</span>

      <div class="h-full flex items-center">
        <n-tag :bordered="false" type="info" class="mr-20px" size="small">
          {{ projectVersion }}
        </n-tag>
      </div>
    </n-space>
  </dark-mode-container>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store';

defineOptions({ name: 'GlobalFooter' });

const theme = useThemeStore();

const projectVersion = PROJECT_VERSION;
</script>

<style scoped></style>
