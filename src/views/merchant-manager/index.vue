<template>
  <div class="w-full h-full" @keyup.enter="goSearch">
    <n-card class="h-full card">
      <div class="h-full flex-col">
        <n-space class="mb-10px" justify="space-between">
          <n-space class="flex items-center">
            <span>代理商名称：</span>
            <n-input
              v-model:value="searchParams.merchantName"
              type="text"
              placeholder="输入名称查询"
              clearable
            ></n-input>

            <span>注册手机：</span>
            <n-input
              v-model:value="searchParams.mobilePhone"
              type="text"
              placeholder="输入手机号精确查询"
              clearable
            ></n-input>

            <span>联系人：</span>
            <n-input
              v-model:value="searchParams.merchantLeader"
              type="text"
              placeholder="输入联系人名称查询"
              clearable
            ></n-input>

            <n-button type="primary" ghost @click="goSearch">
              <icon-ic-Search class="text-20px" />
              <span class="ml-10px">查询</span>
            </n-button>
            <n-button type="primary" ghost @click="resetSearch">
              <span>重置</span>
            </n-button>
          </n-space>

          <n-space align="center" :size="18">
            <n-button size="medium" type="primary" ghost @click="handleAddTable">
              <icon-ic-round-plus class="text-20px" />
              <span class="ml-10px">创建代理商</span>
            </n-button>

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
          :row-key="(item: ApiMerchant.MerchantItem) => item.merchantCode"
        />
        <table-action-modal v-model:visible="visible" :edit-data="editData" @update="getData" />

        <ChangeMobile v-model:visible="isChangeMobile" :edit-data="editData" @update="getData"></ChangeMobile>

        <ProjectList v-model:visible="isShowProjectList" :edit-data="editData"></ProjectList>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { NSpace, NPopconfirm, NButton } from 'naive-ui';
import { fetchMerchantListByPage, fetchDelMerchant } from '@/service';
import { useHookTable, useBoolean } from '@/hooks';
import { getDate2String } from '@/utils';
import TableActionModal from './components/table-action-modal.vue';
import ChangeMobile from './components/change-mobile.vue';
import ProjectList from './components/project-list.vue';

// 搜索参数
const searchParams = ref({
  mobilePhone: '',
  merchantName: '',
  merchantLeader: ''
});

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(fetchMerchantListByPage, {
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
    console.log('apiParamsUpdater', p);

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
      key: 'merchantName',
      title: '代理商名称',
      align: 'center'
    },
    {
      key: 'merchantArea',
      title: '区域',
      align: 'center'
    },
    {
      key: 'mobilePhone',
      title: '注册手机',
      align: 'center'
    },
    {
      key: 'merchantLeader',
      title: '联系人',
      align: 'center'
    },
    {
      key: 'projectTotal',
      title: '项目数',
      align: 'center',
      render: row => {
        return (
          <n-button quaternary color="#2080f0" onClick={() => handleViewProjectList(row)}>
            {row.projectTotal}
          </n-button>
        );
      }
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
      key: 'action',
      title: '操作',
      align: 'center',
      width: 200,
      render(row) {
        return (
          row.isDefault === 0 && (
            <div class="flex justify-end gap-6px">
              <NButton size={'small'} onClick={() => handleEditTable(row)}>
                编辑
              </NButton>
              <NPopconfirm onPositiveClick={() => handleDeleteTable(row)}>
                {{
                  default: () => '确认删除',
                  trigger: () => <NButton size={'small'}>删除</NButton>
                }}
              </NPopconfirm>
              <NButton size={'small'} onClick={() => handleChangeMobile(row)}>
                变更手机
              </NButton>
            </div>
          )
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
  searchParams.value.merchantLeader = '';
  searchParams.value.merchantName = '';
  searchParams.value.mobilePhone = '';
  goSearch();
}
const { bool: visible, setTrue: openModal } = useBoolean(); // 新增编辑代理商弹窗

const editData = ref<ApiMerchant.MerchantItem | null>(null);

function setEditData(item: ApiMerchant.MerchantItem | null) {
  editData.value = item;
}

function handleAddTable() {
  setEditData(null);
  openModal();
}

function handleEditTable(item: ApiMerchant.MerchantItem) {
  setEditData(item);
  openModal();
}

async function handleDeleteTable(item: ApiMerchant.MerchantItem) {
  const res = await fetchDelMerchant(item.merchantCode);

  if (!res.error) {
    window.$message?.success('删除成功!');

    getData();
  }
}

const { bool: isChangeMobile, setTrue: openChangeMobileModal } = useBoolean(); // 变更手机号弹窗

async function handleChangeMobile(item: ApiMerchant.MerchantItem) {
  setEditData(item);
  openChangeMobileModal();
}

const { bool: isShowProjectList, setTrue: openProjectListModal } = useBoolean(); // 新增编辑代理商弹窗

async function handleViewProjectList(item: ApiMerchant.MerchantItem) {
  setEditData(item);
  openProjectListModal();
}
</script>

<style scoped></style>
