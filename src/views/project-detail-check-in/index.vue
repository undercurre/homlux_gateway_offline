<template>
  <div class="w-full h-full flex">
    <div class="wh-full">
      <n-split
        v-model:size="split"
        :disabled="true"
        class="h-full"
        direction="horizontal"
        :max="isSpaceEditing ? 0.75 : 0.8"
        :min="isSpaceEditing ? 0.25 : 0.2"
      >
        <template #1>
          <n-card
            class="wh-full relative z-1001"
            :style="{
              'padding-bottom': isSpaceEditing ? '100px' : '40px'
            }"
          >
            <div class="w-full h-56px flex">
              <n-button
                class="w-full h-42px"
                :render-icon="isSpaceEditing ? iconFinish : iconSpace"
                @click="onSpaceEditClick"
              >
                {{ isSpaceEditing ? '完成' : '空间管理' }}
              </n-button>
            </div>
            <div class="wh-full flex-col overflow-scroll">
              <div class="h-200px wh-full">
                <n-tree
                  block-line
                  :show-line="false"
                  :data="treeData"
                  :expand-on-click="false"
                  :render-prefix="renderPrefix"
                  :render-label="renderLabel"
                  :render-suffix="isSpaceEditing ? renderSuffix : () => {}"
                />
              </div>
            </div>
            <div v-if="isSpaceEditing" class="w-full h-40px flex-center p-18px absolute left-0 bottom-12px">
              <n-button class="w-full" @click="openAddModal(1)">+新建楼栋</n-button>
            </div>
          </n-card>
        </template>
        <template #2>
          <div class="wh-full flex-col">
            <n-layout-header bordered>
              <div class="flex-center">
                <div class="w-full">
                  <n-space :size="[16, 6]" class="flex-y-center p-8px ml-10px">
                    <n-button
                      v-for="(item, index) in cardFilterButtons"
                      :key="index"
                      class="w-110px"
                      :style="{ 'background-color': item.isChoose ? item.color : 'rgba(255, 255, 255, 0)' }"
                      @click="onFilterButtonClick(index)"
                    >
                      {{ item.name }}
                    </n-button>
                    <div v-for="(item, index) in customFilterLabels" :key="index" class="min-w-110px h-34px">
                      <n-select
                        v-model:value="item.value"
                        :options="item.option"
                        :placeholder="item.name"
                        clearable
                        @update-value="onFilterUpdate"
                      />
                    </div>
                  </n-space>
                </div>
                <n-divider vertical />
                <div class="w-50px h-50px flex-center">
                  <n-button text :render-icon="iconSetting" @click="isShowSetting = true"></n-button>
                </div>
              </div>
            </n-layout-header>
            <n-layout-content class="h-200px p-12px pb-14">
              <n-grid cols="2 s:2 m:4 l:4 xl:6 2xl:6" responsive="screen">
                <n-grid-item v-for="(item, index) in cardData" :key="index">
                  <room-card
                    :id="item.roomId"
                    :room-name="item.roomName"
                    :live-max="item.liveMax"
                    :live-num="item.liveNum"
                    :have-device="item.haveDevice"
                    :is-locked="item.isLocked"
                    :time-limit-type="item.timeLimitType"
                    @card-click="onCardClick"
                  ></room-card>
                </n-grid-item>
              </n-grid>
              <div class="w-full h-50px pr-30px absolute bottom-0 flex justify-end">
                <n-pagination
                  v-model:page="curCardPageIndex"
                  :page-count="curCardPageTotal"
                  @update-page="onCardPageChange"
                />
              </div>
            </n-layout-content>
          </div>
        </template>
      </n-split>
    </div>
    <div v-if="isSpaceEditing" class="fixed wh-full left-0 top-0 bg-#666 op-80 z-1000"></div>

    <n-drawer v-model:show="isShowRoomDetail" :width="480" :auto-focus="false">
      <n-drawer-content :native-scrollbar="false">
        <n-space justify="space-between" class="flex-y-center">
          <span style="font-size: 18px; font-weight: 500">
            门锁电量: {{ curChooseCardDetail.lockBattery !== undefined ? curChooseCardDetail.lockBattery : '--' }}%
          </span>
          <n-space>
            <n-button :text="true" :render-icon="iconEdit" @click="onRoomEditClick"></n-button>
            <n-button :text="true" :render-icon="iconDel" @click="onRoomDelClick"></n-button>
          </n-space>
        </n-space>
        <n-space vertical class="mt-20px mb-20px">
          <n-button class="w-full" :disabled="curChooseCardDetail.isLocked" @click="openLiveBusinessModal(1)">
            办理入住
          </n-button>
          <n-button class="w-full" :disabled="curChooseCardDetail.isLocked" @click="openLiveBusinessModal(2)">
            续房
          </n-button>
          <n-button class="w-full" :disabled="curChooseCardDetail.isLocked" @click="openLiveBusinessModal(3)">
            退房
          </n-button>
          <n-button
            class="w-full"
            :color="curChooseCardDetail.isLocked ? 'rgba(255,8,8,0.66)' : ''"
            @click="onLockRoomClick"
          >
            {{ curChooseCardDetail.isLocked ? '解锁' : '锁定' }}
          </n-button>
          <n-button class="w-full" @click="isShowLog = true">查看房间日志</n-button>
        </n-space>
        <n-space class="mb-10px">
          <span class="font-500" style="font-size: 18px">当前人员：</span>
        </n-space>
        <n-data-table :bordered="false" :max-height="600" :columns="roomMemberColumns" :data="curRoomMemberData" />
      </n-drawer-content>
    </n-drawer>

    <n-modal
      v-model:show="isShowSpaceAdd"
      :style="{
        width: curSpaceOptionType === 3 ? '540px' : '400px'
      }"
      :mask-closable="false"
      :show-icon="false"
      preset="dialog"
      :title="curSpaceOptionType === 1 ? '新建楼栋' : curSpaceOptionType === 2 ? '新建楼层' : '新建房间'"
      positive-text="确认"
      negative-text="取消"
      @positive-click="addModalConfirm"
      @negative-click="addModalCancel"
    >
      <div v-if="curSpaceOptionType === 1 || curSpaceOptionType === 2" class="w-full flex-center">
        <n-input
          v-model:value="addNameInput"
          :allow-input="onlyAllowChar"
          maxlength="8"
          show-count
          clearable
          type="text"
          placeholder="请输入名称(中文、字母及数字)"
        />
      </div>
      <div v-if="curSpaceOptionType === 3" class="w-full flex-y-center">
        <n-tabs type="line" animated @update-value="onAddRoomTabClick">
          <n-tab-pane name="batch" tab="批量新增">
            <div class="w-full">
              <n-space>
                <n-form-item path="name" label="开始编号">
                  <n-input
                    v-model:value="addBatchNumInput"
                    :allow-input="onlyAllowChar"
                    maxlength="8"
                    show-count
                    clearable
                    type="text"
                    placeholder="最后一位是数字"
                  />
                </n-form-item>
                <n-form-item path="name" label="数量">
                  <n-input
                    v-model:value="addBatchCountInput"
                    :allow-input="onlyAllowNumber"
                    maxlength="2"
                    show-count
                    clearable
                    type="text"
                    placeholder="小于50个"
                  />
                </n-form-item>
              </n-space>
              <n-form-item path="name" label="入住人数">
                <n-select
                  v-model:value="addRoomLiveNum"
                  placeholder="请选择入住人数"
                  :options="addRoomLiveNumOption"
                  clearable
                />
              </n-form-item>
              <n-form-item v-for="(item, index) in addRoomCustomLabels" :key="index" path="name" :label="item.name">
                <n-select v-model:value="item.value" placeholder="请选择" :options="item.option" clearable />
              </n-form-item>
            </div>
          </n-tab-pane>
          <n-tab-pane name="single" tab="单个新增">
            <div class="w-full">
              <n-form-item path="name" label="房间名称">
                <n-input
                  v-model:value="addNameInput"
                  :allow-input="onlyAllowChar"
                  maxlength="8"
                  show-count
                  clearable
                  type="text"
                  placeholder="请输入名称(中文、字母及数字)"
                />
              </n-form-item>
              <n-form-item path="name" label="入住人数">
                <n-select
                  v-model:value="addRoomLiveNum"
                  placeholder="请选择入住人数"
                  :options="addRoomLiveNumOption"
                  clearable
                />
              </n-form-item>
              <n-form-item v-for="(item, index) in addRoomCustomLabels" :key="index" path="name" :label="item.name">
                <n-select v-model:value="item.value" placeholder="请选择" :options="item.option" clearable />
              </n-form-item>
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-modal>

    <n-modal
      v-model:show="isShowSpaceEdit"
      :style="{
        width: curSpaceOptionType === 3 ? '540px' : '400px'
      }"
      :mask-closable="false"
      preset="dialog"
      :title="curSpaceOptionType === 1 ? '修改楼栋' : curSpaceOptionType === 2 ? '修改楼层' : '修改房间'"
      positive-text="确认"
      negative-text="取消"
      @positive-click="editModalConfirm"
      @negative-click="isShowSpaceEdit = false"
    >
      <div class="w-full h-20px"></div>
      <div v-if="curSpaceOptionType === 1 || curSpaceOptionType === 2" class="w-full flex-center">
        <n-input
          v-model:value="editNameInput"
          :allow-input="onlyAllowChar"
          maxlength="8"
          show-count
          clearable
          type="text"
          placeholder="请输入名称(中文、字母及数字)"
        />
      </div>
      <div v-if="curSpaceOptionType === 3" class="w-full block">
        <n-form-item path="name" label="房间名称">
          <n-input
            v-model:value="editNameInput"
            :allow-input="onlyAllowChar"
            maxlength="8"
            show-count
            clearable
            type="text"
            placeholder="请输入名称(中文、字母及数字)"
          />
        </n-form-item>
        <n-form-item path="name" label="入住人数">
          <n-select
            v-model:value="editRoomLiveNum"
            placeholder="请选择入住人数"
            :options="addRoomLiveNumOption"
            clearable
          />
        </n-form-item>
        <n-form-item v-for="(item, index) in editRoomCustomLabels" :key="index" path="name" :label="item.name">
          <n-select v-model:value="item.value" placeholder="请选择" :options="item.option" clearable />
        </n-form-item>
      </div>
      <div class="w-full h-20px"></div>
    </n-modal>

    <n-modal
      v-model:show="isShowSpaceDel"
      class="w-600px h-140px"
      :mask-closable="false"
      preset="dialog"
      :title="`确定要删除${curDelNodeName}吗？`"
      positive-text="确认"
      negative-text="取消"
      @positive-click="delModalConfirm"
      @negative-click="isShowSpaceDel = false"
    >
      <div class="h-20px"></div>
    </n-modal>

    <n-modal
      v-model:show="isShowHandleLiveIn"
      :mask-closable="false"
      :show-icon="false"
      preset="dialog"
      :style="{
        width: '1200px',
        height: '700px'
      }"
      :title="curLiveBusinessType === 1 ? `办理入住` : curLiveBusinessType === 2 ? '办理续住' : '办理退房'"
      positive-text="确认"
      negative-text="取消"
      @positive-click="liveBusinessConfirm"
      @negative-click="liveBusinessCancel"
    >
      <div class="w-full min-h-580px">
        <n-data-table :bordered="false" :max-height="460" :columns="liveInColumnsFull" :data="curLiveInBusinessData" />
        <n-button v-if="curLiveBusinessType" class="w-full" @click="onAddMemberClick">+新增入住人员</n-button>
        <n-space v-if="curLiveBusinessType === 3" justify="end" class="mt-20px">
          <n-button @click="onAllMemberCheckOut">全部退房</n-button>
        </n-space>
      </div>
    </n-modal>

    <n-modal
      v-model:show="isShowLog"
      :mask-closable="false"
      :show-icon="false"
      preset="dialog"
      :style="{
        width: '1200px',
        height: '680px'
      }"
      :title="`查看${curChooseCardRoomName}房间日志`"
    >
      <room-log :space-id="curChooseCardId" :device-id="curChooseCardDetail.deviceId"></room-log>
    </n-modal>

    <n-modal
      v-model:show="isShowSetting"
      :mask-closable="false"
      :show-icon="false"
      preset="dialog"
      :style="{
        width: '1200px',
        height: '740px'
      }"
      title="系统设置"
      @after-leave="updateCustomLabels"
    >
      <system-setting></system-setting>
    </n-modal>
  </div>
