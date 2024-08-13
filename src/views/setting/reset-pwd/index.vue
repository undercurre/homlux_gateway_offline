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
          <n-form-item path="code">
            <div class="flex-y-center w-full">
              <n-input
                v-model:value="model.code"
                :placeholder="$t('page.login.common.codePlaceholder')"
                clearable
                :input-props="{ autocomplete: 'one-time-code' }"
              />
              <div class="w-18px"></div>
              <n-button size="large" :disabled="isCounting" :loading="smsLoading" @click="handleSmsCode">
                {{ label }}
              </n-button>
            </div>
          </n-form-item>
          <n-form-item path="pwd">
            <n-input
              v-model:value="model.pwd"
              type="password"
              show-password-on="click"
              :input-props="{ autocomplete: 'off' }"
              :placeholder="$t('page.login.common.passwordPlaceholder')"
              clearable
            />
          </n-form-item>
          <n-form-item path="confirmPwd">
            <n-input
              v-model:value="model.confirmPwd"
              type="password"
              show-password-on="click"
              :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
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
import { findPassword } from '@/service';
import { useAuthStore } from '@/store';
import { useSmsCode } from '@/hooks';
import { formRules, getConfirmPwdRule } from '@/utils';
import { $t } from '@/locales';

const { label, isCounting, loading: smsLoading, start, getSmsCode } = useSmsCode();

const formRef = ref<HTMLElement & FormInst>();
const auth = useAuthStore();
const mobile = auth.userInfo.mobilePhone;

const model = reactive({
  code: '',
  pwd: '',
  confirmPwd: ''
});

const rules: FormRules = {
  code: formRules.code,
  pwd: formRules.pwd,
  confirmPwd: getConfirmPwdRule(toRefs(model).pwd)
};

async function handleSmsCode() {
  await getSmsCode(mobile);

  start();
}

async function handleSubmit() {
  await formRef.value?.validate();

  const { pwd, code } = model;

  const res = await findPassword({
    mobilePhone: mobile,
    password: pwd,
    captcha: code
  });

  if (!res.error) {
    window.$message?.success($t('common.editSuccess'));
    auth.resetAuthStore();
  }
}
</script>

<style scoped></style>
