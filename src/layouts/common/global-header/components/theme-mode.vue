<template>
  <hover-container class="w-40px" :inverted="theme.header.inverted" tooltip-content="模式切换">
    <dark-mode-switch
      :dark="theme.darkMode"
      :customize-transition="theme.isCustomizeDarkModeTransition"
      class="wh-full"
      @update:dark="theme.setDarkMode"
    />
  </hover-container>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';

defineOptions({ name: 'ThemeMode' });

const theme = useThemeStore();
</script>

<style scoped></style>
