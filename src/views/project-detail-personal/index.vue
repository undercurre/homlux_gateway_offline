<template>
  <div class="w-full h-full">
    <n-card class="w-full h-full">
      <n-tabs
        class="card-tabs w-full h-full flex"
        default-value="pm"
        animated
        pane-wrapper-style="margin: 0 -4px; flex: 1;height: 100%;"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box; height: 100%;"
      >
        <n-tab-pane name="pm" tab="项目管理员" display-directive="if">
          <project-manager-list class="w-full h-full" />
        </n-tab-pane>
        <n-tab-pane name="ph" tab="住户" display-directive="if">
          <project-horse-hold-list class="w-full h-full" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import ProjectManagerList from './component/project-manager-list.vue';
import ProjectHorseHoldList from './component/project-horse-hold-list.vue';
</script>

<style scoped></style>