</template>

<script setup lang="tsx">
import { computed, h, onMounted, reactive, ref } from 'vue';
import type { DataTableColumns, TreeOption } from 'naive-ui';
import { NButton, NEllipsis, NSpace, NTag, useMessage } from 'naive-ui';
import dayjs from 'dayjs';
import {
  fetchSpaceForProject,
  fetchAddSpace,
  fetchDeleteSpace,
  fetchEditSpace,
  fetchAddSpaceBatch,
  fetchAllRoomBySpace,
  fetchMembersBySpace,
  fetchMembersCheckIn,
  fetchMembersExtend,
  fetchMembersCheckOut,
  fetchLockRoom,
  fetchLabelsByProject
} from '@/service';
import { useProjectStore } from '@/store';
import { useIconRender } from '@/composables';
import roomCard from './components/room-card.vue';
import showOrEditInput from './components/show-or-edit-input.vue';
import showOrDatePicker from './components/show-or-date-picker.vue';
import roomLog from './components/room-log.vue';
import systemSetting from './components/system-setting.vue';

const projectStore = useProjectStore();

const { iconRender } = useIconRender();
const message = useMessage();
const iconSpace = iconRender({ icon: 'arcticons:keyspace' });
const iconFinish = iconRender({ icon: 'line-md:confirm' });
const iconAdd = iconRender({ icon: 'icon-park-solid:add' });
const iconEdit = iconRender({ icon: 'carbon:edit' });
const iconDel = iconRender({ icon: 'carbon:row-delete' });
const iconSetting = iconRender({ icon: 'uil:setting' });

