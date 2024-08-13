<template>
  <div class="w-full h-full">
    <n-card class="h-full card">
      <div class="h-full flex-col">
        <n-space class="mb-10px" justify="space-between">
          <n-space class="inline-flex items-center">
            <span>项目类型：</span>
            <n-select v-model:value="searchType" class="w-200px" :options="auth.projectTypeDict" />
            <span>项目区域：</span>
            <n-select v-model:value="searchAddress" class="w-200px" :options="addressOptions" />
            <span>项目名称：</span>
            <n-input v-model:value="searchName" type="text" placeholder="输入项目名称查询"></n-input>
            <n-button type="primary" ghost @click="searchMethod">
              <icon-ic-Search class="text-20px" />
              <span class="ml-10px">查询</span>
            </n-button>
            <n-button type="primary" ghost @click="resetSearch">
              <span>重置</span>
            </n-button>
          </n-space>
          <n-space class="inline" align="center" :size="18">
            <n-button v-if="auth.roleLevel === 1" type="primary" size="medium" ghost @click="handleAddTable">
              <icon-ic-round-plus class="text-20px" />
              <span class="ml-10px">创建项目</span>
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
          :row-key="(item: ApiProject.Project) => item.projectId"
        />
        <table-action-drawer v-model:visible="visible" :type="modalType" :edit-data="editData" />
        <!-- <project-detail-model v-model:visible="detailVisible" :project="detail"></project-detail-model> -->
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { NSpace, NPopconfirm, NButton } from 'naive-ui';
import type { SelectOption } from 'naive-ui';
import { routeName } from '@/router';
import { fetchDelProjectByPage, fetchProjectByPage } from '@/service';
import { useAuthStore, useRouteStore, useProjectStore } from '@/store';
import { useHookTable, useBoolean } from '@/hooks';
import areaData from '@/assets/data/area.json';
import { useRouterPush } from '~/src/composables/router';
import TableActionDrawer from './components/table-action-drawer.vue';
// import ProjectDetailModel from './components/project-detail-model.vue';
import type { ModalType } from './components/table-action-drawer.vue';

const auth = useAuthStore();

interface District {
  code: string;
  name: string;
}

interface City {
  code: string;
  name: string;
  children: District[];
}

interface Province {
  code: string;
  name: string;
  children: City[];
}

const findLocationByCode = (dataTree: Province[], targetCode: string): string | null => {
  for (const province of dataTree) {
    for (const city of province.children || []) {
      for (const district of city.children || []) {
        if (district.code === targetCode) {
          return `${province.name} / ${city.name} / ${district.name}`;
        }
      }
    }
  }
  return targetCode; // 如果找不到对应的 code，直接返回那个code
};

const searchName = ref('');

const searchType = ref('');

const searchAddress = ref('');

function findProjectType(code: string) {
  return auth.projectTypeDict.find(item => item.value === code)?.label ?? '未知';
}

