<template>
  <n-card :bordered="false" class="h-full rounded-40px box-border shadow-sm p-18px">
    <n-grid cols="s:1 m:2 l:4" responsive="screen" :x-gap="36" :y-gap="36">
      <n-grid-item v-for="item in cardData" :key="item.id">
        <gradient-bg class="h-100px" :data="item"></gradient-bg>
      </n-grid-item>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { Ref } from 'vue';
import { useBoardStore } from '~/src/store';
import { GradientBg } from './components';
import type { CardData } from './components/gradient-bg.vue';

const board = useBoardStore();

defineOptions({ name: 'DashboardAnalysisDataCard' });

const cardData: Ref<CardData[]> = ref([
  {
    id: 'visit',
    title: '项目总数',
    value: board.data.projectTotal,
    unit: '',
    icon: 'arcticons:projectm'
  },
  {
    id: 'amount',
    title: '设备总数',
    value: board.data.deviceTotal,
    unit: '',
    icon: 'heroicons-outline:light-bulb'
  },
  {
    id: 'download',
    title: '在线数量',
    value: board.data.onlineDevices,
    unit: '',
    icon: 'material-symbols:online-prediction'
  },
  {
    id: 'trade',
    title: '离线数量',
    value: board.data.offlineDevices,
    unit: '',
    icon: 'healthicons:no-outline'
  }
]);

watchEffect(() => {
  cardData.value[0].value = board.data.projectTotal;
  cardData.value[1].value = board.data.deviceTotal;
  cardData.value[2].value = board.data.onlineDevices;
  cardData.value[3].value = board.data.offlineDevices;
});
</script>

<style scoped></style>
