<template>
  <div class="flex-col h-full items-center justify-around">
    <img :src="device.pic" class="w-200px" />

    <div class="flex-col h-full items-center justify-around">
      <span>按键一：</span>
      <n-switch
        v-if="panel1Data?.ButtonMode !== 2"
        :value="panel1Data?.power === 1"
        :on-update:value="powerController1"
      >
        <template #checked>打开</template>
        <template #unchecked>关闭</template>
      </n-switch>
      <n-button
        v-if="panel1Data?.ButtonMode === 2"
        type="primary"
        @click="execScene({ sceneId: panel1Data.bindSceneList[0].sceneId })"
      >
        触发场景“{{ panel1Data.bindSceneList[0].sceneName }}”
      </n-button>
    </div>
    <div v-if="panelCount >= 2" class="flex-col h-full items-center justify-around">
      <span>按键二：</span>
      <n-switch
        v-if="panel2Data?.ButtonMode !== 2"
        :value="panel2Data?.power === 1"
        :on-update:value="powerController2"
      >
        <template #checked>打开</template>
        <template #unchecked>关闭</template>
      </n-switch>
      <n-button
        v-if="panel2Data?.ButtonMode === 2"
        type="primary"
        @click="execScene({ sceneId: panel2Data.bindSceneList[0].sceneId })"
      >
        触发场景“{{ panel2Data.bindSceneList[0].sceneName }}”
      </n-button>
    </div>
    <div v-if="panelCount >= 3" class="flex-col h-full items-center justify-around">
      <span>按键三：</span>
      <n-switch
        v-if="panel3Data?.ButtonMode !== 2"
        :value="panel3Data?.power === 1"
        :on-update:value="powerController3"
      >
        <template #checked>打开</template>
        <template #unchecked>关闭</template>
      </n-switch>
      <n-button
        v-if="panel3Data?.ButtonMode === 2"
        type="primary"
        @click="execScene({ sceneId: panel3Data.bindSceneList[0].sceneId })"
      >
        触发场景“{{ panel3Data.bindSceneList[0].sceneName }}”
      </n-button>
    </div>
    <div v-if="panelCount === 4" class="flex-col h-full items-center justify-around">
      <span>按键四：</span>
      <n-switch
        v-if="panel4Data?.ButtonMode !== 2"
        :value="panel4Data?.power === 1"
        :on-update:value="powerController4"
      >
        <template #checked>打开</template>
        <template #unchecked>关闭</template>
      </n-switch>
      <n-button
        v-if="panel4Data?.ButtonMode === 2"
        type="primary"
        @click="execScene({ sceneId: panel4Data.bindSceneList[0].sceneId })"
      >
        触发场景“{{ panel4Data.bindSceneList[0].sceneName }}”
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { defineComponent, watch, ref, onMounted } from 'vue';
import { execScene } from '@/service/api/scene';
import { fetchPanelController } from '~/src/service';

defineComponent({ name: 'DeviceController' });

const panelCount = ref(1);

const panel1Data = ref<ApiDevice.PanelItem | null>();
const panel2Data = ref<ApiDevice.PanelItem | null>();
const panel3Data = ref<ApiDevice.PanelItem | null>();
const panel4Data = ref<ApiDevice.PanelItem | null>();

let deviceMasterId: string = '';

const props = defineProps({
  device: {
    type: Object as PropType<ApiDevice.DetailRes>,
    default: () => {
      return {} as ApiDevice.DetailRes;
    }
  }
});

const emits = defineEmits(['update']);

let handledKey: string[] = [];

// eslint-disable-next-line complexity
const getData = async (keys?: string[]) => {
  if (props.device.switchInfoDTOList) {
    panelCount.value = props.device.switchInfoDTOList.length;
    if (keys && keys.length !== 0) {
      if (handledKey.includes('1')) {
        if (panelCount.value >= 2) {
          panel2Data.value = props.device.mzgdPropertyDTOList.wallSwitch2;
        }
        if (panelCount.value >= 3) {
          panel3Data.value = props.device.mzgdPropertyDTOList.wallSwitch3;
        }
        if (panelCount.value === 4) {
          panel4Data.value = props.device.mzgdPropertyDTOList.wallSwitch4;
        }
      }
      if (handledKey.includes('2')) {
        panel1Data.value = props.device.mzgdPropertyDTOList.wallSwitch1;
        if (panelCount.value >= 3) {
          panel3Data.value = props.device.mzgdPropertyDTOList.wallSwitch3;
        }
        if (panelCount.value === 4) {
          panel4Data.value = props.device.mzgdPropertyDTOList.wallSwitch4;
        }
      }
      if (handledKey.includes('3')) {
        if (panelCount.value >= 2) {
          panel2Data.value = props.device.mzgdPropertyDTOList.wallSwitch2;
        }
        panel1Data.value = props.device.mzgdPropertyDTOList.wallSwitch1;
        if (panelCount.value === 4) {
          panel4Data.value = props.device.mzgdPropertyDTOList.wallSwitch4;
        }
      }
      if (handledKey.includes('4')) {
        if (panelCount.value >= 2) {
          panel2Data.value = props.device.mzgdPropertyDTOList.wallSwitch2;
        }
        if (panelCount.value >= 3) {
          panel3Data.value = props.device.mzgdPropertyDTOList.wallSwitch3;
        }
        panel1Data.value = props.device.mzgdPropertyDTOList.wallSwitch1;
      }
    } else {
      panel1Data.value = props.device.mzgdPropertyDTOList.wallSwitch1;
      if (panelCount.value >= 2) {
        panel2Data.value = props.device.mzgdPropertyDTOList.wallSwitch2;
      }
      if (panelCount.value >= 3) {
        panel3Data.value = props.device.mzgdPropertyDTOList.wallSwitch3;
      }
      if (panelCount.value === 4) {
        panel4Data.value = props.device.mzgdPropertyDTOList.wallSwitch4;
      }
    }
    deviceMasterId = props.device.gatewayId ?? '';
  }
};

const powerController4 = async (value: boolean) => {
  const res = await fetchPanelController(4, props.device.deviceId, deviceMasterId, {
    power: value ? 1 : 0
  });
  if (!res.error) {
    (panel4Data.value as ApiDevice.PanelItem).power = value ? 1 : 0;
    emits('update');
    handledKey.push('4');
  }
};

const powerController1 = async (value: boolean) => {
  const res = await fetchPanelController(1, props.device.deviceId, deviceMasterId, {
    power: value ? 1 : 0
  });
  if (!res.error) {
    (panel1Data.value as ApiDevice.PanelItem).power = value ? 1 : 0;
    handledKey.push('1');
  }
};
const powerController2 = async (value: boolean) => {
  const res = await fetchPanelController(2, props.device.deviceId, deviceMasterId, {
    power: value ? 1 : 0
  });
  if (!res.error) {
    (panel2Data.value as ApiDevice.PanelItem).power = value ? 1 : 0;
    emits('update');
    handledKey.push('2');
  }
};
const powerController3 = async (value: boolean) => {
  const res = await fetchPanelController(3, props.device.deviceId, deviceMasterId, {
    power: value ? 1 : 0
  });
  if (!res.error) {
    (panel3Data.value as ApiDevice.PanelItem).power = value ? 1 : 0;
    emits('update');
    handledKey.push('3');
  }
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
