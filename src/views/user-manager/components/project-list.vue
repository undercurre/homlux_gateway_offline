<template>
  <n-drawer v-model:show="modalVisible" width="50%" placement="right">
    <n-drawer-content title="用户权限" closable>
      <div class="h-full flex-col">
        <n-space class="mb-10px" justify="space-between" align="center">
          <n-space vertical>
            <n-space align="center">
              用户名称：
              <n-tag type="success">
                {{ editData?.userName }}
              </n-tag>
            </n-space>

            <n-space align="center">
              手机号：
              <n-tag type="success">
                {{ editData?.mobilePhone }}
              </n-tag>
            </n-space>
          </n-space>

          <n-space vertical>
            <n-space align="center">
              授权项目：
              <n-tag type="success">
                {{ userAuthList.length }}
              </n-tag>
            </n-space>

            <n-space v-if="isSuperAdmin" align="center">
              <span>代理商：</span>
              <n-select v-model:value="merchantCode" class="w-200px" :options="merchantOptions" />
            </n-space>
          </n-space>
        </n-space>

        <n-data-table
          remote
          class="flex-1-hidden"
          :columns="columns"
          :data="userAuthList"
          flex-height
          :loading="loading"
          :row-key="(item: ApiUser.UserAuthItem) => item.projectId"
        />
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="tsx">
import { computed, watch, ref } from 'vue';
import { NSpace } from 'naive-ui';
import type { SelectOption, DataTableColumn } from 'naive-ui';
import { queryUserAuthList } from '@/service';
import { useAuthStore } from '@/store';

defineOptions({ name: 'ProjectList' });

const auth = useAuthStore();

const { isSuperAdmin } = auth;

const props = withDefaults(
  defineProps<{
    /** 弹窗可见性 */
    visible: boolean;
    /** 编辑的表格行数据 */
    editData?: ApiUser.SysUser | null;
  }>(),
  {
    editData: null
  }
);

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
}>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const merchantOptions = ref<SelectOption[]>([]);
// 搜索参数
const merchantCode = ref('');

const data = ref<ApiUser.UserAuthItem[]>([]);

const userAuthList = computed(() => {
  return data.value.filter(item => merchantCode.value === '' || item.merchantCode === merchantCode.value);
});

const loading = ref(false);
const columns: DataTableColumn[] = [
  {
    key: 'projectName',
    title: '项目名称',
    align: 'center'
  },
  {
    key: 'roleName',
    title: '授权角色',
    align: 'center'
  }
];

async function getData() {
  loading.value = true;
  const res = await queryUserAuthList({
    userId: props.editData?.userId || '',
    merchantCode: merchantCode.value
  });

  if (!res.error) {
    data.value = res.data.userAuthList;
    merchantOptions.value = [
      {
        label: '全部',
        value: ''
      }
    ].concat(
      res.data.merchantList.map(item => ({
        label: item.merchantName,
        value: item.merchantCode
      }))
    );
  }
  loading.value = false;
}

watch(
  () => props.visible,
  async newValue => {
    if (newValue) {
      getData();
    } else {
      // 关闭弹窗，清除历史数据
      merchantCode.value = '';
      merchantOptions.value = [];
      data.value = [];
    }
  }
);
</script>

<style scoped></style>