const split = ref<number>(0.2);
const isSpaceEditing = ref(false);
const isShowSpaceAdd = ref(false);
const isShowSpaceEdit = ref(false);
const isShowSpaceDel = ref(false);
const isShowRoomDetail = ref(false);
const isShowHandleLiveIn = ref(false);
const isShowLog = ref(false);
const isShowSetting = ref(false);

const curSpaceOptionType = ref(0); // 1=楼栋，2=楼层，3=房间
const addNameInput = ref(''); // 新建名称输入
const addBatchNumInput = ref(null); // 批量新建编号
const addBatchCountInput = ref(null); // 批量新建数量
const addRoomLiveNum = ref(null); // 新建房间入住人数
let isBatchAddRoom = true;
const editNameInput = ref(''); // 修改名称输入
const editRoomLiveNum = ref<number | null>(null);
let curTreeNodeKey = 0; // 当前点击的树节点key
let curTreeNodeKey2ShowCard = 0;
const curDelNodeName = ref('');
const curLiveBusinessType = ref(0); // 1=入住，2=续房，3=退房

const curCardPageIndex = ref(1);
const curCardPageTotal = ref(1);

const treeData = reactive<TreeOption[]>([
  // {
  //   label: '栋栋栋栋栋栋栋栋',
  //   key: 1,
  //   children: [
  //     {
  //       label: '层层层层层层层层',
  //       key: 1001
  //     },
  //     {
  //       label: '层层层层层层层层',
  //       key: 1002
  //     }
  //   ]
  // },
  // {
  //   label: '2栋',
  //   key: 2,
  //   children: [
  //     {
  //       label: '1层',
  //       key: 2001
  //     }
  //   ]
  // }
]);

const curMembersAddingTemp = reactive<roomMember[]>([]);
const curMembersExtendTemp = reactive<roomMember[]>([]);

const cardFilterButtons = reactive([
  { name: '所有房间', color: 'rgba(255,255,255,0.66)', isChoose: true, value: 0 },
  { name: '空置房间', color: 'rgba(88,182,115,0.66)', isChoose: false, value: 1 },
  { name: '有人房间', color: 'rgba(41,109,255,0.66)', isChoose: false, value: 2 },
  { name: '即将到期', color: 'rgba(255,194,65,0.66)', isChoose: false, value: 3 },
  { name: '超期房间', color: 'rgba(248,108,49,0.66)', isChoose: false, value: 4 },
  { name: '锁定房间', color: 'rgba(255,8,8,0.66)', isChoose: false, value: 5 }
]);

type customLabel = {
  id: string;
  name: string;
  value: string | null;
  option: { label: string; value: string }[];
};

const customFilterLabels = reactive<customLabel[]>([]);

type roomMember = {
  userId: string;
  name: string;
  limitDate?: string;
  startDate?: string;
  timeLimitType?: number;
  phoneNumber?: string;
  isSync?: number;
};

type roomCardOption = {
  pid?: string;
  roomId: string;
  roomName: string;
  liveMax: number;
  liveNum: number;
  haveDevice: boolean;
  deviceId?: string;
  isLocked: boolean;
  timeLimitType: number;
  lockBattery?: number;
  members?: roomMember[];
  labelIds?: string[];
};

const cardData = reactive<roomCardOption[]>([
  // {
  //   roomId: '001',
  //   roomName: '1层10014',
  //   liveMax: 6,
  //   liveNum: 2,
  //   haveDevice: true,
  //   isLocked: false,
  //   timeLimitType: 0,
  //   lockBattery: 10,
  //   members: [
  //     {
  //       userId: '001',
  //       name: '001测试测试测试',
  //       startDate: '2024-4-08 12:00',
  //       limitDate: '2024-4-10 12:00',
  //       timeLimitType: 0,
  //       phoneNumber: '123322222'
  //     },
  //     { userId: '002', name: '002对方的说的是', limitDate: '2024-4-10 12:00', timeLimitType: 1 },
  //     { userId: '003', name: '003二对方过分', limitDate: '2024-4-10 12:00', timeLimitType: 2 },
  //     { userId: '004', name: '001测试测试测试', limitDate: '2024-4-10 12:00', timeLimitType: 0 },
  //     { userId: '005', name: '002对方的说的是', limitDate: '2024-4-10 12:00', timeLimitType: 1 }
  //   ]
  // }
]);

