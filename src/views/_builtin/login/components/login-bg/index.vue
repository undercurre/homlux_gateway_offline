<template>
  <div class="absolute-lt z-1 wh-full overflow-hidden">
    <!-- <div class="absolute -right-300px -top-900px <sm:(-right-100px -top-1170px)">
      <corner-top :start-color="lightColor" :end-color="darkColor" />
    </div> -->
    <!-- <div class="absolute -left-200px -bottom-400px <sm:(-left-100px -bottom-760px)">
      <corner-bottom :start-color="darkColor" :end-color="lightColor" />
    </div> -->

    <img v-if="!dark" class="w-full h-full" src="@/assets/images/login/bg.jpg" />
    <img v-if="dark" class="night-effect w-full h-full" src="@/assets/images/login/bg.jpg" />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  /** 主题颜色 */
  dark: boolean;
}

defineProps<Props>();
</script>

<style scoped>
.night-effect {
  filter: brightness(70%) contrast(120%) saturate(50%) grayscale(20%);
}
</style>
