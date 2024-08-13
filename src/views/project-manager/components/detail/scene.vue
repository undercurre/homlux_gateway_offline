<template>
  <n-grid class="h-full" cols="5" responsive="screen" :x-gap="16" :y-gap="16">
    <n-grid-item :span="activeKey === 'yijian' ? 1 : 0">
      <n-tree
        v-model:selected-keys="checkedSpaceIdList"
        block-line
        :data="options"
        key-field="key"
        label-field="label"
        children-field="children"
        :default-expand-all="true"
        :default-selected-keys="checkedSpaceIdList"
        :cancelable="false"
        :multiple="false"
        selectable
      />
    </n-grid-item>
    <n-grid-item
      class="h-full transition-all transition-duration-300"
      :span="activeKey === 'yijian' ? 3 : 4"
      :class="[activeKey !== 'yijian' && 'pl-10']"
    >
      <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
      <auto-list v-if="activeKey === 'auto'" :project-id="props.project.projectId"></auto-list>
      <yijian-list
        v-if="activeKey === 'yijian'"
        :project-id="props.project.projectId"
        :space-id="checkedSpaceIdList[0]"
        @update-log="loadSceneLog(undefined, true)"
      ></yijian-list>
      <schedule-list v-if="activeKey === 'schedule'" :project-id="props.project.projectId"></schedule-list>
    </n-grid-item>
    <n-grid-item class="h-full">
      <n-card
        title="场景日志"
        :bordered="true"
        class="h-full"
        header-style="text-align:center;"
        content-style="overflow:auto;position: relative;padding:0;display:flex;justify-content:center;align-items:center;"
      >
        <n-empty v-if="!timelines.length" description="暂无日志"></n-empty>
        <n-scrollbar v-else class="h-full absolute p-l p-b" @scroll="onLogScroll">
          <n-timeline class="h-full">
            <n-timeline-item v-for="item in timelines" :key="item.type" v-bind="item" />
          </n-timeline>
          <div v-if="isAllSceneLog" class="text-hex-555659 text-center mt">已加载全部日志</div>
        </n-scrollbar>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { MenuOption } from 'naive-ui';
import { fetchSceneLogByProjectId } from '@/service';
import { fetchSpaceForProject } from '~/src/service/api/space';
import YijianList from './components/yijian.vue';
import ScheduleList from './components/schedule.vue';
import AutoList from './components/auto.vue';
defineOptions({ name: 'DetailControl' });

interface TimelineData {
  type: 'success' | 'error';
  title: string;
  time: string;
}
interface Props {
  /**
   * 项目
   */
  project: ApiProject.Project;
}

const props = defineProps<Props>();
const checkedSpaceIdList: Ref<string[]> = ref([]);

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
const activeKey = ref<string>('yijian');

const menuOptions: MenuOption[] = [
  {
    label: '一键场景',
    key: 'yijian'
  },
  {
    label: '日程',
    key: 'schedule'
  },
  {
    label: '自动场景',
    key: 'auto'
  }
];
const sceneLog: ApiScene.SceneLog[] = reactive([]);
const timelines = computed(() => {
  return sceneLog.map((item: ApiScene.SceneLog): TimelineData => {
    return {
      title: `${item.sceneName} ${item.errorCode === 0 ? '已执行' : '执行失败'}`,
      time: item.reportAt,
      type: item.errorCode === 0 ? 'success' : 'error'
    };
  });
});
let isLoadingSceneLog: boolean = true;
const isAllSceneLog = ref(false);
async function loadSceneLog(_reportTs?: number, refresh?: boolean) {
  isLoadingSceneLog = true;
  const { data, error } = await fetchSceneLogByProjectId({
    projectId: props.project.projectId,
    reportTs: _reportTs
  });
  isLoadingSceneLog = false;
  if (!error && data) {
    if (data.length < 50) isAllSceneLog.value = true;
    if (refresh) {
      sceneLog.length = 0;
      sceneLog.push(...data);
    } else {
      sceneLog.push(...data);
    }
  }
}

function onLogScroll(e: Event) {
  const { scrollHeight, scrollTop, clientHeight } = e.target as HTMLElement;
  if (scrollHeight - (scrollTop + clientHeight) < 100) {
    if (isLoadingSceneLog || isAllSceneLog.value) return;
    loadSceneLog(sceneLog[sceneLog.length - 1].reportTs);
  }
}
loadSceneLog();

onMounted(async () => {
  const res = await fetchSpaceForProject(props.project.projectId);
  if (res.data) options.value = transformData(res.data);
  const genjiedian = res.data?.find(item => item.pid === '0');
  if (genjiedian) checkedSpaceIdList.value.push(genjiedian.spaceId);
});
</script>
