<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="phone">
      <n-input v-model:value="model.phone" :placeholder="$t('page.login.common.phonePlaceholder')" clearable />
    </n-form-item>
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
      <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { findPassword } from '@/service';
import { useRouterPush } from '@/composables';
import { useSmsCode } from '@/hooks';
import { formRules, getConfirmPwdRule } from '@/utils';
import { $t } from '@/locales';

const { toLoginModule } = useRouterPush();
const { label, isCounting, loading: smsLoading, start, getSmsCode } = useSmsCode();

const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  phone: '',
  code: '',
  pwd: '',
  confirmPwd: ''
});

const rules: FormRules = {
  phone: formRules.phone,
  code: formRules.code,
  pwd: formRules.pwd,
  confirmPwd: getConfirmPwdRule(toRefs(model).pwd)
};

async function handleSmsCode() {
  await getSmsCode(model.phone);

  start();
}

async function handleSubmit() {
  await formRef.value?.validate();

  const { phone, pwd, code } = model;

  const res = await findPassword({
    mobilePhone: phone,
    password: pwd,
    captcha: code
  });

  if (!res.error) {
    window.$message?.success($t('page.login.common.validateSuccess'));
    toLoginModule('pwd-login');
  }
}
</script>

<style scoped></style>
