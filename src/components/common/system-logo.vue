<template>
  <div>
    <img v-if="setup.config.mode === 'light'" class="w-64px h-64px" src="@/assets/images/common/logo.png" />
    <img v-if="setup.config.mode === 'lock'" class="w-64px h-64px" src="@/assets/images/common/lockLogo.png" />
  </div>
</template>

<script lang="ts" setup>
import { useSetupStore } from '@/store';

defineOptions({ name: 'SystemLogo' });

interface Props {
  /** logo是否填充 */
  fill?: boolean;
}

withDefaults(defineProps<Props>(), {
  fill: false
});

const setup = useSetupStore();
</script>

<style scoped></style>
