<template>
  <div v-if="!auth.showForgetPassword" class="w-full h-full flex-col justify-around">
    <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
      <n-form-item path="userName">
        <n-input v-model:value="model.userName" placeholder="请输入用户名" clearable>
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
      <n-form-item path="password">
        <n-input
          v-model:value="model.password"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.login.common.passwordPlaceholder')"
          clearable
        >
          <template #prefix>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.6rem" height="1.6rem" viewBox="0 0 32 32">
              <g fill="none" stroke="#A2A2A2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M5 15v15h22V15Zm4 0C9 9 9 5 16 5s7 4 7 10m-7 5v3" />
                <circle cx="16" cy="24" r="1" />
              </g>
            </svg>
          </template>
        </n-input>
      </n-form-item>
      <n-space :vertical="true" :size="24">
        <div class="flex-y-center justify-end">
          <!-- <n-checkbox v-model:checked="rememberMe">{{ $t('page.login.pwdLogin.rememberMe') }}</n-checkbox> -->
          <n-button class="text-18px text-#21B96C font-400" :text="true" @click="toForgetPassword">
            {{ $t('page.login.pwdLogin.forgetPassword') }}
          </n-button>
        </div>
        <!-- <div class="flex-y-center justify-between">
          <n-button class="flex-1" :block="true" :round="true" @click="toLoginModule('code-login')">
            {{ loginModuleLabels['code-login'] }}
          </n-button>

          <div class="w-12px"></div>
          <n-button class="flex-1" :block="true" @click="toLoginModule('register')">
            {{ loginModuleLabels.register }}
          </n-button>
        </div> -->
      </n-space>
    </n-form>
    <n-button
      class="mb-80px h-64px rounded-12px text-20px custom-bg"
      type="primary"
      size="large"
      :block="true"
      :bordered="false"
      :disabled="!(model.userName && model.password)"
      :loading="auth.loginLoading"
      @click="handleSubmit"
    >
      登录
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { useAuthStore } from '@/store';
const auth = useAuthStore();

const toForgetPassword = () => {
  auth.showForgetPassword = true;
};

const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  userName: '',
  password: ''
});

const rules: FormRules = {
  // userName: formRules.userName,
  // password: formRules.pwd
};

async function handleSubmit() {
  await formRef.value?.validate();

  const { userName, password } = model;

  // const codeRes = await fetchVerifyCode();

  // if (codeRes.error) {
  //   window.$message?.error('校验码获取失败！');

  //   return;
  // }

  await auth.login({
    username: userName,
    password
  });
}

// function handleLoginOtherAccount(param: { userName: string; password: string }) {
//   const { userName, password } = param;
//   login(userName, password);
// }
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
