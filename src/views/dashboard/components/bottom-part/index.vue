<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card title="日志" :bordered="false" class="h-full rounded-8px shadow-sm">
        <n-timeline>
          <n-timeline-item v-for="item in timelines" :key="item.type" v-bind="item" />
        </n-timeline>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:16">
      <n-card title="特别提醒" :bordered="false" class="h-full rounded-8px shadow-sm">
        <n-data-table size="small" :columns="columns" :data="tableData" />
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { NTag } from 'naive-ui';

defineOptions({ name: 'DashboardAnalysisBottomPart' });

interface TimelineData {
  type: 'default' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  content: string;
  time: string;
}

interface TableData {
  key: number;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const timelines: TimelineData[] = [
  { type: 'default', title: 'zigbee网络心跳', content: '', time: '2021-10-10 20:46' },
  { type: 'success', title: '配网成功', content: 'zigbee灯配网成功', time: '2021-10-10 20:46' },
  { type: 'error', title: '4寸屏错误', content: 'IO错误', time: '2021-10-10 20:46' },
  {
    type: 'warning',
    title: '人感传感器警告',
    content: '信息红区异常人感警告：有人在下班时间进入信息红区',
    time: '2021-10-10 20:46'
  },
  { type: 'info', title: '门锁信息', content: '门已上锁', time: '2021-10-10 20:46' }
];

const columns = [
  {
    title: '告警信息',
    key: 'name'
  },
  {
    title: '设备数量',
    key: 'age'
  },
  {
    title: '项目地址',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    render(row: TableData) {
      const tags = row.tags.map(tagKey => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: 'error'
          },
          {
            default: () => tagKey
          }
        );
      });
      return tags;
    }
  }
];

const tableData: TableData[] = [
  {
    key: 0,
    name: '项目2大量设备离线',
    age: 32,
    address: '重庆',
    tags: ['离线']
  },
  {
    key: 1,
    name: '智慧屏报错',
    age: 1,
    address: '顺德',
    tags: ['程序出错']
  },
  {
    key: 2,
    name: '项目3大量设备离线',
    age: 40,
    address: '美的总部',
    tags: ['离线']
  },
  {
    key: 3,
    name: '用户反馈',
    age: 0,
    address: '山东',
    tags: ['反馈']
  },
  {
    key: 4,
    name: '用户反馈',
    age: 0,
    address: '陕西',
    tags: ['反馈']
  },
  {
    key: 5,
    name: '门锁被撬',
    age: 1,
    address: '江西',
    tags: ['安全']
  },
  {
    key: 6,
    name: '安全区可能被非法入侵',
    age: 3,
    address: '北京',
    tags: ['安全']
  }
];
</script>

<style scoped></style>
