<template>
  <div class="w-full h-full">
    <n-card class="h-full card">
      <div class="h-full flex-col">
        <n-space class="mb-10px" justify="space-between">
          <n-space class="inline-flex items-center">
            <span>用户名称：</span>
            <n-input
              v-model:value="searchUserName"
              clearable
              type="text"
              placeholder="输入名称查询"
              :disabled="batchStatus"
              :on-change="searchMethod"
            ></n-input>
            <span>手机号：</span>
            <n-input
              v-model:value="searchMobilePhone"
              clearable
              type="text"
              placeholder="输入手机号精准查询"
              :disabled="batchStatus"
              :on-change="searchMethod"
            ></n-input>
            <span>用户类型：</span>
            <n-select
              :value="searchRoleLevel"
              clearable
              class="w-200px"
              :disabled="batchStatus"
              :options="
                projectStore.isLockProject ? auth.projectMemberTypeDictInLock : auth.projectMemberTypeDictInLight
              "
              :on-update:value="updateRoleLevelCondition"
            />
            <n-button :disabled="!inited || loading || batchStatus" type="primary" ghost @click="searchMethod">
              <icon-ic-Search class="text-20px" />
              <span class="ml-10px">查询</span>
            </n-button>
            <n-button :disabled="batchStatus" type="primary" ghost @click="resetSearch">
              <span>重置</span>
            </n-button>
          </n-space>
          <n-space class="inline" align="center" :size="18">
            <n-button
              v-if="inited && (authInCurProject === 1 || authInCurProject === 2)"
              :disabled="batchStatus"
              type="primary"
              size="medium"
              ghost
              @click="handleAddTable"
            >
              <icon-ic-round-plus class="text-20px" />
              <span class="ml-10px">添加成员</span>
            </n-button>

            <div class="flex">
              <n-button
                v-if="inited && (authInCurProject === 1 || authInCurProject === 2)"
                :disabled="loading"
                type="primary"
                size="medium"
                :ghost="!batchStatus"
                @click="handleBatchSwitchPre"
              >
                <n-icon color="#21B96C" size="16">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                    <path
                      :fill="!batchStatus ? '#21B96C' : '#fff'"
                      d="m8.878.392l5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0M7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758l-4.63-2.685a.25.25 0 0 0-.25 0M2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271l4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z"
                    />
                  </svg>
                </n-icon>
                <span class="ml-10px">{{ batchStatus ? '下一步' : '空间权限' }}</span>
              </n-button>
              <n-button v-if="batchStatus" type="primary" size="medium" ghost @click="handleBatchSwitch">
                <span>取消</span>
              </n-button>
            </div>
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
          :row-key="(item: ApiProject.Member) => item.userId"
          :checked-row-keys="checkRowKeys"
          @update:checked-row-keys="handleCheck"
        />
        <table-action-drawer-edit v-model:visible="visible" :edit-data="editData" :role-options="roleOptions" />
        <table-action-drawer-add
          v-model:visible="addVisible"
          :had-data="data"
          :cur-level="authInCurProject"
          :role-options="roleOptions"
        ></table-action-drawer-add>
        <batch-space-action-drawer
          v-model:visible="batchVisible"
          :check-rows="checkRows"
          :edit-data="editData"
          :role-options="roleOptions"
          @submit="() => (batchStatus = false)"
        />
        <!-- <project-detail-model v-model:visible="detailVisible" :project="detail"></project-detail-model> -->
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { computed, onMounted, ref, watch } from 'vue';
import type { DataTableRowKey } from 'naive-ui';
import { NSpace, NPopconfirm, NButton } from 'naive-ui';
import { fetchDelProjectMember, queryProjectMember } from '@/service';
import { useAuthStore, useProjectStore } from '@/store';
import { useHookTable, useBoolean } from '@/hooks';
import TableActionDrawerEdit from './components/table-action-drawer-edit.vue';
import tableActionDrawerAdd from './components/table-action-drawer-add.vue';
import BatchSpaceActionDrawer from './components/batch-space-action-drawer.vue';

const auth = useAuthStore();
const projectStore = useProjectStore();

const inited = ref(false);

const { roleLevel } = auth;

const searchUserName = ref('');

const searchMobilePhone = ref('');

const searchProjectId = ref('');

const searchRoleLevel = ref<number | null>(null);

const checkRows = ref<ApiProject.Member[]>([]);

const checkRowKeys = ref<ApiProject.Member['userId'][]>([]);

