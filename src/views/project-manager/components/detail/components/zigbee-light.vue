<template>
  <div class="flex-col h-full items-center justify-around mr-20px">
    <img :src="device.pic" class="w-200px" />

    <div class="w-full flex-col items-center">
      <span>亮度：</span>
      <n-slider
        v-model:value="deviceData.brightness"
        :format-tooltip="(value: number) => `${value}%`"
        class="pl-14px mt-20px"
        :min="1"
        :max="100"
        :marks="brightMarks"
        :on-dragend="levelController"
        :disabled="deviceData && deviceData.power !== 1"
      />
    </div>

    <div
      v-if="!(deviceData.colorTempRange.minColorTemp === 0 && deviceData.colorTempRange.maxColorTemp === 0)"
      class="w-full flex-col items-center"
    >
      <span>色温：</span>
      <n-slider
        v-model:value="fakerColor"
        class="pl-14px mt-20px"
        :min="deviceData.colorTempRange.minColorTemp"
        :max="deviceData.colorTempRange.maxColorTemp"
        :marks="colorMarks"
        :on-dragend="colorController"
        :step="38"
        :disabled="deviceData && deviceData.power !== 1"
      />
    </div>

    <span>电源：</span>
    <n-switch :value="deviceData?.power === 1" :on-update:value="powerController">
      <template #checked>打开</template>
      <template #unchecked>关闭</template>
    </n-switch>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { defineComponent, watch, ref, computed, onMounted } from 'vue';
import { fetchZigbeeLightController } from '~/src/service';
import { updateMemoryObject } from '~/src/utils';

defineComponent({ name: 'DeviceController' });

const emits = defineEmits(['update']);

const deviceData = ref<ApiDevice.ZigbeeLight>({
  BcReportTime: 0,
  ColorTemp: 0,
  Duration: 0,
  LampProtocol: '',
  Level: 0,
  OnOff: 0,
  brightness: 1,
  colorTempRange: {
    minColorTemp: 0,
    maxColorTemp: 0
  },
  colorTemperature: 0,
  lampProtocol: '',
  power: 0
});

const brightMarks = {
  1: '1%',
  100: '100%'
};

const colorMarks = computed(() => {
  return {
    [deviceData.value.colorTempRange.minColorTemp]: `${deviceData.value.colorTempRange.minColorTemp}K`,
    [deviceData.value.colorTempRange.maxColorTemp]: `${deviceData.value.colorTempRange.maxColorTemp}K`
  };
});

const fakerColor = ref(0);

let deviceMasterId: string = '';

const props = defineProps({
  device: {
    type: Object as PropType<ApiDevice.DetailRes>,
    default: () => {
      return {} as ApiDevice.DetailRes;
    }
  }
});

let handledKey: string[] = [];

const getData = async (keys?: string[]) => {
  if (props.device.mzgdPropertyDTOList.light) {
    if (keys && keys.length !== 0) {
      deviceData.value = updateMemoryObject(props.device.mzgdPropertyDTOList, [...keys], deviceData.value);
      if (keys.includes('colorTemperature')) {
        fakerColor.value = Math.round(
          deviceData.value.colorTempRange.minColorTemp +
            (deviceData.value.colorTempRange.maxColorTemp - deviceData.value.colorTempRange.minColorTemp) *
              (deviceData.value.colorTemperature / 100)
        );
      }
    } else {
      deviceData.value = props.device.mzgdPropertyDTOList.light;
      fakerColor.value = Math.round(
        deviceData.value.colorTempRange.minColorTemp +
          (deviceData.value.colorTempRange.maxColorTemp - deviceData.value.colorTempRange.minColorTemp) *
            (deviceData.value.colorTemperature / 100)
      );
    }
    deviceMasterId = props.device.gatewayId ?? '';
  }
};

const powerController = async (value: boolean) => {
  const res = await fetchZigbeeLightController(props.device.deviceId, deviceMasterId, {
    power: value ? 1 : 0
  });
  if (!res.error) {
    (deviceData.value as ApiDevice.ZigbeeLight).power = value ? 1 : 0;
    emits('update');
  }
  console.log(res, deviceData.value?.power);
  // getData();
  handledKey.push('power');
};

const levelController = async () => {
  const res = await fetchZigbeeLightController(props.device.deviceId, deviceMasterId, {
    brightness: deviceData.value?.brightness as number
  });
  if (!res.error) {
    (deviceData.value as ApiDevice.ZigbeeLight).brightness = deviceData.value?.brightness as number;
    emits('update');
  }

  handledKey.push('brightness');
  // getData();
};

const colorController = async () => {
  const curValue = Math.round(
    ((fakerColor.value - deviceData.value.colorTempRange.minColorTemp) /
      (deviceData.value.colorTempRange.maxColorTemp - deviceData.value.colorTempRange.minColorTemp)) *
      100
  );
  const res = await fetchZigbeeLightController(props.device.deviceId, deviceMasterId, {
    colorTemperature: curValue
  });
  if (!res.error) {
    (deviceData.value as ApiDevice.ZigbeeLight).colorTemperature = curValue;
  }
  emits('update');
  handledKey.push('colorTemperature');
  // getData();
};

onMounted(() => {
  getData();
});

watch(
  () => {
    return props.device;
  },
  () => {
    getData(handledKey).then(() => (handledKey = []));
  }
);
</script>
