<template>
  <n-modal v-model:show="modalVisible">
    <n-dialog class="min-w-500px" :on-close="closeModal">
      <template #header>门锁日志</template>
      <template #default>
        <div class="h-md flex flex-col justify-between">
          <n-list v-if="data.length">
            <template #footer></template>
            <n-list-item v-for="(item, index) in data" :key="item.createTime">
              <div class="flex justify-between">
                <span class="mr-20px">{{ index }}</span>
                <span class="font-700">
                  {{ item.userName }}
                </span>
                在
                <span>{{ item.eventTime }}</span>
                用
                <span class="font-700">{{ formatLockWay(item.userType) }}</span>
                <span>{{ formatLockDo(item.eventType) }}</span>
                <span>{{ props.lock?.spaceName }}</span>
                房间
              </div>
            </n-list-item>
          </n-list>
          <div class="flex-1 grid place-items-center">
            <n-empty v-if="!data.length" class="flex-1" description="暂无日志"></n-empty>
          </div>
          <div class="w-full flex justify-between items-center">
            <span>记录保存12个月</span>
            <n-pagination v-model:page="page" :page-count="totalPage" simple :on-update:page="pageChange" />
          </div>
        </div>
      </template>
    </n-dialog>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { fetchGetOneLockLog } from '@/service';
import { useProjectStore } from '~/src/store';

interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  lock?: ApiDevice.Lock | null;
}

defineOptions({ name: 'LockLog' });

const projectStore = useProjectStore();

const props = withDefaults(defineProps<Props>(), {
  lock: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

const emit = defineEmits<Emits>();

const page = ref(1);

const total = ref(100);

const pageSize = ref(8);

const totalPage = computed(() => {
  const yushu = total.value % pageSize.value;
  const totalPageCount = Math.floor(total.value / pageSize.value + (yushu > 0 ? 1 : 0));
  return totalPageCount;
});

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const closeModal = () => {
  modalVisible.value = false;
};

const data = ref<Array<ApiDevice.LockLog>>([]);

async function getOneLockLog() {
  if (props.lock) {
    const res = await fetchGetOneLockLog({
      pageNo: page.value,
      pageSize: pageSize.value,
      projectId: projectStore.curId,
      deviceId: props.lock.deviceId,
      imei: props.lock.imei
    });

    if (res.data) {
      data.value = res.data.list;
      total.value = res.data.total;
    }
  }
}

async function pageChange(pn: number) {
  if (pn > totalPage.value) return;
  page.value = pn;
  getOneLockLog();
}

async function clearInfo() {
  page.value = 1;
  data.value = [];
}

watch(
  () => props.visible,
  async (newValue: boolean) => {
    if (newValue) {
      getOneLockLog();
    } else {
      clearInfo();
    }
  }
);

// function formatDate(dateString: string): string {
//   const date = new Date(dateString);

//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');

//   const hours = date.getHours().toString().padStart(2, '0');
//   const minutes = date.getMinutes().toString().padStart(2, '0');
//   const seconds = date.getSeconds().toString().padStart(2, '0');

//   return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
// }

function formatLockWay(userType: '0' | '1' | '2') {
  switch (userType) {
    case '0':
      return '密码';
    case '1':
      return '门卡';
    case '2':
      return '人脸';
    default:
      return '未知';
  }
}

function formatLockDo(eventType: '0' | '1') {
  switch (eventType) {
    case '0':
      return '关闭';
    case '1':
      return '打开';
    default:
      return '未知';
  }
}
</script>

<style scoped></style>
