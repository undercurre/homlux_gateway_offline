<template>
  <n-space :vertical="true">
    <n-divider class="!mb-0 text-14px text-#666">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</n-divider>
    <n-space justify="center">
      <n-button
        v-for="item in accounts"
        :key="item.userName"
        type="primary"
        @click="login(item.userName, item.password)"
      >
        {{ item.label }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
import { $t } from '@/locales';

interface Emits {
  (e: 'login', param: { userName: string; password: string }): void;
}

const emit = defineEmits<Emits>();

interface Account {
  key: ApiAuth.UserRole['roleLevel'];
  label: string;
  userName: string;
  password: string;
}

const accounts: Account[] = [];

function login(userName: string, password: string) {
  emit('login', { userName, password });
}
</script>

<style scoped></style>
