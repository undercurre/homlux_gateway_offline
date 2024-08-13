<template>
  <n-grid class="h-full w-full bg-#fff" cols="5" responsive="screen" :x-gap="16" :y-gap="16">
    <n-grid-item class="h-full">
      <n-tree
        v-model:selected-keys="checkedSpaceIdList"
        block-line
        :data="options"
        key-field="key"
        label-field="label"
        children-field="children"
        :default-expand-all="true"
        :default-selected-keys="checkedSpaceIdList"
        :multiple="false"
        selectable
        :cancelable="false"
      />
    </n-grid-item>
    <n-grid-item class="h-full" span="3">
      <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
      <device-list
        v-if="activeKey === 'device'"
        v-model:deviceId="checkedDeviceId"
        :space-id="checkedSpaceIdList[0]"
        :project-id="projectStore.curId"
      ></device-list>
      <group-list
        v-if="activeKey === 'group'"
        v-model:groupId="checkedDeviceId"
        :space-id="checkedSpaceIdList[0]"
        :project-id="projectStore.curId"
      ></group-list>
    </n-grid-item>
    <n-grid-item class="h-full">
      <device-controller :device-id="checkedDeviceId" :d-or-g="activeKey === 'device'"></device-controller>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { type MenuOption } from 'naive-ui';
import { useProjectStore } from '@/store';
import DeviceList from '@/views/project-manager/components/detail/components/device.vue';
import GroupList from '@/views/project-manager/components/detail/components/group.vue';
import DeviceController from '@/views/project-manager/components/detail/components/device-controller.vue';
import { fetchSpaceForProject } from '~/src/service/api/space';

const projectStore = useProjectStore();

defineOptions({ name: 'DetailControl' });

const checkedSpaceIdList: Ref<string[]> = ref([]);

const checkedDeviceId: Ref<string> = ref('');

type TreeNode = {
  label: string;
  key: string;
  disabled?: boolean;
  children?: TreeNode[];
};

type TransformedData = {
  label: string;
  key: string;
  disabled?: boolean;
  children?: TransformedData[];
};

interface TransformingData extends TransformedData {
  publicSpaceFlag: ApiProject.Space['publicSpaceFlag'];
}

function transformData(originalData: Omit<ApiProject.Space, 'cid'>[]): TransformedData[] {
  const createNode = (data: Omit<ApiProject.Space, 'cid'>): TransformingData => {
    const node: TransformingData = {
      label: data.spaceName,
      key: data.spaceId,
      publicSpaceFlag: data.publicSpaceFlag
    };

    return node;
  };

  const buildTree = (parentId: string): TransformingData[] => {
    const children: TransformingData[] = [];

    for (const item of originalData) {
      if (item.pid === parentId) {
        const childNode = createNode(item);
        const nestedChildren = buildTree(item.spaceId);

        if (nestedChildren.length >= 1) {
          childNode.children = nestedChildren;
        }

        children.push(childNode);
      }
    }

    return children;
  };

  const out = buildTree('0');

  return out;
}

const options: Ref<TreeNode[]> = ref([]);

const activeKey = ref<string>('device');

const menuOptions: MenuOption[] = [
  {
    label: '设备',
    key: 'device'
  },
  {
    label: '分组',
    key: 'group'
  }
];

async function init() {
  const res = await fetchSpaceForProject(projectStore.curId);
  if (res.data) options.value = transformData(res.data);
  const genjiedian = res.data?.find(item => item.pid === '0');
  if (genjiedian) checkedSpaceIdList.value.push(genjiedian.spaceId);
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
