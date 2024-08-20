<template>
  <div class="relative flex-center wh-full">
    <n-card
      :title="$t('routes.setting.reset-pwd')"
      :bordered="true"
      size="large"
      class="z-4 !w-auto rounded-20px shadow-sm"
    >
      <div class="w-300px sm:w-360px">
        <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
          <n-form-item path="oldPwd">
            <n-input
              v-model:value="model.oldPwd"
              type="password"
              show-password-on="click"
              :input-props="{ autocomplete: 'off' }"
              placeholder="请输入旧密码"
              clearable
            />
          </n-form-item>
          <n-form-item path="pwd">
            <n-input
              v-model:value="model.pwd"
              type="password"
              show-password-on="click"
              :input-props="{ autocomplete: 'off' }"
              placeholder="请输入新密码"
              clearable
            />
          </n-form-item>
          <n-form-item path="confirmPwd">
            <n-input
              v-model:value="model.confirmPwd"
              type="password"
              show-password-on="click"
              placeholder="请再次输入新密码"
              clearable
            />
          </n-form-item>
          <n-space :vertical="true" size="large">
            <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit">
              {{ $t('page.login.common.confirm') }}
            </n-button>
          </n-space>
        </n-form>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { resetPWd } from '@/service';
import { useAuthStore } from '@/store';
import { getConfirmPwdRule } from '@/utils';
import { $t } from '@/locales';

const formRef = ref<HTMLElement & FormInst>();
const auth = useAuthStore();

const model = reactive({
  oldPwd: '',
  pwd: '',
  confirmPwd: ''
});

const rules: FormRules = {
  confirmPwd: getConfirmPwdRule(toRefs(model).pwd)
};

async function handleSubmit() {
  await formRef.value?.validate();
  const { pwd, oldPwd } = model;

  const res = await resetPWd(oldPwd, pwd);

  if (!res.error) {
    window.$message?.success($t('common.editSuccess'));
    auth.resetAuthStore();
  } else {
    window.$message?.error('修改失败: 旧密码错误');
  }
}
</script>

<style scoped></style>
