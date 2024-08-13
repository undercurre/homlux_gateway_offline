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
import { NSwitch } from 'naive-ui';
import { fetchSceneByProjectId, setAutoSceneEnabled } from '@/service';
import { useHookTable } from '@/hooks';
import { strUtil } from '@/utils/common/strUtil';
import { useAuthStore } from '~/src/store';

defineOptions({ name: 'AutoList' });
const props = defineProps({
  projectId: {
    type: String,
    default: ''
  }
});
const auth = useAuthStore();
const { data, loading, columns, pagination, getData } = useHookTable(fetchSceneByProjectId, {
  apiParams: {
    currentPage: 1,
    pageSize: 20,
    projectId: props.projectId,
    selectSceneType: '2'
  },
  transformer: d => ({
    data: d.content.map(item => {
      item.sceneDesc = strUtil.transDesc(item.effectiveTime);
      return item;
    }),
    pageNum: d.current,
    pageSize: d.size,
    total: d.totalElements
  }),
  columns: () => [
    {
      key: 'sceneName',
      title: '场景名称',
      align: 'center'
    },
    {
      key: 'sceneDesc',
      title: '生效时间',
      align: 'center'
    },
    {
      key: 'action',
      title: '操作',
      align: 'center',
      render(row) {
        if (auth.roleLevel === 0) return <n-button disabled>暂无可用操作</n-button>;
        return (
          <NSwitch
            value={row.isEnabled === '1'}
            onUpdate:value={(value: boolean) => changeAutoSceneEnabled(value, row.sceneId)}
          ></NSwitch>
        );
      }
    }
  ]
});
async function changeAutoSceneEnabled(value: boolean, id: string) {
  const res = await setAutoSceneEnabled({ sceneId: id, isEnabled: value ? '1' : '0' });
  if (!res.error) {
    data.value.forEach(scene => {
      if (scene.sceneId === id) {
        scene.isEnabled = value ? '1' : '0';
      }
    });
  }
}
getData();
</script>

<style scoped></style>
