<template>
  <div class="h-100px w-full p-4px">
    <div class="wh-full card flex-center flex-col" :style="{ 'background-color': cardColor }" @click="onCardClick">
      <n-ellipsis class="font-500" style="max-width: 100%; font-size: 18px">
        {{ props.roomName || '' }}
      </n-ellipsis>
      <div class="w-full h-34px flex-center">
        <n-icon v-if="haveDevice" :size="26" :component="iconDevice"></n-icon>
      </div>
      <n-ellipsis class="font-400" style="max-width: 100%; font-size: 14px">
        {{ props.liveNum || 0 }}/{{ props.liveMax || 0 }}人
      </n-ellipsis>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue';
import { useIconRender } from '@/composables';

const { iconRender } = useIconRender();
const iconDevice = defineComponent({
  setup() {
    return iconRender({ icon: 'icon-park-solid:electronic-door-lock' });
  }
});

interface Props {
  id: string;
  roomName: string; // 房号
  liveMax: number; // 最大入住人数
  liveNum: number; // 当前入住人数
  haveDevice: boolean; // 是否有设备
  isLocked: boolean; // 是否锁定
  timeLimitType: number; // 0-未到期，1-即将到期，2-已延期
}

const props = withDefaults(defineProps<Props>(), {
  id: ''
});

const cardColor = computed(() => {
  if (props.isLocked) return 'rgba(255,8,8,0.66)';

  if (props.timeLimitType === 2) return 'rgba(248,108,49,0.66)';
  else if (props.timeLimitType === 1) return 'rgba(255,194,65,0.66)';

  if (props.liveNum > 0) return 'rgba(41,109,255,0.66)';
  return 'rgba(248,248,248,0.66)';
});

const emits = defineEmits(['cardClick']);

function onCardClick() {
  emits('cardClick', { id: props.id });
}
</script>

<style scoped>
.card {
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
</style>
