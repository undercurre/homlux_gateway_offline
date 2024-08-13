<template>
  <div class="h-90% flex-col">
    <n-data-table
      remote
      class="flex-1-hidden"
      :columns="columns"
      :data="data"
      flex-height
      :loading="loading"
      :pagination="pagination"
      :row-key="(item: ApiProject.GroupData) => item.groupId"
      :row-class-name="rowClassName"
    />
  </div>
</template>

<script setup lang="tsx">
import { watch } from 'vue';
import { NButton } from 'naive-ui';
import { fetchGroupListBySpace } from '@/service';
import { useHookTable } from '@/hooks';
import { useAuthStore } from '~/src/store';

defineOptions({ name: 'GroupList' });

const props = defineProps({
  spaceId: {
    type: String,
    default: ''
  },
  groupId: {
    type: String,
    default: ''
  },
  projectId: {
    type: String,
    default: ''
  }
});

function rowClassName(row: ApiProject.GroupData) {
  if (row.groupId === props.groupId) {
    return 'active-device';
  }
  return '';
}

const auth = useAuthStore();

const emits = defineEmits(['update:groupId']);

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(fetchGroupListBySpace, {
  apiParams: {
    currentPage: 1,
    projectId: props.projectId,
    spaceId: props.spaceId,
    pageSize: 10
  },
  transformer: d => ({
    data: d.content,
    pageNum: d.pageable.pageNumber + 1,
    pageSize: d.size,
    total: d.totalElements
  }),
  apiParamsUpdater: p => {
    return {
      currentPage: p.page,
      page: p.page,
      pageSize: p.pageSize,
      projectId: props.projectId,
      spaceId: props.spaceId
    };
  },
  columns: () => [
    {
      key: 'groupName',
      title: '分组名称',
      align: 'center'
    },
    {
      key: 'onLineStatus',
      title: '分组状态',
      align: 'center',
      render(row) {
        return <div>{row.onLineStatus === 1 ? '在线' : '离线'}</div>;
      }
    },
    {
      key: 'action',
      title: '操作',
      align: 'center',
      render(row) {
        if (auth.roleLevel === 0) return <n-button disabled>暂无可用操作</n-button>;
        return (
          <div>
            <NButton size={'small'} type="info" onClick={() => handleControlOpen(row.groupId)}>
              控制
            </NButton>
          </div>
        );
      }
    }
  ]
});

getData();

function handleControlOpen(id: string) {
  emits('update:groupId', id);
}

watch(
  () => {
    return props.spaceId;
  },
  () => {
    updatePagination({
      page: 1,
      pageSize: pagination.pageSize
    });
    getData();
  }
);
</script>

<style scoped>
:deep(.active-device td) {
  background-color: rgba(33, 185, 108, 0.1);
}
</style>
