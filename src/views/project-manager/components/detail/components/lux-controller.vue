<template>
  <n-card
    class="h-full"
    title="传感器日志"
    :bordered="true"
    header-style="text-align:center;"
    content-style="position: relative;padding:0;display:flex;justify-content:center;align-items:center;"
  >
    <div class="h-full absolute-tr left-0 top-0 box-border flex flex-col items-center overflow-hidden">
      <img :src="device.pic" class="w-200px" />
      <div class="mb-20px">
        <n-tag v-if="device.onLineStatus === 1" type="success">在线</n-tag>
        <n-tag v-if="device.onLineStatus === 0" type="error">离线</n-tag>
      </div>
      <n-empty v-if="!timelines.length" class="flex-1" description="暂无日志"></n-empty>
      <n-scrollbar v-if="timelines.length" class="flex-1 p-l p-b box-border">
        <n-timeline>
          <n-timeline-item
            v-for="item in timelines"
            :key="item.reportTs"
            type="success"
            :title="item.content"
            :content="item.reportAt"
          />
        </n-timeline>
      </n-scrollbar>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import type { PropType, Ref } from 'vue';
import { defineComponent, watch, ref, onMounted } from 'vue';
import { fetchSensorLog } from '~/src/service';

const timelines: Ref<ApiDevice.SensorLog[]> = ref([]);

defineComponent({ name: 'LuxController' });

const props = defineProps({
  device: {
    type: Object as PropType<ApiDevice.DetailRes>,
    default: () => {
      return {} as ApiDevice.DetailRes;
    }
  }
});

const getData = async () => {
  const res = await fetchSensorLog(props.device.deviceId);
  if (res.data) timelines.value = [res.data[0]];
};

onMounted(() => {
  getData();
});

watch(
  () => {
    return props.device;
  },
  () => {
    console.log('deviceId', props.device);
    getData();
  }
);
</script>
