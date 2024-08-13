<template>
  <n-space :vertical="true" :size="16">
    <data-card v-if="board.data.projectTotal" />
    <top-chart v-if="board.data.projectAreaList" />
    <!-- <bottom-part /> -->
  </n-space>
</template>

<script lang="ts" setup>
import { useBoardStore } from '~/src/store';
import { TopChart, DataCard } from './components';

const board = useBoardStore();

board.getBoardData();
</script>

<style scoped></style>
