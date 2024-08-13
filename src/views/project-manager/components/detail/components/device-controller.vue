<template>
  <div class="h-full overflow-hidden">
    <lux-controller v-if="transformType === 'lux'" :device="deviceData as ApiDevice.DetailRes"></lux-controller>
    <zigbee-light
      v-if="transformType === 'light'"
      :device="deviceData as ApiDevice.DetailRes"
      @update="getBackData"
    ></zigbee-light>
    <group-light
      v-if="transformType === 'group'"
      :device="deviceData as ApiDevice.Group"
      @update="getBackData"
    ></group-light>
    <panel-controller
      v-if="transformType === 'panel'"
      :device="deviceData as ApiDevice.DetailRes"
      @update="getBackData"
    ></panel-controller>
    <sensor-panel v-if="transformType === 'sensor'" :device="deviceData as ApiDevice.DetailRes"></sensor-panel>
    <div v-if="transformType === 'empty'" class="w-full h-full flex justify-center items-center">
      <n-empty size="large" description="敬请期待"></n-empty>
    </div>
    <div v-if="transformType === 'null'" class="w-full h-full flex justify-center items-center">
      <n-empty size="large">
        <div>选择设备</div>
        <div>查看详情</div>
      </n-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, watch, ref, computed } from 'vue';
import { debounce, throttle } from 'lodash-es';
import { fetchDeviceDetail, fetchGroupDetail } from '~/src/service';
import ZigbeeLight from './zigbee-light.vue';
import GroupLight from './group-light.vue';
import SensorPanel from './sensor-panel.vue';
import LuxController from './lux-controller.vue';
import PanelController from './panel-controller.vue';

defineComponent({ name: 'DeviceController' });

const deviceData = ref<ApiDevice.DetailRes | ApiDevice.Group>();

const props = defineProps({
  deviceId: {
    type: String,
    default: ''
  },
  dOrG: {
    type: Boolean,
    default: true
  }
});

const getData = async () => {
  if (props.dOrG) {
    const res = await fetchDeviceDetail(props.deviceId);
    if (res.data) deviceData.value = res.data;
    console.log('获取设备详情', deviceData.value);
  } else {
    const res = await fetchGroupDetail(props.deviceId);
    if (res.data) deviceData.value = res.data;
  }
};

// 使用 debounce 包装函数，设置 3 秒的时间间隔（3000 毫秒）
const debounceFunction = debounce(getData, 1500);
const throttledFunction = throttle(getData, 10000);

function refreshDeviceStatus() {
  debounceFunction();
  setTimeout(() => {
    throttledFunction();
  }, 10000);
}

const getBackData = () => {
  refreshDeviceStatus();
};

watch(
  () => {
    return props.deviceId;
  },
  () => {
    console.log('deviceId', props.deviceId);
    getData();
  }
);

const transformType = computed(() => {
  if (deviceData.value) {
    if (deviceData.value.proType === '0x21' && deviceData.value.deviceType === 2) {
      return 'panel';
    }
    if (deviceData.value.proType === '0x13' && deviceData.value.deviceType === 2) {
      return 'light';
    }
    if (deviceData.value.proType === '0x16') {
      return 'empty';
    }
    if (deviceData.value.proType === '0x13' && deviceData.value.deviceType === 4) {
      return 'group';
    }
    if (deviceData.value.proType === '0xBC') {
      if ((deviceData.value as ApiDevice.DetailRes).productId === 'midea.hlightsensor.001.001') {
        return 'lux';
      }
      return 'sensor';
    }
  }
  return 'null';
});
</script>
