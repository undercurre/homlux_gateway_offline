<template>
  <n-modal v-model:show="modalVisible">
    <n-dialog :on-close="closeModal">
      <template #header>{{ userNameProps }}</template>
      <template #footer></template>
      <template #default>
        <n-loading-bar-provider :to="loadingBarTargetRef" container-style="position: absolute;">
          <div ref="loadingBarTargetRef" class="h-md flex flex-col justify-between">
            <n-list v-if="page.data.length">
              <n-list-item v-for="(item, index) in page.data" :key="index">
                <div class="flex justify-between">
                  <span>
                    <span>{{ `${index + 1}. ` }}</span>
                    <span>
                      <b>{{ `${item.userName}` }}</b>
                    </span>
                    <span>{{ ` 在${item.eventTime}` }}</span>
                    <span>
                      使用
                      <b>{{ `${item.eventType === '0' ? '密码' : 'IC卡'}` }}</b>
                    </span>
                    <span>
                      打开
                      <b>卧室</b>
                      房间
                    </span>
                  </span>
                </div>
              </n-list-item>
            </n-list>
            <div class="flex-1 grid place-items-center">
              <n-empty v-if="page.data.length == 0" class="flex-1" description="暂无日志"></n-empty>
            </div>
            <div class="w-full flex justify-between items-center">
              <span>记录保存12个月</span>
              <n-pagination
                v-if="page.data.length"
                v-model:page="page.no"
                :page-count="page.pNumber"
                simple
                :on-update:page="pageChange"
              />
            </div>
          </div>
          <process-bar :state="page.loading ? 1 : 2" />
        </n-loading-bar-provider>
      </template>
    </n-dialog>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, watch, reactive, defineComponent, ref } from 'vue';
import { useLoadingBar } from 'naive-ui';
import { fetchGetOneLockLog } from '@/service';

type EmitFunc = (e: 'update:visible', visible: boolean) => void;

const processBar = defineComponent({
  props: {
    state: Number // 1 start 2 finish 3 Error
  },
  setup() {
    const loadingBar = useLoadingBar();
    const disableRef = ref(true);
    return {
      disable: disableRef,
      loadingBarStart() {
        loadingBar.start();
        disableRef.value = false;
      },
      loadingBarFinish() {
        loadingBar.finish();
        disableRef.value = true;
      },
      loadingBarError() {
        loadingBar.error();
        disableRef.value = true;
      }
    };
  },
  mounted() {
    console.log(`process-bar running ${this.state}`);
    if (this.state === 1) {
      this.loadingBarStart();
    } else if (this.state === 2) {
      this.loadingBarFinish();
    } else {
      this.loadingBarError();
    }
  },
  updated() {
    console.log(`process-bar update ${this.state}`);
    if (this.state === 1) {
      this.loadingBarStart();
    } else if (this.state === 2) {
      this.loadingBarFinish();
    } else {
      this.loadingBarError();
    }
  }
});

interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /** 用户名称 */
  userName: string | null;
  /** 用户Id */
  userId: string | null;
  /** 项目Id */
  projectId: string | null;
}

interface Page {
  /** 当前页面索引 */
  no: number;
  /** 页面数据条数 */
  size: number;
  /** 页数 */
  pNumber: number;
  /** 页面数据 */
  data: ApiDevice.LockLog[];
  /** 页面Loading状态 */
  loading: boolean;
}

const loadingBarTargetRef = ref<undefined | HTMLElement>(undefined);

const visibleEmits = defineEmits<EmitFunc>();

const props = withDefaults(defineProps<Props>(), {});

const page = reactive<Page>({
  loading: false,
  no: 1,
  size: 10,
  pNumber: 0,
  data: []
});

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    visibleEmits('update:visible', visible);
  }
});

const userNameProps = computed(() => props.userName);

const closeModal = () => {
  modalVisible.value = false;
};

async function getData() {
  try {
    // eslint-disable-next-line require-atomic-updates
    page.loading = true;
    const res = await fetchGetOneLockLog({
      pageNo: page.no,
      pageSize: page.size,
      projectId: props.projectId!,
      userId: props.userId!
    });
    if (res.data) {
      /** 向上取整即可算出页数 */
      page.pNumber = Math.ceil(res.data.total / page.size);
      page.data = res.data.list;
      page.no = res.data.pageNo;
    }
  } finally {
    // eslint-disable-next-line require-atomic-updates
    page.loading = false;
  }
}

function pageChange(po: number) {
  if (po > page.pNumber) return;
  page.no = po;
  getData();
}

watch(
  () => props.visible,
  async (newValue: boolean) => {
    if (newValue) {
      // console.log(`项目id=${props.projectId} 用户Id=${props.userId}`);
      page.data = [];
      page.pNumber = 0;
      page.no = 1;
      getData();
    }
  }
);
</script>

<style scoped></style>
