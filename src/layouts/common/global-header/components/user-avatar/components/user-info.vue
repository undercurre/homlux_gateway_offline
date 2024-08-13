<template>
  <n-drawer v-model:show="modalVisible" :width="400" placement="right" :mask-closable="false">
    <n-drawer-content title="个人信息" closable>
      <n-form ref="formRef" label-placement="top" :label-width="80" :model="formModel" :rules="rules">
        <n-grid :cols="24">
          <n-form-item-grid-item :span="24" label="手机号">
            <n-input v-model:value="auth.userInfo.mobilePhone" disabled />
          </n-form-item-grid-item>

          <n-form-item-grid-item :span="24" label="用户名称" path="userName" show-count>
            <n-input v-model:value="formModel.userName" clearable maxlength="10" show-count />
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
import { useAuthStore } from '@/store';
import { formRules } from '@/utils';
import { updateUserInfo } from '~/src/service';

defineOptions({ name: 'UserInfo' });

const auth = useAuthStore();

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

const formModel = ref({
  userName: ''
});

type FormRuleRequiredKey = 'userName';

// 表单校验规则
const rules: Record<FormRuleRequiredKey, FormItemRule | FormItemRule[]> = {
  userName: formRules.userName
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
  const res = await updateUserInfo(formModel.value);

  if (!res.error) {
    auth.updateUserInfo(formModel.value);
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
      formModel.value.userName = auth.userInfo.userName;
    }
  }
);
</script>

<style scoped></style>
