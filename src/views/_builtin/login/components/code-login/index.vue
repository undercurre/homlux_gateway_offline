<template>
  <div class="w-full h-full flex-col justify-around">
    <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
      <n-form-item path="phone">
        <n-input v-model:value="model.phone" :placeholder="$t('page.login.common.phonePlaceholder')" clearable>
          <template #prefix>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.6rem" height="1.6rem" viewBox="0 0 20 20">
              <g fill="#A2A2A2">
                <path d="M8 16.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75" />
                <path
                  fill-rule="evenodd"
                  d="M4 4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zm4-1.5v.75c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75V2.5h1A1.5 1.5 0 0 1 14.5 4v12a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V4A1.5 1.5 0 0 1 7 2.5z"
                  clip-rule="evenodd"
                />
              </g>
            </svg>
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="code">
        <div class="flex-y-center w-full">
          <n-input
            v-model:value="model.code"
            :placeholder="$t('page.login.common.codePlaceholder')"
            clearable
            :input-props="{ autocomplete: 'off' }"
          />
          <div class="w-18px"></div>
          <n-button class="h-72px" size="large" :disabled="isCounting" :loading="smsLoading" @click="handleSmsCode">
            {{ label }}
          </n-button>
        </div>
      </n-form-item>
      <n-form-item path="imgCode">
        <n-input
          v-model:value="model.imgCode"
          :placeholder="$t('page.login.codeLogin.imageCodePlaceholder')"
          clearable
          :input-props="{ autocomplete: 'off' }"
        />
        <div class="pl-8px">
          <image-verify v-model:code="imgCode" />
        </div>
      </n-form-item>
      <n-space :vertical="true" :size="18">
        <!-- <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">
        {{ $t('page.login.pwdLogin.title') }}
      </n-button> -->
      </n-space>
      <n-button
        class="mb-80px h-64px rounded-12px text-20px custom-bg"
        type="primary"
        size="large"
        :block="true"
        :bordered="false"
        :disabled="!(model.phone && model.code && model.imgCode)"
        :loading="auth.loginLoading"
        @click="handleSubmit"
      >
        登录
      </n-button>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { useAuthStore } from '@/store';
// import { useRouterPush } from '@/composables';
import { useSmsCode } from '@/hooks';
import { formRules, getImgCodeRule } from '@/utils';

const auth = useAuthStore();
// const { toLoginModule } = useRouterPush();
const { label, isCounting, loading: smsLoading, getSmsCode } = useSmsCode();

const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  phone: '',
  code: '',
  imgCode: ''
});

const imgCode = ref('');

const rules = {
  phone: formRules.phone,
  code: formRules.code,
  imgCode: getImgCodeRule(imgCode)
};

async function handleSmsCode() {
  await getSmsCode(model.phone);
}

async function handleSubmit() {
  await formRef.value?.validate();

  // const { phone, code } = model;

  // await auth.login({ mobilePhone: phone, captcha: code });
}
</script>

<style scoped>
.custom-bg {
  background-image: linear-gradient(-90deg, #7cd06a 0%, #20b86c 96%);
}

/deep/.n-input {
  border-radius: 12.85px;
  border: none;
}

/deep/.n-input-wrapper {
  padding: 16px 24px;
  height: 72px;
  box-sizing: border-box;
}

/deep/.n-input__prefix {
  width: 40px;
  height: 40px;
}

/deep/.n-input__border {
  border: none;
}

/deep/.n-input__state-border {
  border: none;
}
</style>
