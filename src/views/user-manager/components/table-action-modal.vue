<template>
  <n-drawer v-model:show="modalVisible" :width="400" placement="right" :mask-closable="false">
    <n-drawer-content :title="title" closable>
      <n-form ref="formRef" label-placement="top" :label-width="80" :model="formModel" :rules="rules">
        <n-grid :cols="24">
          <n-form-item-grid-item :span="24" label="手机号" path="mobilePhone" maxlength="11" show-count>
            <n-input v-model:value="formModel.mobilePhone" clearable />
          </n-form-item-grid-item>
        </n-grid>
      </n-form>

      <template #footer>
        <n-space class="w-full pt-16px" :size="24" justify="end">
          <n-button class="w-72px" @click="closeModal">取消</n-button>
          <n-button class="w-72px" type="primary" :loading="isSubmit" @click="handleSubmit">确定</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import { formRules } from '@/utils';
import { fetchAddUser } from '~/src/service';

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(
  defineProps<{
    /** 弹窗可见性 */
    visible: boolean;
  }>(),
  {}
);

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'update'): void;
}>();

const formRef = ref<HTMLElement & FormInst>();

type FormModel = ApiUser.CreateUserParams;

const formModel = ref<FormModel>(createDefaultFormModel());

type FormRuleRequiredKey = 'mobilePhone';

// 表单校验规则
const rules: Record<FormRuleRequiredKey, FormItemRule | FormItemRule[]> = {
  mobilePhone: formRules.phone
};

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const title = computed(() => {
  return '添加用户';
});

const closeModal = () => {
  modalVisible.value = false;
};

function createDefaultFormModel(): FormModel {
  return {
    mobilePhone: ''
  };
}

function handleUpdateFormModel(model: FormModel) {
  Object.assign(formModel.value, model);
}

async function handleUpdateFormModelByModalType() {
  // 先清空历史数据，否则数据会闪烁显示之前的账号数据
  const defaultFormModel = createDefaultFormModel();
  handleUpdateFormModel(defaultFormModel);
}

const isSubmit = ref(false);
async function handleSubmit() {
  await formRef.value?.validate();

  isSubmit.value = true;
  const res = await fetchAddUser(formModel.value);

  if (!res.error) {
    window.$message?.success('新增成功!');
    emit('update');
    closeModal();
  }

  isSubmit.value = false;
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<style scoped></style>
