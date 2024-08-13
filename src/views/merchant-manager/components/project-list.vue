<template>
  <n-drawer v-model:show="modalVisible" width="50%" placement="right">
    <n-drawer-content title="代理商项目" closable>
      <div class="h-full flex-col">
        <n-space class="mb-10px" justify="space-between">
          <n-space class="flex items-center">
            <span>
              代理商名称：
              <n-tag type="success">
                {{ editData?.merchantName }}
              </n-tag>
            </span>
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
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="tsx">
import { computed, watch } from 'vue';
import { NSpace } from 'naive-ui';
import { queryProjectListByPage } from '@/service';
import { useHookTable } from '@/hooks';

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(
  defineProps<{
    /** 弹窗可见性 */
    visible: boolean;
    /** 编辑的表格行数据 */
    editData?: ApiMerchant.MerchantItem | null;
  }>(),
  {
    editData: null
  }
);

const typeOptions = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '工业园区(含厂房办公室)',
    value: '01'
  },
  {
    label: '教育',
    value: '02'
  },
  {
    label: '医疗',
    value: '03'
  },
  {
    label: '办公写字楼',
    value: '04'
  },
  {
    label: '商铺',
    value: '05'
  },
  {
    label: '机场轨道交通',
    value: '06'
  },
  {
    label: '酒店公寓',
    value: '07'
  }
];

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'update'): void;
}>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const { data, loading, columns, pagination, getData, updatePagination } = useHookTable(queryProjectListByPage, {
  immediate: false,
  apiParams: {
    orderBy: 'createdTime',
    xsc: 'DESC',
    merchantCode: props.editData?.merchantCode
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
      merchantCode: props.editData?.merchantCode
    };
  },
  columns: () => [
    {
      key: 'projectName',
      title: '项目名称',
      align: 'center'
    },
    {
      key: 'projectArea',
      title: '项目区域',
      align: 'center'
    },
    {
      key: 'projectType',
      title: '项目类型',
      align: 'center',
      render: row => {
        const projectTypeItem = typeOptions.find(item => item.value === row.projectType);

        return projectTypeItem?.label;
      }
    }
  ]
});

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      data.value = [];
      updatePagination({
        page: 1
      });
      getData();
    }
  }
);
</script>

<style scoped></style>