const curChooseCardId = ref(''); // 当前选中卡片id
// 当前选中卡片详细
const curChooseCardDetail = computed((): roomCardOption => {
  const ret: roomCardOption = {
    pid: '',
    roomId: '',
    roomName: '',
    liveMax: 0,
    liveNum: 0,
    haveDevice: false,
    isLocked: false,
    timeLimitType: 0,
    lockBattery: 0,
    members: [],
    deviceId: ''
  };
  if (!curChooseCardId.value) return ret;
  return (cardData.find(item => item.roomId === curChooseCardId.value) as roomCardOption) || ret;
});
const curChooseCardRoomName = computed((): string => {
  if (!curChooseCardId.value) return '';
  return curChooseCardDetail.value.roomName;
});

type roomMemberRowData = {
  name: string;
  date: string;
  tags: number[];
};

const roomMemberColumns: DataTableColumns<roomMemberRowData> = [
  {
    title: '名字',
    key: 'name'
  },
  {
    title: '到期时间',
    key: 'date'
  },
  {
    title: '期限状态',
    key: 'tags',
    render(row) {
      const arr = ['正常', '即将到期', '已超期'];
      const colors = ['rgba(141,246,128,0.66)', 'rgba(255,194,65,0.66)', 'rgba(248,108,49,0.66)'];
      return row.tags.map(tag => {
        const text = arr[tag] || '';
        const col = colors[tag] || 'rgba(255,255,255,0.66)';
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            color: {
              color: col
            },
            bordered: false
          },
          {
            default: () => text
          }
        );
      });
    }
  }
];

const curRoomMemberData = computed((): roomMemberRowData[] => {
  if (!curChooseCardDetail.value) return [];
  if (!curChooseCardDetail.value.members) return [];
  return curChooseCardDetail.value.members!.map(item => {
    const type = item.timeLimitType || 0;
    return {
      name: item.name || '',
      date: item.limitDate || '',
      tags: [type]
    };
  });
});

type liveInRowData = {
  index: number;
  id: string;
  roomName: string;
  userName: string;
  startDate: string;
  limitDate: string;
  phoneNumber: string;
  passwordStatus: string;
};

const liveInColumnsBase: DataTableColumns<liveInRowData> = [
  {
    title: '序号',
    key: 'index',
    width: 60
  },
  {
    title: '房间',
    key: 'roomName',
    width: 140
  },
  {
    title: '入住人员',
    key: 'userName',
    width: 210,
    render(row) {
      const isAdd = row.id.startsWith('ADD');
      return h(showOrEditInput, {
        value: row.userName,
        placeholder: '请输入名字',
        maxLength: 8,
        inputType: 0,
        disable:
          (curLiveBusinessType.value === 1 && !isAdd) ||
          curLiveBusinessType.value === 2 ||
          curLiveBusinessType.value === 3,
        onUpdateValue(val) {
          if (isAdd) {
            curMembersAddingTemp.forEach(item => {
              if (item.userId !== row.id) return;
              item.name = val;
            });
          }
        }
      });
    }
  },
  {
    title: '入住时间',
    key: 'startDate',
    width: 220,
    render(row) {
      const isAdd = row.id.startsWith('ADD');
      let time = new Date().valueOf();
      if (row.startDate) time = new Date(row.startDate).valueOf();
      return h(showOrDatePicker, {
        timestamp: time,
        disable: (curLiveBusinessType.value === 1 && !isAdd) || curLiveBusinessType.value === 3,
        onUpdateValue(val) {
          if (isAdd) {
            curMembersAddingTemp.forEach(item => {
              if (item.userId !== row.id) return;
              item.startDate = dayjs(val).format('YYYY-MM-DD HH:mm:ss');
            });
          }
          if (curLiveBusinessType.value === 2) {
            let isNew = true;
            curMembersExtendTemp.forEach(item => {
              if (item.userId === row.id) {
                item.startDate = dayjs(val).format('YYYY-MM-DD HH:mm:ss');
                isNew = false;
              }
            });
            if (isNew) {
              curMembersExtendTemp.push({
                name: row.userName,
                userId: row.id,
                startDate: dayjs(val).format('YYYY-MM-DD HH:mm:ss'),
                limitDate: row.limitDate
              });
            }
          }
        }
      });
    }
  },
  {
    title: '到期时间',
    key: 'limitDate',
    width: 220,
    render(row) {
      const isAdd = row.id.startsWith('ADD');
      let time = new Date().valueOf();
      if (row.limitDate) time = new Date(row.limitDate).valueOf();
      return h(showOrDatePicker, {
        timestamp: time,
        disable: (curLiveBusinessType.value === 1 && !isAdd) || curLiveBusinessType.value === 3,
        onUpdateValue(val) {
          if (isAdd) {
            curMembersAddingTemp.forEach(item => {
              if (item.userId !== row.id) return;
              item.limitDate = dayjs(val).format('YYYY-MM-DD HH:mm:ss');
            });
          }
          if (curLiveBusinessType.value === 2) {
            let isNew = true;
            curMembersExtendTemp.forEach(item => {
              if (item.userId === row.id) {
                item.limitDate = dayjs(val).format('YYYY-MM-DD HH:mm:ss');
                isNew = false;
              }
            });
            if (isNew) {
              curMembersExtendTemp.push({
                name: row.userName,
                userId: row.id,
                startDate: row.startDate,
                limitDate: dayjs(val).format('YYYY-MM-DD HH:mm:ss')
              });
            }
          }
        }
      });
    }
  },
  {
    title: '手机号码',
    key: 'phoneNumber',
    render(row) {
      const isAdd = row.id.startsWith('ADD');
      return h(showOrEditInput, {
        value: row.phoneNumber,
        placeholder: '请输入手机号码',
        maxLength: 11,
        inputType: 1,
        disable:
          (curLiveBusinessType.value === 1 && !isAdd) ||
          curLiveBusinessType.value === 2 ||
          curLiveBusinessType.value === 3,
        onUpdateValue(val) {
          if (isAdd) {
            curMembersAddingTemp.forEach(item => {
              if (item.userId !== row.id) return;
              item.phoneNumber = val;
            });
          }
        }
      });
    }
  }
];

