<template>
  <n-grid class="h-full" cols="5" responsive="screen" :x-gap="16" :y-gap="16">
    <n-grid-item v-if="options.length" class="h-full">
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
    <n-grid-item v-if="options.length" class="h-full" span="3">
      <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
      <device-list
        v-if="activeKey === 'device' && checkedSpaceIdList.length > 0"
        v-model:deviceId="checkedDeviceId"
        :space-id="checkedSpaceIdList[0]"
        :project-id="props.id"
      ></device-list>
      <group-list
        v-if="activeKey === 'group' && checkedSpaceIdList.length > 0"
        v-model:groupId="checkedDeviceId"
        :space-id="checkedSpaceIdList[0]"
        :project-id="props.id"
      ></group-list>
    </n-grid-item>
    <n-grid-item v-if="options.length" class="h-full">
      <device-controller :device-id="checkedDeviceId" :d-or-g="activeKey === 'device'"></device-controller>
    </n-grid-item>
    <n-grid-item v-if="!options.length" span="5" class="w-full h-full place-items-center">
      <n-empty description="无数据"></n-empty>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { MenuOption } from 'naive-ui';
import { fetchSpaceForProject } from '~/src/service/api/space';
import DeviceList from './components/device.vue';
import GroupList from './components/group.vue';
import DeviceController from './components/device-controller.vue';

defineOptions({ name: 'DetailControl' });

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

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
  console.log('原始数据', originalData);
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

        if (nestedChildren.length > 1) {
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

onMounted(async () => {
  const res = await fetchSpaceForProject(props.id);
  if (res.data) options.value = transformData(res.data);
  const genjiedian = res.data?.find(item => item.pid === '0');
  if (genjiedian) checkedSpaceIdList.value.push(genjiedian.spaceId);
});
</script>
