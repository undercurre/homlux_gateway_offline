<template>
  <div class="h-90% flex-col">
    <n-data-table
      class="flex-1-hidden"
      :columns="columns"
      :data="data"
      flex-height
      remote
      :loading="loading"
      :pagination="pagination"
      :row-key="(item: ApiScene.Scene) => item.sceneId"
    />
  </div>
</template>

<script setup lang="tsx">
import { watch, defineEmits } from 'vue';
import { NButton } from 'naive-ui';
import { fetchSceneByProjectId, execScene } from '@/service';
import { useHookTable } from '@/hooks';
import { useAuthStore } from '~/src/store';

defineOptions({ name: 'YijianList' });

const props = defineProps({
  spaceId: {
    type: String,
    default: ''
  },
  projectId: {
    type: String,
    default: ''
  }
});

const auth = useAuthStore();

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(fetchSceneByProjectId, {
  apiParams: {
    currentPage: 1,
    pageSize: 20,
    projectId: props.projectId,
    selectSceneType: '0',
    spaceId: props.spaceId
  },
  transformer: d => ({
    data: d.content.map(item => {
      let linkName = '';
      if (item.deviceConditions?.length > 0) {
        const device = item.deviceConditions[0];
        const switchName = device.controlEvent[0].deviceName;
        linkName = `${switchName} | ${device.deviceName}`;
      }
      item.sceneDesc = linkName ? `已关联：${linkName}` : '暂未关联开关';
      return item;
    }),
    pageNum: d.current,
    pageSize: d.size,
    total: d.totalElements
  }),
  apiParamsUpdater: p => {
    return {
      currentPage: p.currentPage,
      pageSize: p.pageSize,
      spaceId: props.spaceId,
      projectId: props.projectId,
      selectSceneType: '0'
    };
  },
  columns: () => [
    {
      key: 'sceneName',
      title: '场景名称',
      align: 'center'
    },
    {
      key: 'sceneDesc',
      title: '关联关系',
      align: 'center'
    },
    {
      key: 'spaceName',
      title: '所属空间',
      align: 'center'
    },
    {
      key: 'action',
      title: '操作',
      align: 'center',
      render(row) {
        if (auth.roleLevel === 0) return <n-button disabled>暂无可用操作</n-button>;
        return (
          <NButton size={'small'} type="info" onClick={() => handleControlOpen(row.sceneId)}>
            执行
          </NButton>
        );
      }
    }
  ],
  immediate: false
});
const emits = defineEmits(['updateLog']);
async function handleControlOpen(id: string) {
  const res = await execScene({ sceneId: id });
  if (!res.error) {
    window.$message?.success('执行成功');
    emits('updateLog');
  }
  console.log(res);
}
watch(
  () => {
    return props.spaceId;
  },
  () => {
    updatePagination({
      page: pagination.page,
      pageSize: pagination.pageSize
    });
    console.log('空间->一键场景', props.spaceId);
    if (!props.spaceId) return;
    getData();
  },
  { immediate: true }
);
</script>

<style scoped></style>
