<template>
  <div class="w-full">
    <n-tabs type="line" animated>
      <n-tab-pane name="tab1" tab="房间日志">
        <div class="wh-full p-6px">
          <n-card class="wh-full">
            <n-data-table
              class="mt-10px"
              :bordered="false"
              :max-height="420"
              :columns="roomLogColumns"
              :data="curRoomLogData"
              :pagination="roomPagination"
              @update-page="onRoomLogPageChange"
            />
          </n-card>
        </div>
      </n-tab-pane>
      <n-tab-pane name="tab2" tab="开锁日志">
        <div class="wh-full p-6px">
          <n-card class="wh-full">
            <n-data-table
              remote
              :pagination="lockPagination"
              class="mt-10px"
              :bordered="false"
              :max-height="420"
              :columns="lockLogColumns"
              :data="curLockLogData"
              @update-page="getLockLog"
            />
          </n-card>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchGetOneLockLog, fetchRoomLog } from '@/service';
import { useProjectStore } from '@/store';

const projectStore = useProjectStore();

interface Props {
  spaceId: string;
  deviceId: string;
}

const props = withDefaults(defineProps<Props>(), {
  spaceId: '',
  deviceId: ''
});

type roomLogRowData = {
  userName: string;
  timeStr: string;
  operation: string;
};
const roomLogColumns: DataTableColumns<roomLogRowData> = [
  {
    title: '用户',
    key: 'userName'
  },
  {
    title: '时间',
    key: 'timeStr'
  },
  {
    title: '操作',
    key: 'operation'
  }
];

const curRoomLogData = reactive<roomLogRowData[]>([]);

const roomPagination = ref({
  pageSize: 8
});

const logPageSize = 40;
const now = new Date();

let curRoomLogTimestamp = now.valueOf();
let isRoomLogEnd = false;

const lastYear = new Date(now.setFullYear(now.getFullYear() - 1)).valueOf();

async function getRoomLog() {
  if (isRoomLogEnd) return;
  const res = await fetchRoomLog({
    spaceId: props.spaceId,
    count: logPageSize,
    reportTs: curRoomLogTimestamp
  });
  if (res.data) {
    // eslint-disable-next-line require-atomic-updates
    if (res.data.length < logPageSize) isRoomLogEnd = true;
    res.data.forEach(item => {
      if (item.reportTs < lastYear) {
        isRoomLogEnd = true;
        return;
      }
      if (item.reportTs < curRoomLogTimestamp) curRoomLogTimestamp = item.reportTs;
      curRoomLogData.push({
        userName: item.userName,
        timeStr: item.reportAt,
        operation: item.eventName
      });
    });
  }
}

function onRoomLogPageChange(page: number) {
  const shang = Math.floor(curRoomLogData.length / roomPagination.value.pageSize);
  const yu = curRoomLogData.length % roomPagination.value.pageSize;
  if ((page === shang && yu === 0) || (page > shang && yu > 0)) {
    getRoomLog();
  }
}

/**
 * ***************************************************************
 */

type lockLogRowData = {
  content: string;
  timeStr: string;
};
const lockLogColumns: DataTableColumns<lockLogRowData> = [
  {
    title: '内容',
    key: 'content'
  },
  {
    title: '时间',
    key: 'timeStr'
  }
];

const curLockLogData = reactive<lockLogRowData[]>([]);

const lockPagination = reactive({
  page: 1,
  pageSize: 8,
  pageCount: 1
});

async function getLockLog(pageIndex: number) {
  if (!props.deviceId) return;
  const res = await fetchGetOneLockLog({
    pageNo: pageIndex,
    pageSize: lockPagination.pageSize,
    projectId: projectStore.curId,
    deviceId: props.deviceId,
    spaceId: props.spaceId
  });
  // eslint-disable-next-line require-atomic-updates
  if (res.data?.pageNo) lockPagination.page = res.data?.pageNo;
  // eslint-disable-next-line require-atomic-updates
  if (res.data?.pages) lockPagination.pageCount = res.data?.pages;
  if (res.data?.list) {
    curLockLogData.splice(0, curLockLogData.length);
    res.data?.list.forEach(item => {
      curLockLogData.push({
        content: item.content,
        timeStr: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      });
    });
  }
}

onMounted(() => {
  getRoomLog();
  getLockLog(1);
});
</script>
