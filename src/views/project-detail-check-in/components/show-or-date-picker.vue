<template>
  <div class="min-h-22px" @dblclick="handleOnClick">
    <n-date-picker
      v-if="isEdit"
      ref="pickerRef"
      v-model:value="timestamp"
      type="datetime"
      clearable
      @update-value="handleChange"
      @confirm="handleChange"
      @blur="handleBlur"
    />
    <n-ellipsis v-if="!isEdit">{{ dateStr }}</n-ellipsis>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { DatePickerInst } from 'naive-ui';
import dayjs from 'dayjs';

interface Props {
  timestamp: number;
  disable: boolean;
  onUpdateValue: (val: number) => void;
}

const props = withDefaults(defineProps<Props>(), {
  timestamp: new Date().valueOf,
  disable: false
});

const isEdit = ref(false);
const timestamp = ref<number | null>(props.timestamp);
const pickerRef = ref<DatePickerInst | null>(null);

const dateStr = computed(() => {
  if (timestamp.value === null) return '请选择日期时间';
  return dayjs(timestamp.value).format('YYYY-MM-DD HH:mm:ss');
});
function handleOnClick() {
  if (props.disable) return;
  isEdit.value = true;
  nextTick(() => {
    if (pickerRef.value) pickerRef.value.focus();
  });
}

function handleChange() {
  isEdit.value = false;
}

function handleBlur() {
  if (timestamp.value !== null) props.onUpdateValue(timestamp.value);
  isEdit.value = false;
}
</script>
