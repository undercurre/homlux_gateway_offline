<template>
  <div class="w-full h-full" @keyup.enter="goSearch">
    <n-card class="h-full card">
      <div class="h-full flex-col">
        <n-space class="mb-10px" justify="space-between">
          <n-space class="flex items-center">
            <span>用户类型：</span>
            <n-select v-model:value="searchParams.accountType" class="w-200px" :options="accountTypeOptions" />

            <span>手机号：</span>
            <n-input
              v-model:value="searchParams.mobilePhone"
              type="text"
              placeholder="输入手机号精确查询"
              clearable
            ></n-input>

            <span>用户名称：</span>
            <n-input v-model:value="searchParams.userName" type="text" placeholder="输入名称查询" clearable></n-input>

            <n-button type="primary" ghost @click="goSearch">
              <icon-ic-Search class="text-20px" />
              <span class="ml-10px">查询</span>
            </n-button>
            <n-button type="primary" ghost @click="resetSearch">
              <span>重置</span>
            </n-button>
          </n-space>

          <n-space align="center" :size="18">
            <!-- <n-button v-if="!isSuperAdmin" size="medium" type="primary" ghost @click="handleAddTable">
              <icon-ic-round-plus class="text-20px" />
              <span class="ml-10px">添加用户</span>
            </n-button> -->

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
          :row-key="(item: ApiUser.SysUser) => item.userId"
        />
        <table-action-modal v-model:visible="visible" @update="getData" />

        <ProjectList v-model:visible="isShowProjectList" :edit-data="editData"></ProjectList>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { NSpace, NPopconfirm, NButton } from 'naive-ui';
import type { SelectOption } from 'naive-ui';
import { fetchDelUser, fetchSysUserByPage, fetchUserDetail } from '@/service';
import { useHookTable, useBoolean } from '@/hooks';
import { getDate2String } from '@/utils';
import TableActionModal from './components/table-action-modal.vue';
import ProjectList from './components/project-list.vue';

defineOptions({ name: 'UserManager' });

const accountTypeOptions = ref<SelectOption[]>([
  {
    value: '',
    label: '全部'
  },
  {
    value: '01',
    label: '总部管理员'
  },
  {
    value: '02',
    label: '代理商管理员'
  },
  {
    value: '03',
    label: '普通用户'
  }
]);

// 搜索参数
const searchParams = ref({
  mobilePhone: '',
  userName: '',
  accountType: ''
});

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(fetchSysUserByPage, {
  apiParams: {
    orderBy: 'createdTime',
    xsc: 'DESC',
    ...searchParams.value,
    mobilePhone: searchParams.value.mobilePhone.trim() // trim空白字符
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
      orderBy: 'createdTime',
      ...searchParams.value,
      mobilePhone: searchParams.value.mobilePhone.trim() // trim空白字符
    };
  },
  columns: () => [
    {
      key: 'mobilePhone',
      title: '手机号',
      align: 'center'
    },
    {
      key: 'userName',
      title: '用户名称',
      align: 'center'
    },
    {
      key: 'createdTime',
      title: '创建时间',
      align: 'center',
      render: row => {
        return getDate2String(new Date(row.createdTime));
      }
    },
    {
      key: 'accountName',
      title: '用户类型',
      align: 'center'
    },
    {
      key: 'authProjectNum',
      title: '授权项目',
      align: 'center'
    },
    {
      key: 'statusName',
      title: '账号状态',
      align: 'center'
    },
    {
      key: 'action',
      title: '操作',
      align: 'center',
      width: 120,
      render(row) {
        return row.accountType === '03' ? (
          <div class="flex justify-end gap-6px">
            <NButton size={'small'} onClick={() => handleViewProjectList(row)}>
              查看权限
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDeleteTable(row)}>
              {{
                default: () => '确认删除',
                trigger: () => <NButton size={'small'}>删除</NButton>
              }}
            </NPopconfirm>
          </div>
        ) : (
          <n-button disabled>暂无可用操作</n-button>
        );
      }
    }
  ]
});

function goSearch() {
  updatePagination({
    page: 1
  });
  getData();
}

function resetSearch() {
  searchParams.value.userName = '';
  searchParams.value.mobilePhone = '';
  searchParams.value.accountType = '';
  goSearch();
}

const { bool: visible } = useBoolean();

const editData = ref<ApiUser.SysUser | null>(null);

function setEditData(item: ApiUser.SysUser | null) {
  editData.value = item;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

async function handleDeleteTable(item: ApiUser.SysUser) {
  // 删除商户超管时，检验该用户是否关联项目，若是需先释放已有项目关联
  if (item.roleLevel === 1) {
    const userInfoRes = await fetchUserDetail({ userId: item.userId, roleLevel: item.roleLevel });

    if (!userInfoRes.error && userInfoRes.data.projectList.length) {
      window.$message?.error('请先删除该用户已关联的项目权限!');
      return;
    }
  }

  const res = await fetchDelUser(item.userId);

  if (!res.error) {
    window.$message?.success('删除成功!');

    getData();
  }
}

const { bool: isShowProjectList, setTrue: openProjectListModal } = useBoolean(); // 新增编辑代理商弹窗

async function handleViewProjectList(item: ApiUser.SysUser) {
  setEditData(item);

  openProjectListModal();
}
</script>

<style scoped></style>
