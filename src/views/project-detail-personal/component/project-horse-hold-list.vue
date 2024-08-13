<template>
  <div class="w-full h-full">
    <n-card class="h-full card">
      <div class="h-full flex-col">
        <n-space class="mb-10px" justify="space-between">
          <n-space class="inline-flex items-center">
            <n-input v-model:value="searchContent" type="text" placeholder="姓名/手机号"></n-input>
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
          :row-key="(item: ApiDevice.Personal) => item.mobilePhone"
        />
        <personal-log
          v-model:visible="personalLogVisible"
          :project-id="logProjectId"
          :user-id="logUserId"
          :user-name="logUserName"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { NSpace, NButton } from 'naive-ui';
import { fetchPersonalList } from '@/service';
import { useProjectStore } from '@/store';
import { useHookTable, useBoolean } from '@/hooks';
import PersonalLog from './personal-log.vue';

const projectStore = useProjectStore();

const searchContent = ref('');

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(fetchPersonalList, {
  immediate: false,
  apiParams: {
    currentPage: 1,
    pageSize: 10,
    roleLevels: [5],
    roleLevel: 5,
    projectId: projectStore.curId,
    params: searchContent.value.trim()
  },
  transformer: d => {
    return {
      data: d.content,
      pageNum: d.pageable.pageNumber + 1,
      pageSize: [10, 15, 20, 25, 30].includes(d.size) ? d.size : 10,
      total: d.totalElements
    };
  },
  apiParamsUpdater: p => {
    return {
      currentPage: p.page,
      pageSize: p.pageSize,
      roleLevels: p.roleLevels,
      roleLevel: p.roleLevel,
      projectId: projectStore.curId,
      params: searchContent.value
    };
  },
  columns: () => [
    {
      key: 'userId',
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
      key: 'userName',
      title: '名称',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{row.userName}</span>
          </div>
        );
      }
    },
    {
      key: 'roleLevelName',
      title: '类型',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{row.roleLevelName}</span>
          </div>
        );
      }
    },
    {
      key: 'mobilePhone',
      title: '手机号',
      align: 'center',
      sortOrder: false,
      sorter: false,
      render(row) {
        return (
          <div>
            <span>{row.mobilePhone}</span>
          </div>
        );
      }
    },
    {
      key: 'spaceName',
      title: '楼栋',
      align: 'center',
      sortOrder: false,
      sorter: false,
      render(row) {
        return (
          <div>
            <span>{row.spaceName}</span>
          </div>
        );
      }
    },
    {
      key: 'validDate',
      title: '有效期',
      align: 'center',
      sortOrder: false,
      sorter: false,
      render(row) {
        return (
          <div>
            <span>{row.validDate}</span>
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
          <div class="gap-6px min-block-2rem">
            <NSpace class="inline" align="center">
              <NButton
                size={'small'}
                type="info"
                onClick={() => handleLock(row.userName, row.userId, projectStore.curId)}
              >
                日志
              </NButton>
            </NSpace>
          </div>
        );
      }
    }
  ]
});

const { bool: personalLogVisible, setTrue: openPersonalLogVisible } = useBoolean();

const logUserId = ref<string | null>(null);

const logProjectId = ref<string | null>(null);

const logUserName = ref<string | null>(null);

async function handleLock(userName: string, userId: string, projectId: string) {
  logUserId.value = userId;
  logProjectId.value = projectId;
  logUserName.value = userName;
  openPersonalLogVisible();
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

onMounted(async () => {
  await getData();
});
</script>

<style scoped></style>
