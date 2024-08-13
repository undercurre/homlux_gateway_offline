<template>
  <n-drawer v-model:show="modalVisible" :width="400" placement="right" :mask-closable="false">
    <n-drawer-content title="变更注册手机" closable>
      <n-form ref="formRef" label-placement="top" :label-width="80" :model="formModel" :rules="rules">
        <n-grid :cols="24">
          <n-form-item-grid-item :span="24" label="代理商名称">
            <n-input :value="editData?.merchantName" disabled maxlength="20" />
          </n-form-item-grid-item>

          <n-form-item-grid-item :span="24" label="原注册手机" maxlength="11">
            <n-input :value="editData?.mobilePhone" clearable disabled />
          </n-form-item-grid-item>

          <n-form-item-grid-item :span="24" label="新注册手机" path="mobilePhone" maxlength="11" show-count>
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
import { updateMerchantMobile } from '~/src/service';

defineOptions({ name: 'ChangeMobile' });

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

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'update'): void;
}>();

const formRef = ref<HTMLElement & FormInst>();

type FormModel = {
  mobilePhone: string;
};

const formModel = ref<FormModel>({ mobilePhone: '' });

type FormRuleRequiredKey = keyof FormModel;

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

const closeModal = () => {
  modalVisible.value = false;
};

const isSubmit = ref(false);
async function handleSubmit() {
  await formRef.value?.validate();

  isSubmit.value = true;
  const res = await updateMerchantMobile({
    merchantCode: props.editData?.merchantCode || '',
    oldMobilePhone: props.editData?.mobilePhone || '',
    newMobilePhone: formModel.value.mobilePhone
  });

  if (!res.error) {
    window.$message?.success('编辑成功!');
    emit('update');
    closeModal();
  }

  isSubmit.value = false;
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      formModel.value.mobilePhone = '';
    }
  }
);
</script>

<style scoped></style>
