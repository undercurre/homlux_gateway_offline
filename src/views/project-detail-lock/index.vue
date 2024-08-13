<template>
  <div class="w-full h-full">
    <n-card v-if="curProjectRoleLevel === 6 || curProjectRoleLevel === 4 || isSuperAdmin" class="h-full card">
      <div class="h-full flex-col">
        <n-space class="mb-10px" justify="space-between">
          <n-space class="inline-flex items-center">
            <n-input v-model:value="searchContent" type="text" placeholder="房间号/IMEI/卡号"></n-input>
            <n-button type="primary" ghost @click="searchMethod">
              <icon-ic-Search class="text-20px" />
              <span class="ml-10px">查询</span>
            </n-button>
            <n-button type="primary" ghost @click="resetSearch">
              <span>重置</span>
            </n-button>
          </n-space>
          <n-space class="inline" align="center" :size="18">
            <n-button size="medium" type="primary" @click="getData">
              <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
              刷新表格
            </n-button>
          </n-space>
        </n-space>
        <n-data-table
          remote
          class="flex-1-hidden"
          :columns="columns"
          :data="data"
          flex-height
          :loading="loading"
          :pagination="pagination"
          :row-key="(item: ApiProject.Project) => item.projectId"
          :on-update:sorter="handleSorterChange"
        />
        <lock-log v-model:visible="visible" :lock="curLock" />
      </div>
    </n-card>

    <n-empty
      v-else
      class="w-full h-full flex justify-center items-center"
      description="该模块只对超级管理员和管理员开放"
    ></n-empty>
  </div>
</template>

<script setup lang="tsx">
import { h, onMounted, ref, watch, computed } from 'vue';
import type { DataTableSortState } from 'naive-ui';
import { NSpace, NButton, NIcon } from 'naive-ui';
import { fetchGetLocksInProject } from '@/service';
import { useProjectStore, useAuthStore } from '@/store';
import { useHookTable, useBoolean } from '@/hooks';
import LockLog from './components/lock-log.vue';

const auth = useAuthStore();

const projectStore = useProjectStore();

const searchContent = ref('');

const orderByStr = ref<'detail.battery_power' | 'detail.lock_signal'>('detail.battery_power');

const curProjectRoleLevel = computed(() => {
  return auth.userInfo.roleList.find(item => item.projectId === projectStore.curId)?.roleLevel;
});

const isSuperAdmin = computed(() => {
  const canSuperAdminLevel = auth.userInfo.roleList.find(item => item.projectId === null && item.defaultRoleFlag === 1)
    ?.roleLevel;
  return canSuperAdminLevel === 0 || canSuperAdminLevel === 1;
});

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(fetchGetLocksInProject, {
  immediate: false,
  apiParams: {
    // currentPage: 1,
    // currentPageActual: 0,
    // orderBy: 'id',
    pageNo: 1,
    pageSize: 10,
    projectId: projectStore.curId,
    params: searchContent.value,
    orderByStr: orderByStr.value as 'detail.battery_power' | 'detail.lock_signal'

    // projectName: searchContent.value.trim(),
    // xsc: 'DESC'
  },
  transformer: d => ({
    data: d.content,
    pageNum: d.pageable.pageNumber + 1,
    pageSize: [10, 15, 20, 25, 30].includes(d.size) ? d.size : 10,
    total: d.totalElements
  }),
  apiParamsUpdater: p => {
    return {
      pageNo: p.page,
      pageSize: p.pageSize,
      projectId: projectStore.curId,
      params: searchContent.value.trim(),
      orderByStr: orderByStr.value
    };
  },
  columns: () => [
    {
      key: 'deviceId',
      title: '序号',
      width: 80,
      align: 'center',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render(row, rowIndex) {
        return (
          <div>
            <span>{rowIndex + 1}</span>
          </div>
        );
      }
    },
    {
      key: 'imei',
      title: 'imei',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{row.imei}</span>
          </div>
        );
      }
    },
    {
      key: 'spaceName',
      title: '房间',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{row.spaceName}</span>
          </div>
        );
      }
    },
    {
      key: 'batteryPower',
      title: '电量',
      align: 'center',
      sortOrder: false,
      renderSorterIcon: sortBatterPowerIcon,
      sorter: true,
      render(row) {
        return (
          <div>
            <span>{row.batteryPower}</span>
          </div>
        );
      }
    },
    {
      key: 'lockSignal',
      title: '信号',
      align: 'center',
      sortOrder: false,
      renderSorterIcon: sortLockSignalIcon,
      sorter: true,
      render(row) {
        return (
          <div>
            <span>{row.lockSignal}</span>
          </div>
        );
      }
    },
    {
      key: 'iccid',
      title: '物联网卡号',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{row.iccid}</span>
          </div>
        );
      }
    },
    {
      key: 'onLineStatus',
      title: '状态',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{row.onLineStatus === 0 ? '离线' : '在线'}</span>
          </div>
        );
      }
    },
    {
      key: 'action',
      title: '',
      align: 'center',
      render(row) {
        return (
          <div class="gap-6px">
            {/* <NPopconfirm onPositiveClick={() => handleDeleteTable(row)}>
              {{
                default: () => '确认解绑',
                trigger: () => <NButton size={'small'}>解绑</NButton>
              }}
            </NPopconfirm> */}
            <NButton size={'small'} type="info" onClick={() => handleLookLog(row)}>
              日志
            </NButton>
          </div>
        );
      }
    }
  ]
});

const { bool: visible, setTrue: openModal } = useBoolean();

const curLock = ref<ApiDevice.Lock>();

// function handleDeleteTable(row: ApiDevice.Lock) {
//   // 解绑接口
//   console.log(row);
// }

function handleLookLog(lock: ApiDevice.Lock) {
  curLock.value = lock;
  openModal();
}

function sortLockSignalIcon() {
  return orderByStr.value === 'detail.lock_signal'
    ? h(NIcon, null, {
        default: () =>
          h(
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="#488FFF"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M22 7H9M2 7h3m14 5h-3M5 12h7m4 5H8"
              />
            </svg>
          )
      })
    : h(NIcon, null, {
        default: () =>
          h(
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M22 7H9M2 7h3m14 5h-3M5 12h7m4 5H8"
              />
            </svg>
          )
      });
}

function sortBatterPowerIcon() {
  return orderByStr.value === 'detail.battery_power'
    ? h(NIcon, null, {
        default: () =>
          h(
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="#488FFF"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M22 7H9M2 7h3m14 5h-3M5 12h7m4 5H8"
              />
            </svg>
          )
      })
    : h(NIcon, null, {
        default: () =>
          h(
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-width="1.5"
                d="M22 7H9M2 7h3m14 5h-3M5 12h7m4 5H8"
              />
            </svg>
          )
      });
}

function handleSorterChange(sorter: DataTableSortState | null) {
  if (sorter) {
    orderByStr.value = sorter.columnKey === 'batteryPower' ? 'detail.battery_power' : 'detail.lock_signal';
    searchMethod();
  }
}

function searchMethod() {
  updatePagination({
    page: 1,
    pageSize: pagination.pageSize
  });
  getData();
}

function resetSearch() {
  searchContent.value = '';
  searchMethod();
}

watch(
  visible,
  newValue => {
    console.log(newValue);
  },
  { immediate: false }
);

onMounted(() => {
  getData();
});
</script>

<style scoped></style>