const liveInColumnsFull = computed((): DataTableColumns<liveInRowData> => {
  let arr: DataTableColumns<liveInRowData> = [];
  if (curLiveBusinessType.value === 1 || curLiveBusinessType.value === 2) {
    arr = [
      {
        title: '密码开门',
        key: 'passwordStatus',
        width: 120
      }
    ];
  } else if (curLiveBusinessType.value === 3) {
    arr = [
      {
        title: '退房',
        key: 'none',
        render(row) {
          return h(
            NButton,
            {
              style: {
                'font-size': '14px'
              },
              onClick: () => {
                onCheckOutMembers([{ userId: row.id }]);
              }
            },
            () => '退房'
          );
        }
      }
    ];
  }
  return [...liveInColumnsBase, ...arr];
});

const curLiveInBusinessData = computed((): liveInRowData[] => {
  if (!curChooseCardDetail.value || !curChooseCardDetail.value.members) return [];
  let index = 0;
  const all: roomMember[] = [...curChooseCardDetail.value.members, ...curMembersAddingTemp];
  return all.map(item => {
    index += 1;
    let text = '';
    if (item.isSync === 1) text = '密码已生效';
    else if (item.isSync === 0) text = '密码下发中';
    return {
      index,
      id: item.userId,
      roomName: curChooseCardDetail.value.roomName,
      userName: item.name,
      startDate: item.startDate || '',
      limitDate: item.limitDate || '',
      phoneNumber: item.phoneNumber || '',
      passwordStatus: text
    };
  });
});

const addRoomLiveNumOption = computed(() => {
  const arr = [];
  for (let i = 0; i < 8; i += 1) {
    arr.push({
      label: i + 1,
      value: i + 1
    });
  }
  return arr;
});

const addRoomCustomLabels = reactive<customLabel[]>([]);
const editRoomCustomLabels = reactive<customLabel[]>([]);

async function updateCustomLabels() {
  const res = await fetchLabelsByProject(projectStore.curId);
  if (!res.data) return;
  const list = res.data;
  addRoomCustomLabels.splice(0, addRoomCustomLabels.length);
  editRoomCustomLabels.splice(0, editRoomCustomLabels.length);
  const temp: customLabel[] = [];
  list.forEach(item => {
    if (item.isEnabled === 0) return;

    const optionArr: { label: string; value: string }[] = [];
    item.childLabelList.forEach(child => {
      optionArr.push({
        label: child.property,
        value: child.labelId
      });
    });

    let value = null;
    customFilterLabels.forEach(label => {
      if (label.id === item.labelId) value = label.value;
    });
    const label: customLabel = {
      id: item.labelId,
      name: item.property,
      value,
      option: optionArr
    };
    temp.push(label);

    const label2: customLabel = {
      id: item.labelId,
      name: item.property,
      value: null,
      option: optionArr
    };
    addRoomCustomLabels.push(label2);
    editRoomCustomLabels.push({ ...label2 });
  });

  customFilterLabels.splice(0, customFilterLabels.length);
  temp.forEach(item => {
    customFilterLabels.push(item);
  });
}

function onSpaceEditClick() {
  isSpaceEditing.value = !isSpaceEditing.value;
  if (isSpaceEditing.value) split.value = 0.25;
  else split.value = 0.2;
}

// 楼层树表格 前缀
function renderPrefix({ option }: { option: TreeOption }) {
  const iconBuild = iconRender({ icon: 'ph:building' });
  const iconLevel = iconRender({ icon: 'gis:layer-o' });
  const keyStr = String(option.key);
  return keyStr.length >= 4 ? iconLevel() : iconBuild();
}

// 楼层树表格 内容
function renderLabel({ option }: { option: TreeOption; checked: boolean; selected: boolean }) {
  return h(
    NEllipsis,
    {
      style: { 'max-width': '85%' },
      onclick: () => {
        curTreeNodeKey = Number(option.key) || 0;
        curTreeNodeKey2ShowCard = curTreeNodeKey;
        updateCardView();
      }
    },
    () => option.label
  );
}

// 楼层树表格 后缀
function renderSuffix({ option }: { option: TreeOption }) {
  const keyStr = String(option.key);
  return h(NSpace, { justify: 'end', style: { 'margin-top': '4px' } }, () => [
    h(
      NButton,
      {
        text: true,
        style: {
          'font-size': '18px'
        },
        onClick: (event: MouseEvent) => {
          event.stopPropagation();
          curTreeNodeKey = Number(option.key) || 0;
          if (keyStr.length >= 4) {
            isBatchAddRoom = true;
            openAddModal(3);
          } else {
            openAddModal(2);
          }
        }
      },
      () => iconAdd()
    ),
    h(
      NButton,
      {
        text: true,
        style: {
          'font-size': '18px'
        },
        onClick: (event: MouseEvent) => {
          event.stopPropagation();
          curTreeNodeKey = Number(option.key) || 0;
          editNameInput.value = option.label || '';
          if (keyStr.length >= 4) {
            openEditModal(2);
          } else {
            openEditModal(1);
          }
        }
      },
      () => iconEdit()
    ),
    h(
      NButton,
      {
        text: true,
        style: {
          'font-size': '18px'
        },
        onClick: (event: MouseEvent) => {
          event.stopPropagation();
          curTreeNodeKey = Number(option.key) || 0;
          curDelNodeName.value = option.label || '';
          if (keyStr.length >= 4) {
            openDelModal(2);
          } else {
            openDelModal(1);
          }
        }
      },
      () => iconDel()
    )
  ]);
}

function openAddModal(type: number) {
  curSpaceOptionType.value = type;
  isShowSpaceAdd.value = true;
}

function openEditModal(type: number) {
  curSpaceOptionType.value = type;
  isShowSpaceEdit.value = true;
}