const addressOptions: Ref<SelectOption[]> = ref([
  { label: '全部', value: '' },
  { label: '天津', value: '天津' },
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '重庆', value: '重庆' },
  { label: '河北', value: '河北' },
  { label: '河南', value: '河南' },
  { label: '云南', value: '云南' },
  { label: '辽宁', value: '辽宁' },
  { label: '黑龙江', value: '黑龙江' },
  { label: '湖南', value: '湖南' },
  { label: '安徽', value: '安徽' },
  { label: '山东', value: '山东' },
  { label: '新疆', value: '新疆' },
  { label: '江苏', value: '江苏' },
  { label: '浙江', value: '浙江' },
  { label: '江西', value: '江西' },
  { label: '湖北', value: '湖北' },
  { label: '广西', value: '广西' },
  { label: '甘肃', value: '甘肃' },
  { label: '山西', value: '山西' },
  { label: '内蒙古', value: '内蒙古' },
  { label: '陕西', value: '陕西' },
  { label: '吉林', value: '吉林' },
  { label: '福建', value: '福建' },
  { label: '贵州', value: '贵州' },
  { label: '广东', value: '广东' },
  { label: '青海', value: '青海' },
  { label: '西藏', value: '西藏' },
  { label: '四川', value: '四川' },
  { label: '宁夏', value: '宁夏' },
  { label: '海南', value: '海南' },
  { label: '台湾', value: '台湾' },
  { label: '香港', value: '香港' },
  { label: '澳门', value: '澳门' }
]);

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(fetchProjectByPage, {
  immediate: false,
  apiParams: {
    currentPage: 1,
    currentPageActual: 0,
    orderBy: 'id',
    pageSize: 10,
    projectArea: searchAddress.value,
    projectName: searchName.value.trim(),
    projectType: searchType.value,
    xsc: 'DESC'
  },
  transformer: d => ({
    data: d.content,
    pageNum: d.pageable.pageNumber + 1,
    pageSize: [10, 15, 20, 25, 30].includes(d.size) ? d.size : 10,
    total: d.totalElements
  }),
  apiParamsUpdater: p => {
    console.log('请求参数更新', p);
    return {
      currentPage: p.page,
      pageSize: p.pageSize,
      projectArea: searchAddress.value,
      projectName: searchName.value.trim(),
      projectType: searchType.value,
      xsc: 'DESC'
    };
  },
  columns: () => [
    {
      key: 'projectName',
      title: '项目名称',
      align: 'center'
    },
    {
      key: 'projectAreaCode',
      title: '项目区域',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{findLocationByCode(areaData, row.projectAreaCode)}</span>
          </div>
        );
      }
    },
    {
      key: 'projectType',
      title: '项目类型',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{findProjectType(row.projectType)}</span>
          </div>
        );
      }
    },
    {
      key: 'deviceTotal',
      title: '设备总数(个)',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{row.deviceTotal}</span>
          </div>
        );
      }
    },
    {
      key: 'onlineDevices',
      title: '在线设备(个)',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{row.onlineDevices}</span>
          </div>
        );
      }
    },
    {
      key: 'offlineDevices',
      title: '离线设备(个)',
      align: 'center',
      render(row) {
        return (
          <div>
            <span>{row.offlineDevices}</span>
          </div>
        );
      }
    },
    {
      key: 'action',
      title: '操作',
      align: 'center',
      render(row) {
        if (auth.roleLevel === 0) {
          return (
            <div class="flex justify-end gap-6px">
              {/* <NPopconfirm onPositiveClick={() => handleDeleteTable(row.projectId)}>
                {{
                  default: () => '确认删除',
                  trigger: () => <NButton size={'small'}>删除</NButton>
                }}
              </NPopconfirm> */}
              <NButton size={'small'} onClick={() => handleEditTable(row.projectId)}>
                变更代理商
              </NButton>
              <NButton size={'small'} type="info" onClick={() => handleLookDetail(row)}>
                项目详情
              </NButton>
            </div>
          );
        }
        if (auth.roleLevel !== 1) {
          return (
            <div class="flex justify-center gap-6px">
              <NButton size={'small'} type="info" onClick={() => handleLookDetail(row)}>
                项目详情
              </NButton>
            </div>
          );
        }
        return (
          <div class="flex justify-end gap-6px">
            <NButton size={'small'} onClick={() => handleEditTable(row.projectId)}>
              编辑
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDeleteTable(row.projectId)}>
              {{
                default: () => '确认删除',
                trigger: () => <NButton size={'small'}>删除</NButton>
              }}
            </NPopconfirm>
            <NButton size={'small'} type="info" onClick={() => handleLookDetail(row)}>
              项目详情
            </NButton>
          </div>
        );
      }
    }
  ]
});

// const userCheckList = ref<string[]>([]);

// function onUserCheck(checkRow: DataTableRowKey[]) {
//   userCheckList.value = checkRow as string[];
// }

const { bool: visible, setTrue: openModal } = useBoolean();

// const { bool: detailVisible, setTrue: openDetailModal } = useBoolean();

const modalType = ref<ModalType>('add');

const detail = ref<{ id: string; name: string }>({
  id: '',
  name: ''
});

function setModalType(type: ModalType) {
  modalType.value = type;
}

function setDetail(project: ApiProject.Project) {
  detail.value = {
    id: project.projectId,
    name: project.projectName
  };
}

const editData = ref<ApiProject.Project | null>(null);

function setEditData(item: ApiProject.Project | null) {
  editData.value = item;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

function handleEditTable(id: string) {
  const findItem = data.value.find(item => item.projectId === id);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

const router = useRouterPush();
const route = useRouteStore();
const projectStore = useProjectStore();

function handleLookDetail(project: ApiProject.Project) {
  projectStore.curId = project.projectId;
  projectStore.cacheCurProjectId();
  setDetail(project);
  if (project.projectType === '01') {
    router.routerPush({ name: routeName('project-detail-statistics') });
  } else {
    router.routerPush({ name: routeName('project-detail-lock') });
  }
  route.handleOpenProjectDetail(true);
  // openDetailModal();
}

async function handleDeleteTable(id: string) {
  const res = await fetchDelProjectByPage({ projectId: id });
  if (!res.error) {
    window.$message?.success('删除成功!');
    getData();
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
  searchAddress.value = '';
  searchName.value = '';
  searchType.value = '';
  searchMethod();
}

watch(
  visible,
  newValue => {
    if (!newValue) {
      if (modalType.value === 'add' && data.value.length === 0) {
        updatePagination({
          page: (pagination.page as number) - 1,
          pageSize: pagination.pageSize
        });
        getData();
      } else {
        getData();
      }
    }
  },
  { immediate: false }
);

onMounted(() => {
  getData();
});
</script>

<style scoped></style>
