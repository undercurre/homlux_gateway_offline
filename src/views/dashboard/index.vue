<template>
  <div class="w-full h-full flex justify-center items-center bg-#fff">
    <n-steps vertical :current="current as number" :status="currentStatus">
      <n-step title="边缘网关——配网入口" description="边缘网关配网入口：“美的商照小程序”-添加设备-智能网关-边缘网关">
        <template #title>
          <p class="text-#000">边缘网关——配网入口</p>
        </template>
        <p class="text-#000 opacity-70">边缘网关配网入口：“美的商照小程序”-添加设备-智能网关-边缘网关</p>
      </n-step>
      <n-step title="边缘网关——扫码配网">
        <template #title>
          <p class="text-#000">边缘网关——扫码配网</p>
        </template>
        <p class="text-#000 opacity-70">使用“美的商照小程序扫一扫以下二维码进行配网”</p>
        <div class="w-full flex justify-center">
          <img v-if="imgUrl" class="w-300px h-300px" :src="imgUrl" />
        </div>
      </n-step>
      <n-step title="完成配网" description="边缘网关完成项目配网后，会自动生成本地账号">
        <template #title>
          <p class="text-#000">完成配网</p>
        </template>
        <p class="text-#000 opacity-70">边缘网关完成项目配网后，会自动生成本地账号</p>
      </n-step>
    </n-steps>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import type { StepsProps } from 'naive-ui';
import { fetchQrcode } from '@/service/api/gateway';

const current = ref<number | null>(0);

const currentStatus = ref<StepsProps['status']>('process');

const imgUrl = ref('');

let timer: NodeJS.Timeout;

onMounted(async () => {
  const codeRes = await fetchQrcode();
  if (!codeRes.error) {
    imgUrl.value = codeRes.data.qrcode;
  }
  timer = setInterval(async () => {
    const codeResT = await fetchQrcode();
    if (!codeResT.error) {
      imgUrl.value = codeResT.data.qrcode;
    }
  }, 60000);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>

<style scoped>
::v-deep .n-steps .n-step-indicator ::before {
  border-color: green;
}
</style>