function openDelModal(type: number) {
  curSpaceOptionType.value = type;
  isShowSpaceDel.value = true;
}

function openLiveBusinessModal(type: number) {
  curLiveBusinessType.value = type;
  isShowHandleLiveIn.value = true;
  updateCurRoomMembers();
}

async function onLockRoomClick() {
  const mem = curChooseCardDetail.value.members;
  if (mem && mem.length > 0) {
    message.warning('该房间已有住户，无法锁定');
    return;
  }
  const isLocked = curChooseCardDetail.value.isLocked;
  await fetchLockRoom(curChooseCardId.value, isLocked ? 0 : 1);
  for (let i = 0; i < cardData.length; i += 1) {
    if (cardData[i].roomId === curChooseCardId.value) {
      cardData[i].isLocked = !isLocked;
      return;
    }
  }
}

function onlyAllowChar(value: string) {
  return !value || /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value);
}
function onlyAllowNumber(value: string) {
  return !value || /^\d+$/.test(value);
}

function onAddRoomTabClick(value: string) {
  if (value === 'batch') {
    isBatchAddRoom = true;
  } else if (value === 'single') {
    isBatchAddRoom = false;
  }
}

function addModalConfirm() {
  if (curSpaceOptionType.value === 1) {
    if (!addNameInput.value) {
      message.warning('请输入楼栋名称');
      return false;
    }
    addBuilding(addNameInput.value);
  } else if (curSpaceOptionType.value === 2 && curTreeNodeKey > 0) {
    if (!addNameInput.value) {
      message.warning('请输入楼层名称');
      return false;
    }
    addFloor(curTreeNodeKey, addNameInput.value);
  } else if (curSpaceOptionType.value === 3 && curTreeNodeKey > 0) {
    if (isBatchAddRoom) {
      if (!addBatchNumInput.value) {
        message.warning('请输入开始编号');
        return false;
      }
      const startNum = String(addBatchNumInput.value);
      if (!/^\d+$/.test(startNum[startNum.length - 1])) {
        message.warning('编号最后一位请输入数字');
        return false;
      }
      if (!addBatchCountInput.value) {
        message.warning('请输入数量');
        return false;
      }
      const count = parseInt(addBatchCountInput.value, 10);
      if (count > 50) {
        message.warning('数量不能大于50');
        return false;
      }
      if (!addRoomLiveNum.value) {
        message.warning('请选择入住人数');
        return false;
      }
      addRoomBatch(curTreeNodeKey, startNum, count);
    } else {
      if (!addNameInput.value) {
        message.warning('请输入房间名称');
        return false;
      }
      if (!addRoomLiveNum.value) {
        message.warning('请选择入住人数');
        return false;
      }
      addRoom(curTreeNodeKey, addNameInput.value);
    }
  }
  addNameInput.value = '';
  addRoomLiveNum.value = null;
  addRoomCustomLabels.forEach(label => {
    label.value = null;
  });
  return true;
}

function addModalCancel() {
  isShowSpaceAdd.value = false;
  addNameInput.value = '';
  addRoomLiveNum.value = null;
  addRoomCustomLabels.forEach(label => {
    label.value = null;
  });
}

async function editModalConfirm() {
  if (curSpaceOptionType.value === 1 || curSpaceOptionType.value === 2) {
    await editNodeName(curTreeNodeKey, editNameInput.value);
  } else if (curSpaceOptionType.value === 3) {
    const labelIds: string[] = [];
    editRoomCustomLabels.forEach(item => {
      if (item.value) labelIds.push(item.value);
    });
    await fetchEditSpace({
      spaceId: curChooseCardId.value,
      spaceName: editNameInput.value,
      guestsNum: editRoomLiveNum.value || 8,
      labelIds
    });
    await getAllSpaceData();
  }
}

async function delModalConfirm() {
  if (curSpaceOptionType.value === 1 || curSpaceOptionType.value === 2) {
    await deleteNode(curTreeNodeKey);
  } else if (curSpaceOptionType.value === 3) {
    isShowRoomDetail.value = false;
    const spaceId = curChooseCardId.value;
    curChooseCardId.value = '';
    await fetchDeleteSpace(spaceId);
    await getAllSpaceData();
  }
}

async function addBuilding(name: string) {
  if (treeData.length >= 999) {
    message.warning('楼栋数量不能大于999');
    return;
  }
  await fetchAddSpace({
    projectType: '02',
    projectId: projectStore.curId,
    pid: '0',
    spaceLevel: 2,
    spaceName: name,
    cid: '0'
  });
  await getAllSpaceData();
}

async function addFloor(treeNodeKey: number | undefined, name: string) {
  if (!treeNodeKey || treeNodeKey > treeData.length) return;
  const index = treeNodeKey - 1;
  if (treeData[index].children) {
    if (treeData[index].children!.length >= 999) {
      message.warning('楼层数量不能大于999');
      return;
    }
  }
  await fetchAddSpace({
    projectType: '02',
    projectId: projectStore.curId,
    pid: treeData[index].spaceId as string,
    spaceLevel: 3,
    spaceName: name,
    cid: '0'
  });
  await getAllSpaceData();
}
async function addRoom(treeNodeKey: number | undefined, name: string) {
  if (!treeNodeKey) return;
  const buildingIndex = Math.floor(treeNodeKey / 1000) - 1;
  const floorIndex = (treeNodeKey % 1000) - 1;
  const labelIds: string[] = [];
  addRoomCustomLabels.forEach(label => {
    if (label.value) labelIds.push(label.value);
  });
  await fetchAddSpace({
    projectType: '02',
    projectId: projectStore.curId,
    pid: treeData[buildingIndex].children![floorIndex].spaceId as string,
    spaceLevel: 4,
    spaceName: name,
    cid: '0',
    guestsNum: addRoomLiveNum.value || 8,
    labelIds
  });
  await getAllSpaceData();
}

