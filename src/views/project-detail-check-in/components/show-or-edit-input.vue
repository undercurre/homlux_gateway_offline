<template>
  <div class="min-h-22px" @dblclick="handleOnClick">
    <n-input
      v-if="isEdit"
      ref="inputRef"
      v-model:value="inputValue"
      :allow-input="allowTest"
      :maxlength="props.maxLength"
      type="text"
      clearable
      :placeholder="props.placeholder"
      @change="handleChange"
      @blur="handleBlur"
    ></n-input>
    <n-ellipsis v-if="!isEdit">{{ props.value }}</n-ellipsis>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { InputInst } from 'naive-ui';

interface Props {
  value: string;
  placeholder: string;
  maxLength: number;
  inputType: number; // 0-中文英文数字，1-数字
  disable: boolean;
  onUpdateValue: (val: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  placeholder: '',
  maxLength: undefined,
  inputType: 0,
  disable: false
});

const isEdit = ref(false);
const inputValue = ref(props.value);
const inputRef = ref<InputInst | null>(null);
function handleOnClick() {
  if (props.disable) return;
  isEdit.value = true;
  nextTick(() => {
    if (inputRef.value) inputRef.value.focus();
  });
}
function handleChange() {
  isEdit.value = false;
}

function handleBlur() {
  props.onUpdateValue(inputValue.value);
  isEdit.value = false;
}
function allowTest(value: string) {
  if (value) {
    if (props.inputType === 1) return /^\d+$/.test(value);
    else if (props.inputType === 0) return /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value);
  }
  return true;
}
</script>
