<template>
  <div>
    <n-space vertical>
      <n-layout has-sider>
        <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="180" show-trigger>
          <n-menu v-model:value="activeKey" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" />
        </n-layout-sider>
        <n-layout>
          <!-- <div class="w-full h-80vh">
            <statistics v-if="activeKey === 'statistics'" :id="curProject.projectId"></statistics>
            <control v-if="activeKey === 'control'" :id="curProject.projectId"></control>
            <log v-if="activeKey === 'log'"></log>
            <scene v-if="activeKey === 'scene'" :project="curProject"></scene>
          </div> -->
        </n-layout>
      </n-layout>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import type { Component, Ref } from 'vue';
import { h, ref, watch } from 'vue';
import type { MenuOption } from 'naive-ui';
import { NIcon } from 'naive-ui';
import { BarChartSharp, TerminalSharp, ReceiptSharp, CaretForwardCircleSharp } from '@vicons/ionicons5';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// const curProject: ApiProject.Project = ref();

// interface Props {
//   /** 弹窗可见性 */
//   visible: boolean;
//   /**
//    * 项目
//    */
//   project: {
//     id: string;
//     name: string;
//   };
// }

// const props = defineProps<Props>();

defineOptions({ name: 'ProjectDetailModal' });

// interface Emits {
//   (e: 'update:visible', visible: boolean): void;
// }

// const emit = defineEmits<Emits>();

const activeKey: Ref<string | null> = ref('statistics');

// const modalVisible = computed({
//   get() {
//     return props.visible;
//   },
//   set(visible) {
//     activeKey.value = 'statistics';
//     emit('update:visible', visible);
//   }
// });

const menuOptions: MenuOption[] = [
  {
    label: '项目大盘',
    key: 'statistics',
    icon: renderIcon(BarChartSharp)
  },
  {
    label: '系统控制',
    key: 'control',
    icon: renderIcon(TerminalSharp)
  },
  {
    label: '自动控制',
    key: 'scene',
    icon: renderIcon(CaretForwardCircleSharp)
  },
  {
    label: '项目日志',
    key: 'log',
    icon: renderIcon(ReceiptSharp)
  }
];

const getDetail = async () => {
  console.log('调用接口查数据');
};

function init() {
  getDetail();
}

init();

watch(
  () => activeKey.value,
  newValue => {
    if (newValue) {
      console.log('菜单选择', newValue);
    }
  }
);
</script>

<style scoped></style>