async function addRoomBatch(treeNodeKey: number | undefined, startNumber: string, count: number) {
  if (!treeNodeKey) return;
  const buildingIndex = Math.floor(treeNodeKey / 1000) - 1;
  const floorIndex = (treeNodeKey % 1000) - 1;
  const labelIds: string[] = [];
  addRoomCustomLabels.forEach(label => {
    if (label.value) labelIds.push(label.value);
  });
  message.info('正在批量添加，请稍候');
  await fetchAddSpaceBatch({
    projectType: '02',
    projectId: projectStore.curId,
    pid: treeData[buildingIndex].children![floorIndex].spaceId as string,
    spaceLevel: 4,
    cid: '0',
    guestsNum: addRoomLiveNum.value || 8,
    num: count,
    startNum: startNumber,
    labelIds
  });
  await getAllSpaceData();
}

async function editNodeName(treeNodeKey: number, name: string) {
  if (!treeNodeKey || !name) return;
  if (treeNodeKey > 1000) {
    const buildingIndex = Math.floor(treeNodeKey / 1000) - 1;
    const floorIndex = (treeNodeKey % 1000) - 1;
    const spaceId = treeData[buildingIndex].children![floorIndex].spaceId as string;
    await fetchEditSpace({
      spaceId,
      spaceName: name
    });
    await getAllSpaceData();
  } else {
    const buildingIndex = treeNodeKey - 1;
    const spaceId = treeData[buildingIndex].spaceId as string;
    await fetchEditSpace({
      spaceId,
      spaceName: name
    });
    await getAllSpaceData();
  }
}

async function deleteNode(treeNodeKey: number) {
  if (!treeNodeKey) return;
  if (treeNodeKey > 1000) {
    const buildingIndex = Math.floor(treeNodeKey / 1000) - 1;
    const floorIndex = (treeNodeKey % 1000) - 1;
    const spaceId = treeData[buildingIndex].children![floorIndex].spaceId as string;
    await fetchDeleteSpace(spaceId);
    curTreeNodeKey = 0;
    await getAllSpaceData();
  } else {
    const buildingIndex = treeNodeKey - 1;
    const spaceId = treeData[buildingIndex].spaceId as string;
    await fetchDeleteSpace(spaceId);
    curTreeNodeKey = 0;
    await getAllSpaceData();
  }
}

function onCardClick(e: { id: string }) {
  curChooseCardId.value = e.id;
  isShowRoomDetail.value = true;
}
function onFilterButtonClick(index: number) {
  cardFilterButtons.forEach(item => {
    item.isChoose = false;
  });
  cardFilterButtons[index].isChoose = !cardFilterButtons[index].isChoose;
  updateCardView();
}

function onRoomEditClick() {
  editNameInput.value = curChooseCardDetail.value.roomName || '';
  editRoomLiveNum.value = curChooseCardDetail.value.liveMax || 8;
  const idArr = curChooseCardDetail.value.labelIds;
  if (idArr) {
    editRoomCustomLabels.forEach(item => {
      item.value = null;
      const curOpt = item.option.find(opt => {
        return idArr.includes(opt.value);
      });
      if (curOpt) {
        item.value = curOpt.value;
      }
    });
  }
  openEditModal(3);
}

function onRoomDelClick() {
  curDelNodeName.value = curChooseCardDetail.value.roomName;
  openDelModal(3);
}

function onCardPageChange() {
  updateCardView();
}

function onFilterUpdate() {
  setTimeout(() => {
    updateCardView();
  }, 200);
}

async function updateCardView() {
  cardData.splice(0, cardData.length);
  if (curTreeNodeKey2ShowCard <= 0) return;
  let spaceId;
  if (curTreeNodeKey2ShowCard > 1000) {
    const buildingIndex = Math.floor(curTreeNodeKey2ShowCard / 1000) - 1;
    const floorIndex = (curTreeNodeKey2ShowCard % 1000) - 1;
    spaceId = treeData[buildingIndex].children![floorIndex].spaceId as string;
  } else {
    const buildingIndex = curTreeNodeKey2ShowCard - 1;
    spaceId = treeData[buildingIndex].spaceId as string;
  }
  if (spaceId) {
    cardData.splice(0, cardData.length);
    const option = cardFilterButtons.find(item => {
      return item.isChoose;
    });
    const type = option?.value || 0;

    const labelIds: string[] = [];
    customFilterLabels.forEach(label => {
      if (label.value) labelIds.push(label.value);
    });

    const res = await fetchAllRoomBySpace({
      projectId: projectStore.curId,
      spaceId,
      type,
      currentPage: curCardPageIndex.value,
      pageSize: 30,
      labelIds
    });
    curCardPageTotal.value = res.data?.totalPages || 1;
    const list = res.data?.content;
    if (list) {
      const nowVal = new Date().valueOf();
      list.forEach(item => {
        const memArr: roomMember[] = [];
        let roomTimeType = 0;
        item.spaceUserList.forEach(user => {
          let limitType = 0;
          if (user.endTime) {
            const dateVal = new Date(user.endTime).valueOf();
            if (nowVal > dateVal) limitType = 2;
            else if (nowVal > dateVal - 604800000) limitType = 1;
          }
          memArr.push({
            userId: user.userId,
            name: user.nickName,
            startDate: dayjs(user.startTime).format('YYYY-MM-DD HH:mm:ss'),
            limitDate: dayjs(user.endTime).format('YYYY-MM-DD HH:mm:ss'),
            timeLimitType: limitType,
            phoneNumber: user.mobilePhone
          });
          if (limitType > roomTimeType) roomTimeType = limitType;
        });

        let deviceId = '';
        if (item.deviceList && item.deviceList.length > 0) {
          deviceId = item.deviceList[0].deviceId;
        }

        cardData.push({
          roomId: item.spaceId,
          roomName: item.spaceName,
          liveMax: item.guestsNum,
          liveNum: item.spaceUserList.length || 0,
          haveDevice: item.deviceList !== null && item.deviceList.length > 0,
          isLocked: item.isLock === 1,
          timeLimitType: roomTimeType,
          lockBattery: 100, // todo
          members: memArr,
          labelIds: item.labelIds,
          deviceId
        });
      });
    }
  }
}

