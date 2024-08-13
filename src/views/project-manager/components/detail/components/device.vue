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
      :row-key="(item: ApiProject.DeviceInContentItem) => item.deviceId"
      :row-class-name="rowClassName"
    />
  </div>
</template>

<script setup lang="tsx">
import { watch } from 'vue';
import { NButton } from 'naive-ui';
import { fetchDeviceListBySpace } from '@/service';
import { useHookTable } from '@/hooks';
import { useAuthStore } from '~/src/store';

defineOptions({ name: 'DeviceList' });

const props = defineProps({
  spaceId: {
    type: String,
    default: ''
  },
  projectId: {
    type: String,
    default: ''
  },
  deviceId: {
    type: String,
    default: ''
  }
});

function rowClassName(row: ApiProject.DeviceInContentItem) {
  if (row.deviceId === props.deviceId) {
    return 'active-device';
  }
  return '';
}

const auth = useAuthStore();

const emits = defineEmits(['update:deviceId']);

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(fetchDeviceListBySpace, {
  apiParams: {
    pageNo: 1,
    pageSize: 10,
    projectId: props.projectId,
    spaceId: props.spaceId
  },
  transformer: d => {
    return {
      data: d.content,
      pageNum: d.pageable.pageNumber + 1,
      pageSize: d.size,
      total: d.totalElements
    };
  },
  apiParamsUpdater: p => {
    return {
      pageNo: p.page,
      page: p.page,
      pageSize: p.pageSize,
      projectId: props.projectId,
      spaceId: props.spaceId
    };
  },
  columns: () => [
    {
      key: 'deviceName',
      title: '设备名称',
      align: 'center'
    },
    {
      key: 'deviceType',
      title: '设备类型',
      align: 'center',
      render(row) {
        return <div>{transformType(row.proType, row.deviceType)}</div>;
      }
    },
    {
      key: 'onLineStatus',
      title: '设备状态',
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
        if (row.proType === '0x16' || (auth.roleLevel === 0 && row.proType !== '0xBC') || row.proType === '0x14')
          return <n-button disabled>暂无可用操作</n-button>;
        return (
          <div>
            <NButton size={'small'} type="info" onClick={() => handleControlOpen(row.deviceId)}>
              {transformActionType(row.proType, row.deviceType)}
            </NButton>
          </div>
        );
      }
    }
  ],
  immediate: false
});

// getData();

function handleControlOpen(id: string) {
  console.log('点击事件', id);
  emits('update:deviceId', id);
}

// eslint-disable-next-line consistent-return
function transformType(proType: string, deviceType: number) {
  if (proType === '0x21' && deviceType === 2) {
    return '面板';
  }
  if (proType === '0x13' && deviceType === 2) {
    return '灯具';
  }
  if (proType === '0x16') {
    return '网关';
  }
  if (proType === '0xBC') {
    return '传感器';
  }
  return '灯具';
}

function transformActionType(proType: string, deviceType: number) {
  if (proType === '0x21' && deviceType === 2) {
    return '控制';
  }
  if (proType === '0x13' && deviceType === 2) {
    return '控制';
  }
  if (proType === '0x16') {
    return '更多';
  }
  if (proType === '0xBC') {
    return '日志';
  }
  return '控制';
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
    if (!props.spaceId) return;
    console.log('更新设备列表数据', props.spaceId);
    getData();
  },
  { immediate: true }
);

// watch(
//   () => {
//     return pagination.pageSize;
//   },
//   () => {
//     updatePagination({
//       page: 1,
//       pageSize: pagination.pageSize
//     });
//     getData();
//   }
// );
</script>

<style scoped>
:deep(.active-device td) {
  background-color: rgba(33, 185, 108, 0.1);
}
</style>
