<template>
  <div class="flex-col h-full items-center justify-around mr-20px">
    <img src="@/assets/images/device/zigbee-light.png" />

    <span>亮度：</span>
    <n-slider
      v-model:value="deviceData.brightness"
      class="pl-14px"
      :min="1"
      :max="100"
      :marks="brightMarks"
      :on-dragend="levelController"
      :disabled="deviceData && deviceData.power !== 1"
    />

    <span>色温：</span>
    <n-slider
      v-model:value="deviceData.colorTemperature"
      class="pl-14px"
      :min="0"
      :max="100"
      :marks="colorMarks"
      :format-tooltip="formatColor"
      :on-dragend="colorController"
      :disabled="deviceData && deviceData.power !== 1"
    />

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
import { fetchLightGroupController } from '~/src/service';
import { updateMemoryObject } from '~/src/utils';

defineComponent({ name: 'DeviceController' });

const deviceData = ref<ApiDevice.GroupControlAction>({
  power: 0,
  brightness: 1,
  colorTemperature: 0,
  OnOff: 0,
  Level: 0,
  ColorTemp: 0
});

const colorTempRangeMap = ref({
  minColorTemp: 2700,
  maxColorTemp: 6500
});

const brightMarks = {
  1: '1%',
  100: '100%'
};

const colorMarks = computed(() => {
  return {
    0: `${colorTempRangeMap.value.minColorTemp}K`,
    100: `${colorTempRangeMap.value.maxColorTemp}K`
  };
});

function formatColor(value: number) {
  return (
    colorTempRangeMap.value.minColorTemp +
    (colorTempRangeMap.value.maxColorTemp - colorTempRangeMap.value.minColorTemp) * (value / 100)
  );
}

const props = defineProps({
  device: {
    type: Object as PropType<ApiDevice.Group>,
    default: () => {
      return {} as ApiDevice.Group;
    }
  }
});

const emits = defineEmits(['update']);

let handledKey: string[] = [];

const getData = async (keys?: string[]) => {
  if (props.device.controlAction) {
    if (keys && keys.length !== 0) {
      deviceData.value = updateMemoryObject(props.device.controlAction[0], [...keys], deviceData.value);
    } else {
      deviceData.value = props.device.controlAction[0];
    }
  }
};

const powerController = async (value: boolean) => {
  const res = await fetchLightGroupController(props.device.groupId, {
    power: value ? 1 : 0
  });
  if (!res.error) {
    (deviceData.value as ApiDevice.ZigbeeLight).power = value ? 1 : 0;
    emits('update');
  }
  console.log(res, deviceData.value?.power);
  handledKey.push('power');
};

const levelController = async () => {
  const lastLevel = deviceData.value?.brightness;
  const res = await fetchLightGroupController(props.device.groupId, {
    brightness: deviceData.value?.brightness as number
  });
  if (!res.error) {
    (deviceData.value as ApiDevice.ZigbeeLight).brightness = lastLevel as number;
    emits('update');
  }
  handledKey.push('brightness');
};

const colorController = async () => {
  const lastColor = deviceData.value?.colorTemperature;
  const res = await fetchLightGroupController(props.device.groupId, {
    colorTemperature: deviceData.value?.colorTemperature as number
  });
  if (!res.error) {
    (deviceData.value as ApiDevice.ZigbeeLight).colorTemperature = lastColor as number;
    emits('update');
  }
  handledKey.push('colorTemperature');
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
