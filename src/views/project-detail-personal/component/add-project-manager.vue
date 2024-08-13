<template>
  <n-modal v-model:show="modalVisible">
    <n-card style="width: 900px" title="添加管理员" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <n-form ref="formRef" :model="formValue" :rules="rules">
        <n-grid :cols="24" :x-gap="24">
          <n-form-item-gi :span="12" label="手机号码" path="phone">
            <n-input v-model:value="formValue.phone" placeholder="输入手机号码" />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="项目权限(可选)" path="auth">
            <n-transfer v-model:value="formValue.authValue" style="width: 100%" :options="authOptions" />
          </n-form-item-gi>
          <n-gi :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-space class="inline" align="center" :size="18">
                <n-button round type="primary" @click="closeModal">取消</n-button>
                <n-button round type="primary" :loading="submitLoading" @click="handleConfirmClick">添加</n-button>
              </n-space>
            </div>
          </n-gi>
        </n-grid>
      </n-form>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { type FormInst, type FormItemRule } from 'naive-ui';
import { fetchBatchAddProjectMember } from '@/service';
import { useProjectStore } from '~/src/store';
const formRef = ref<FormInst | null>(null);

interface Label {
  label: string | number;
  value: string | number;
}
const authOptions = ref<Label[]>();

const formValue = ref({
  phone: '',
  authValue: null
});

const rules = {
  phone: {
    required: true,
    message: '请输入手机号码',
    trigger: ['input'],
    validator: (_rule: FormItemRule, value: string) => {
      return /^1[3456789]\d{9}$/.test(value);
    }
  },
  auth: {
    type: 'array',
    required: false,
    trigger: 'change',
    message: '请输入 选择权限'
  }
};
interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /** 刷新列表函数 */
  refreshListDataFuc: () => void;
}

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

const projectStore = useProjectStore();

const curProjectInfo = projectStore.projects.find(item => item.projectId === projectStore.curId);

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<Emits>();

const submitLoading = ref(false);

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const closeModal = () => {
  modalVisible.value = false;
};

async function handleConfirmClick(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(error => {
    if (!error) {
      console.log(formValue.value.phone);
      console.log(formValue.value.authValue?.[0]);
      submit(formValue.value.phone, formValue.value.authValue);
    }
  });
}

async function submit(phone: string, selectSpaceList: string[] | null) {
  try {
    submitLoading.value = true;

    let projectChildList: ApiProject.Space[] | null = null;

    const result = selectSpaceList?.map(
      v1 =>
        projectStore.projectsWithAuth
          .findLast(v => v.projectId === projectStore.curId)!
          .projectChildList.findLast(v => v.spaceId === v1)!
    );

    if (result) {
      projectChildList = result!;
    }

    const res = await fetchBatchAddProjectMember({
      projectId: projectStore.curId,
      projectUserList: [
        {
          mobilePhone: phone,
          roleLevel: 6
        }
      ],
      projectSpace: {
        merchantCode: curProjectInfo?.merchantCode ?? '',
        projectName: curProjectInfo?.projectName ?? '',
        projectId: projectStore.curId,
        projectChildList: projectChildList !== null ? projectChildList : []
      }
    });

    if (!res.error) {
      window.$message?.success('新增成功!!!!!');
      closeModal();
      props.refreshListDataFuc();
    }
  } finally {
    submitLoading.value = false;
  }
}

watch(
  () => props.visible,
  async (newValue: boolean) => {
    if (newValue) {
      authOptions.value = projectStore.projectsWithAuth
        .findLast(v => v.projectId === projectStore.curId)
        ?.projectChildList.filter(v1 => v1.spaceLevel === 2)
        .map(v1 => ({ label: v1.spaceName, value: v1.spaceId }));
      console.log(authOptions.value);
    }
  }
);
</script>

<style scoped></style>
