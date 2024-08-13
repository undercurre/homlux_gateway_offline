<template>
  <n-card v-if="overview" :bordered="false" class="h-full w-full bg-#fff rounded-8px">
    <n-grid cols="s:1 m:2 l:3" responsive="screen" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="item in cardData" :key="item.id">
        <gradient-bg class="h-100px" :data="item"></gradient-bg>
      </n-grid-item>
    </n-grid>
    <n-grid class="pt-16px" cols="s:1 m:2 l:2" responsive="screen" :x-gap="16" :y-gap="16">
      <n-grid-item span="0:36 640:36 1024:15">
        <n-card :bordered="false" class="rounded-8px shadow-sm">
          <div ref="gaugeRef" class="w-full h-540px"></div>
        </n-card>
      </n-grid-item>
      <n-grid-item span="0:24 640:24 1024:8">
        <n-card :bordered="false" class="rounded-8px shadow-sm">
          <div ref="pieRef" class="w-full h-540px"></div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useProjectStore } from '@/store';
import { type ECOption, useEcharts } from '@/composables';
import { fetchOverviewForProject } from '~/src/service';
import { GradientBg } from '../dashboard/components/data-card/components';

const projectStore = useProjectStore();

defineOptions({ name: 'DetailStatistics' });

interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  colors: [string, string];
  icon: string;
}

let gaugeRef: Ref<HTMLElement | undefined>;
let pieRef: Ref<HTMLElement | undefined>;

const overview = ref<ApiBoard.Board>();

const cardData: Ref<CardData[]> = ref([]);

async function init() {
  const res = await fetchOverviewForProject(projectStore.curId);
  if (res.data) {
    overview.value = res.data;
  }

  const gaugeOptions = ref<ECOption>({
    tooltip: {
      formatter: '{a} <br/>{b} : {c}分'
    },
    series: [
      {
        name: '项目得分',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}'
        },
        data: [
          {
            value: Number.isNaN(((overview.value?.onlineDevices ?? 0) / (overview.value?.deviceTotal ?? 0)) * 100)
              ? 0
              : Math.round(((overview.value?.onlineDevices ?? 0) / (overview.value?.deviceTotal ?? 0)) * 100),
            name: 'SCORE'
          }
        ]
      }
    ]
  }) as Ref<ECOption>;
  gaugeRef = useEcharts(gaugeOptions).domRef;

  const pieOptions = ref<ECOption>({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '1%',
      left: 'center',
      itemStyle: {
        borderWidth: 0
      }
    },
    series: [
      {
        color: ['#5da8ff', '#8e9dff'],
        name: '离线设备',
        type: 'pie',
        radius: ['45%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '12'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: overview.value?.onlineDevices, name: '在线数量' },
          { value: overview.value?.offlineDevices, name: '离线数量' }
        ]
      }
    ]
  }) as Ref<ECOption>;
  pieRef = useEcharts(pieOptions).domRef;

  cardData.value = [
    {
      id: 'amount',
      title: '设备总数',
      value: overview.value?.deviceTotal ?? 0,
      unit: '',
      colors: ['#865ec0', '#5144b4'],
      icon: 'heroicons-outline:light-bulb'
    },
    {
      id: 'download',
      title: '在线数量',
      value: overview.value?.onlineDevices ?? 0,
      unit: '',
      colors: ['#56cdf3', '#719de3'],
      icon: 'material-symbols:online-prediction'
    },
    {
      id: 'trade',
      title: '离线数量',
      value: overview.value?.offlineDevices ?? 0,
      unit: '',
      colors: ['#fcbc25', '#f68057'],
      icon: 'healthicons:no-outline'
    }
  ];
}

onMounted(async () => {
  init();
});

watch(
  () => projectStore.curId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (newValue, oldValue) => {
    if (oldValue) init();
  },
  { immediate: false }
);
</script>

<style scoped></style>