async function liveBusinessConfirm() {
  if (curLiveBusinessType.value === 1) {
    if (curMembersAddingTemp.length === 0) return true;
    const arr = [];
    for (let i = 0; i < curMembersAddingTemp.length; i += 1) {
      if (!curMembersAddingTemp[i].name) {
        message.warning('请输入名称');
        return false;
      }
      if (!curMembersAddingTemp[i].phoneNumber) {
        message.warning('请输入手机号码');
        return false;
      }
      if (!curMembersAddingTemp[i].startDate || !curMembersAddingTemp[i].limitDate) {
        message.warning('请检查日期是否正确');
        return false;
      }
      const start = new Date(curMembersAddingTemp[i].startDate!).valueOf();
      const end = new Date(curMembersAddingTemp[i].limitDate!).valueOf();
      if (start >= end) {
        message.warning('到期时间必须大于入住时间');
        return false;
      }
      arr.push({
        nickName: curMembersAddingTemp[i].name,
        startTime: curMembersAddingTemp[i].startDate!,
        endTime: curMembersAddingTemp[i].limitDate!,
        mobilePhone: curMembersAddingTemp[i].phoneNumber!
      });
    }
    isShowHandleLiveIn.value = false;
    curMembersAddingTemp.splice(0, curMembersAddingTemp.length);
    await fetchMembersCheckIn(curChooseCardId.value, arr);
    await updateCurRoomMembers();
  } else if (curLiveBusinessType.value === 2) {
    if (curMembersExtendTemp.length === 0) return true;
    const arr = [];
    for (let i = 0; i < curMembersExtendTemp.length; i += 1) {
      if (!curMembersExtendTemp[i].startDate || !curMembersExtendTemp[i].limitDate) {
        message.warning('请检查日期是否正确');
        return false;
      }
      const start = new Date(curMembersExtendTemp[i].startDate!).valueOf();
      const end = new Date(curMembersExtendTemp[i].limitDate!).valueOf();
      if (start >= end) {
        message.warning('到期时间必须大于入住时间');
        return false;
      }
      arr.push({
        userId: curMembersExtendTemp[i].userId,
        startTime: curMembersExtendTemp[i].startDate!,
        endTime: curMembersExtendTemp[i].limitDate!
      });
    }
    isShowHandleLiveIn.value = false;
    curMembersExtendTemp.splice(0, curMembersExtendTemp.length);
    await fetchMembersExtend(curChooseCardId.value, arr);
    await updateCurRoomMembers();
  }
  return true;
}

function liveBusinessCancel() {
  isShowHandleLiveIn.value = false;
  if (curLiveBusinessType.value === 1) {
    curMembersAddingTemp.splice(0, curMembersAddingTemp.length);
  } else if (curLiveBusinessType.value === 2) {
    curMembersExtendTemp.splice(0, curMembersExtendTemp.length);
  }
}

function onAddMemberClick() {
  curMembersAddingTemp.push({
    name: '',
    userId: `ADD${new Date().valueOf()}`,
    startDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    limitDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    isSync: -1
  });
}

async function onCheckOutMembers(list: { userId: string }[]) {
  await fetchMembersCheckOut(curChooseCardId.value, list);
  await updateCurRoomMembers();
}

async function onAllMemberCheckOut() {
  const arr: { userId: string }[] = [];
  for (let i = 0; i < cardData.length; i += 1) {
    if (cardData[i].roomId === curChooseCardId.value) {
      if (!cardData[i].members || cardData[i].members?.length === 0) return;
      cardData[i].members!.forEach(item => {
        arr.push({ userId: item.userId });
      });
      break;
    }
  }
  if (arr.length === 0) return;
  await fetchMembersCheckOut(curChooseCardId.value, arr);
  await updateCurRoomMembers();
}

async function updateCurRoomMembers() {
  const res = await fetchMembersBySpace(curChooseCardId.value);
  if (!res.data) return;
  const list = res.data;
  for (let i = 0; i < cardData.length; i += 1) {
    if (cardData[i].roomId === curChooseCardId.value) {
      const nowVal = new Date().valueOf();
      const memArr: roomMember[] = [];

      list.forEach(user => {
        let limitType = 0;
        if (user.endTime) {
          const dateVal = new Date(user.endTime).valueOf();
          if (dateVal > nowVal) limitType = 2;
          else if (dateVal > nowVal - 604800000) limitType = 1;
        }
        memArr.push({
          userId: user.userId,
          name: user.nickName,
          startDate: user.startTime,
          limitDate: user.endTime,
          timeLimitType: limitType,
          phoneNumber: user.mobilePhone,
          isSync: user.isSync
        });
      });

      cardData[i].members = memArr;
      return;
    }
  }
}

async function getAllSpaceData() {
  const res = await fetchSpaceForProject(projectStore.curId);
  if (!res.data) return;

  const tree = [] as TreeOption[];
  const srcArr = res.data;

  let buildingKey = 1;
  for (let i = 0; i < srcArr.length; i += 1) {
    if (srcArr[i].spaceLevel === 2) {
      tree.push({
        label: srcArr[i].spaceName,
        key: buildingKey,
        spaceId: srcArr[i].spaceId
      });
      buildingKey += 1;
    }
  }
  for (let i = 0; i < srcArr.length; i += 1) {
    if (srcArr[i].spaceLevel === 3) {
      for (let j = 0; j < tree.length; j += 1) {
        if (srcArr[i].pid === tree[j].spaceId) {
          // eslint-disable-next-line max-depth
          if (tree[j].children) {
            tree[j].children!.push({
              label: srcArr[i].spaceName,
              key: (tree[j].key! as number) * 1000 + tree[j].children!.length + 1,
              spaceId: srcArr[i].spaceId
            });
          } else {
            tree[j].children = [
              {
                label: srcArr[i].spaceName,
                key: (tree[j].key! as number) * 1000 + 1,
                spaceId: srcArr[i].spaceId
              }
            ];
          }
        }
      }
    }
  }
  treeData.splice(0, treeData.length);
  tree.forEach(item => treeData.push(item));

  await updateCardView();
}

onMounted(() => {
  getAllSpaceData();
  updateCustomLabels();
});
</script>
