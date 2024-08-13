<template>
  <div class="h-full pt-18px pl-32px pr-24px pb-24px rounded-20px box-border text-white bg-#f4f4f4 cus-bg">
    <div class="flex justify-between items-center">
      <h3 class="text-16px opacity-99 text-#999 font-400 title">{{ data.title }}</h3>
      <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 1024 1024">
        <path
          fill="#999"
          d="M338.752 104.704a64 64 0 0 0 0 90.496l316.8 316.8l-316.8 316.8a64 64 0 0 0 90.496 90.496l362.048-362.048a64 64 0 0 0 0-90.496L429.248 104.704a64 64 0 0 0-90.496 0"
        />
      </svg>
    </div>
    <div class="flex mt-10px">
      <count-to
        :prefix="data.unit"
        :start-value="0"
        :end-value="data.value"
        class="text-40px text-#333 dark:text-dark font-500 leading-40px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  icon: string;
}
// import { computed } from 'vue';

interface Props {
  data: CardData;
}

withDefaults(defineProps<Props>(), {
  data: (): CardData => ({
    id: '123',
    title: '标题',
    value: 0, // 确保默认值是一个number
    unit: '单位',
    icon: 'arcticons:projectm'
  })
});

// const gradientStyle = computed(() =>
//   props.bgImage ? (props.bgImage as string) : `linear-gradient(to bottom right, ${props.startColor}, ${props.endColor})`
// );
</script>

<style scoped>
.cus-bg {
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.06);
  border-radius: 20px;
}

.cus-bg:hover {
  background-image: linear-gradient(160deg, #1bca40 19%, #b9ea8c 100%);
}

.cus-bg:hover h3 {
  color: #fff;
  opacity: 0.8;
}

.cus-bg:hover svg path {
  fill: #fff;
}
.cus-bg:hover span {
  color: #fff;
}
</style>