const authInCurProject = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (!loading.value) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const curMember = data.value.find(item => item.mobilePhone === auth.userInfo.mobilePhone);
    if (curMember) {
      return curMember.roleLevel;
    }
    // 普通代理商
    if (auth.userInfo.roleList.length === 1 && !auth.userInfo.roleList[0].projectId) {
      return auth.roleLevel;
    }
    // 超管代理商
    if (
      auth.userInfo.roleList.length === 2 &&
      !auth.userInfo.roleList[0].projectId &&
      !auth.userInfo.roleList[1].projectId
    ) {
      return auth.roleLevel;
    }
    const curAuthRole = auth.userInfo.roleList.find(item => item.projectId === projectStore.curId);
    if (curAuthRole) {
      return curAuthRole.roleLevel;
    }
    return 3;
  }
  return 3;
});

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(queryProjectMember, {
  immediate: false,
  apiParams: {
    currentPage: 1,
    currentPageActual: 0,
    orderBy: 'id',
    pageSize: 10,
    projectId: searchProjectId.value,
    mobilePhone: searchMobilePhone.value.trim(),
    userName: searchUserName.value.trim(),
    roleLevel: searchRoleLevel.value,
    xsc: 'DESC'
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
      pageSize: p.pageSize,
      projectId: searchProjectId.value,
      mobilePhone: searchMobilePhone.value.trim(),
      userName: searchUserName.value.trim(),
      // eslint-disable-next-line no-void
      roleLevel: searchRoleLevel.value ?? void 0,
      xsc: 'DESC'
    };
  },
  columns: () => [
    {
      key: 'userName',
      title: '用户名称',
      align: 'center'
    },
    {
      key: 'mobilePhone',
      title: '手机号',
      align: 'center'
    },
    {
      key: 'roleLevel',
      title: '用户类型',
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
      key: 'action',
      title: '操作',
      align: 'center',
      render(row) {
        if (
          authInCurProject.value === 0 ||
          authInCurProject.value === 3 ||
          auth.userInfo.mobilePhone === row.mobilePhone
        ) {
          return <n-button disabled>暂无可用操作</n-button>;
        }
        if (row.roleLevel > authInCurProject.value) {
          if (row.roleLevel === 4) {
            return <n-button disabled>暂无可用操作</n-button>;
          }
          return (
            <div class="flex justify-center">
              <NButton
                class="mr-10px"
                v-if={row.roleLevel > authInCurProject.value}
                size={'small'}
                onClick={() => handleEditTable(row)}
              >
                编辑权限
              </NButton>
              <NPopconfirm onPositiveClick={() => handleDeleteTable(row.userId)}>
                {{
                  default: () => '确认移除',
                  trigger: () => <NButton size={'small'}>移除</NButton>
                }}
              </NPopconfirm>
            </div>
          );
        }
        return <n-button disabled>暂无可用操作</n-button>;
      }
    }
  ]
});

const { bool: visible, setTrue: openModal } = useBoolean();
const { bool: addVisible, setTrue: openAddModal } = useBoolean();
const { bool: batchVisible, setTrue: openBatchModal } = useBoolean();

const editData = ref<ApiProject.Member | null>(null);

function setEditData(item: ApiProject.Member | null) {
  editData.value = item;
}

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkRowKeys.value = rowKeys as string[];
  checkRows.value = data.value.filter(item => rowKeys.includes(item.userId));
}

function handleAddTable() {
  openAddModal();
  projectStore.getAllUser();
}

const batchStatus = ref(false);

function handleBatchSwitchPre() {
  if (!batchStatus.value) {
    handleBatchSwitch();
  } else if (checkRows.value.length === 0) {
    window.$message?.warning('请选择要批量操作的成员!');
  } else {
    openBatchModal();
  }
}

function handleBatchSwitch() {
  batchStatus.value = !batchStatus.value;
  if (!batchStatus.value) {
    checkRowKeys.value = [];
    checkRows.value = [];
  }
}

function handleEditTable(item: ApiProject.Member) {
  setEditData(item);
  openModal();
}

async function handleDeleteTable(id: string) {
  const res = await fetchDelProjectMember({ projectId: projectStore.curId, userId: id });
  if (!res.error) {
    window.$message?.success('删除成功!');
    getData();
  }
}

async function searchMethod() {
  updatePagination({
    page: 1,
    pageSize: pagination.pageSize
  });
  await getData();
}

function resetSearch() {
  searchUserName.value = '';
  searchMobilePhone.value = '';
  searchRoleLevel.value = null;
  searchMethod();
}

function updateRoleLevelCondition(value: number) {
  searchRoleLevel.value = value;
  searchMethod();
}

watch(
  [() => visible.value, () => addVisible.value],
  ([newVal1, newVal2]) => {
    if (!newVal1 || !newVal2) {
      getData();
    }
  },
  { immediate: false }
);

const roleOptions = ref<ApiAuth.UserRole[]>([]);

async function init() {
  const roleRes = projectStore.isLockProject ? auth.projectRoleDictInLock : auth.projectRoleDictInLight;

  const biggerRoles = roleRes.filter(item => item.roleLevel >= roleLevel);

  roleOptions.value = [
    {
      roleId: '',
      roleLevel: -1,
      roleName: '全部',
      defaultRoleFlag: 0 as 0 | 1,
      projectId: ''
    }
  ].concat(biggerRoles);

  auth.getAllUser();
  projectStore.getAllUser();
}

onMounted(async () => {
  init();
  searchProjectId.value = projectStore.curId;
  searchMethod().then(() => {
    inited.value = true;
  });
});

watch(
  () => projectStore.curId,
  (newValue, oldValue) => {
    if (newValue) {
      searchProjectId.value = newValue;
      updatePagination({
        page: 1,
        pageSize: pagination.pageSize
      });
      if (oldValue) getData();
    }
  }
);

watch(batchStatus, newValue => {
  if (newValue) {
    columns.value.unshift({
      type: 'selection',
      disabled(row: ApiProject.Member) {
        return row.roleLevel !== 3;
      }
    });
  } else {
    columns.value.shift();
  }
});

watch(batchVisible, newValue => {
  if (!newValue && !batchStatus.value) {
    checkRowKeys.value = [];
    checkRows.value = [];
  }
});
</script>

<style scoped></style>
