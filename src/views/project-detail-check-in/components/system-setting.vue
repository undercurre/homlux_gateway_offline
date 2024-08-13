<template>
  <div class="wh-full">
    <n-tabs type="line" animated placement="top">
      <n-tab-pane name="tab1" tab="管理员密码设置">
        <n-split direction="horizontal" style="height: 620px" disabled :max="0.35" :min="0.65" :default-size="0.35">
          <template #1>
            <n-split direction="vertical" disabled :max="0.4" :min="0.6" :default-size="0.4">
              <!-- ********************************************************  -->
              <template #1>
                <div class="wh-full p-6px">
                  <n-card class="wh-full">
                    <n-ellipsis class="font-500" style="font-size: 18px">找回管理员密码</n-ellipsis>
                    <div class="flex-y-center w-full mt-10px">
                      <n-select
                        v-model:value="buildingSelectVal1"
                        class="max-w-200px"
                        placeholder="请选择楼栋"
                        :options="buildingOption"
                        :disabled="!isEnableAdminPassword"
                        @update-value="onBuildingSelect1"
                      />
                      <n-ellipsis class="ml-10px" style="font-size: 16px">({{ adminCodeTip }})</n-ellipsis>
                    </div>
                    <div class="flex-y-center w-full mt-10px">
                      <n-button
                        class="mr-6px"
                        :disabled="!isEnableAdminPassword || timerCnt > 0"
                        @click="onVCodeClick(2)"
                      >
                        获取验证码{{ timerCnt <= 0 ? '' : `(${timerCnt}s)` }}
                      </n-button>
                      <n-input
                        v-model:value="vCodeInput1"
                        class="max-w-180px"
                        :allow-input="onlyAllowNumber"
                        type="text"
                        placeholder="请输入验证码"
                        :disabled="!isEnableAdminPassword"
                      />
                    </div>
                    <n-button
                      type="primary"
                      class="mt-20px w-full"
                      :disabled="!isEnableAdminPassword"
                      @click="onFindPassword"
                    >
                      找回管理密码
                    </n-button>
                  </n-card>
                </div>
              </template>
              <!-- ********************************************************  -->
              <template #2>
                <div class="wh-full p-6px">
                  <n-card class="wh-full">
                    <n-ellipsis class="font-500" style="font-size: 18px">创建新的管理员密码（8位）</n-ellipsis>
                    <n-select
                      v-model:value="buildingSelectVal2"
                      class="max-w-200px mt-10px"
                      placeholder="请选择楼栋"
                      :options="buildingOption"
                      :disabled="!isEnableAdminPassword"
                    />
                    <div class="flex-y-center w-full mt-10px">
                      <n-button
                        class="mr-6px"
                        :disabled="!isEnableAdminPassword || timerCnt > 0"
                        @click="onVCodeClick(1)"
                      >
                        获取验证码{{ timerCnt <= 0 ? '' : `(${timerCnt}s)` }}
                      </n-button>
                      <n-input
                        v-model:value="vCodeInput2"
                        class="max-w-180px"
                        :allow-input="onlyAllowNumber"
                        type="text"
                        placeholder="请输入验证码"
                        :disabled="!isEnableAdminPassword"
                      />
                    </div>
                    <n-form
                      class="mt-10px"
                      :model="adminPassword"
                      label-placement="left"
                      :rules="passwordRules"
                      label-width="auto"
                      :style="{
                        maxWidth: '284px'
                      }"
                    >
                      <n-form-item label="密码" path="input1">
                        <n-input
                          v-model:value="adminPassword.input1"
                          :allow-input="onlyAllowNumber"
                          placeholder="请输入8位数字密码"
                          :maxlength="8"
                          :disabled="!isEnableAdminPassword"
                          type="password"
                          show-password-on="mousedown"
                        />
                      </n-form-item>
                      <n-form-item label="再次输入密码" path="input2">
                        <n-input
                          v-model:value="adminPassword.input2"
                          :allow-input="onlyAllowNumber"
                          placeholder="请再次输入密码"
                          :maxlength="8"
                          :disabled="!isEnableAdminPassword"
                          type="password"
                          show-password-on="mousedown"
                        />
                      </n-form-item>
                    </n-form>
                    <n-button
                      type="primary"
                      class="mt-10px w-full"
                      :disabled="!isEnableAdminPassword"
                      @click="onCreateNewPassword"
                    >
                      下发密码
                    </n-button>
                  </n-card>
                </div>
              </template>
            </n-split>
          </template>
          <!-- ********************************************************  -->
          <template #2>
            <div class="wh-full p-6px">
              <n-card class="wh-full">
                <n-ellipsis class="font-500" style="font-size: 18px">管理员密码下发记录</n-ellipsis>
                <n-data-table
                  class="mt-10px"
                  :bordered="false"
                  :max-height="420"
                  :columns="passwordLogColumns"
                  :data="curPasswordLogData"
                  :pagination="pagination"
                  @update-page="onPageChange"
                />
              </n-card>
            </div>
          </template>
        </n-split>
      </n-tab-pane>
      <n-tab-pane name="tab2" tab="房间设置">
        <span class="font-500" style="font-size: 16px">
          你可以自定义10条房间属性，新增的房间属性将会在“新建房间”、“修改房间”、“入住管理”页面展示。
        </span>
        <n-data-table
          class="mt-10px"
          :bordered="false"
          :max-height="460"
          :columns="customRoomAttrColumns"
          :data="roomAttrData"
        />
        <n-button class="w-full mt-20px" type="primary" @click="onNewAttrClick">+新增</n-button>
      </n-tab-pane>
    </n-tabs>

    <n-modal
      v-model:show="isShowAttrDel"
      class="w-600px h-140px"
      :mask-closable="false"
      preset="dialog"
      :title="`确定要删除${curChooseAttrName}吗？`"
      positive-text="确认"
      negative-text="取消"
      @positive-click="delAttrConfirm"
      @negative-click="isShowAttrDel = false"
    >
      <div class="h-20px"></div>
    </n-modal>

    <n-modal
      v-model:show="isShowAttrEdit"
      :mask-closable="false"
      preset="dialog"
      title="编辑"
      :show-icon="false"
      positive-text="确认"
      negative-text="取消"
      @positive-click="editAttrConfirm"
      @negative-click="editAttrCancel"
    >
      <div class="w-full h-330px mt-20px">
        <n-form-item label="属性名称：" label-placement="left">
          <n-input
            v-model:value="curChooseAttrName"
            :allow-input="onlyAllowChar"
            placeholder="请输入"
            :maxlength="8"
            clearable
            show-count
          />
        </n-form-item>
        <span style="font-size: 14px">属性值：</span>
        <n-dynamic-input
          v-model:value="curChooseAttrValues"
          :on-create="onCreateDInput"
          class="mt-10px"
          :min="1"
          :max="5"
        >
          <template #default="{ value }">
            <div class="flex w-full">
              <n-input
                v-model:value="value.attr"
                type="text"
                placeholder="请输入值(最长8个字符)"
                :maxlength="8"
                :allow-input="onlyAllowChar"
                clearable
                show-count
              />
            </div>
          </template>
        </n-dynamic-input>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="tsx">
import { computed, h, onMounted, onUnmounted, reactive, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { useMessage, NButton, NTag, NCheckbox } from 'naive-ui';
import {
  fetchLabelsByProject,
  fetchAddLabel,
  fetchDeleteLabel,
  fetchEnableLabel,
  fetchUpdateLabel,
  fetchSpaceForProject,
  fetchBuildingAdminPassword,
  fetchVerificationCode,
  fetchNewAdminPassword,
  fetchFindAdminPassword,
  fetchPasswordLog
} from '@/service';
import { useAuthStore, useProjectStore } from '@/store';

const auth = useAuthStore();
const projectStore = useProjectStore();
const message = useMessage();

/**
 * ************************************************************
 */
const buildingSelectVal1 = ref(null);
const adminCodeTip = ref('--');
const vCodeInput1 = ref('');

const buildingSelectVal2 = ref(null);
const vCodeInput2 = ref('');
const adminPassword = ref({
  input1: '',
  input2: ''
});

const passwordRules = {
  input1: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入管理员密码'
  },
  input2: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请再次输入管理员密码'
  }
};

const buildingOption = reactive<{ label: string; value: string }[]>([]);

const isEnableAdminPassword = computed((): boolean => {
  return auth.roleLevel === 6;
});

async function onBuildingSelect1() {
  if (!buildingSelectVal1.value) return;
  const res = await fetchBuildingAdminPassword(buildingSelectVal1.value);
  adminCodeTip.value = res.data?.password || '--';
}

let codeTimer: NodeJS.Timeout | null = null;
const timerCnt = ref<number>(0);

async function onVCodeClick(type: number) {
  await fetchVerificationCode(type);

  timerCnt.value = 60;
  codeTimer = setInterval(() => {
    timerCnt.value -= 1;
    if (timerCnt.value <= 0) {
      if (codeTimer) {
        clearInterval(codeTimer);
        codeTimer = null;
      }
    }
  }, 1000);
}

async function onCreateNewPassword() {
  if (!buildingSelectVal2.value) {
    message.warning('请选择楼栋');
    return;
  }
  if (!vCodeInput2.value) {
    message.warning('请输入手机验证码');
    return;
  }
  if (!adminPassword.value.input1) {
    message.warning('请输入新密码');
    return;
  }
  if (adminPassword.value.input1.length !== 8) {
    message.warning('请输入8位密码');
    return;
  }
  if (!adminPassword.value.input2) {
    message.warning('请再次输入密码');
    return;
  }
  if (adminPassword.value.input1 !== adminPassword.value.input2) {
    message.warning('两次输入密码不一致，请检查');
    return;
  }
  const res = await fetchNewAdminPassword({
    spaceId: buildingSelectVal2.value,
    password: adminPassword.value.input1,
    captcha: vCodeInput2.value
  });
  if (res.error?.code === 0) {
    message.success('创建密码成功');
  }
}

async function onFindPassword() {
  if (!buildingSelectVal1.value) {
    message.warning('请选择楼栋');
    return;
  }
  if (!vCodeInput1.value) {
    message.warning('请输入手机验证码');
    return;
  }
  const res = await fetchFindAdminPassword({
    spaceId: buildingSelectVal1.value,
    captcha: vCodeInput1.value
  });
  adminCodeTip.value = res.data?.password || '--';
}

/**
 * ************************************************************
 */
const curPasswordLogData = reactive<passwordLogRowData[]>([]);

const pagination = ref({
  pageSize: 8
});

type passwordLogRowData = {
  building: string;
  adminPassword: string;
  adminName: string;
  adminPhone: string;
  date: string;
};
const passwordLogColumns: DataTableColumns<passwordLogRowData> = [
  {
    title: '楼栋',
    key: 'building',
    width: 80
  },
  {
    title: '管理员密码',
    key: 'adminPassword',
    width: 120
  },
  {
    title: '创建管理员',
    key: 'adminName'
  },
  {
    title: '创建手机',
    key: 'adminPhone'
  },
  {
    title: '创建时间',
    key: 'date'
  }
];

const logPageSize = 40;
const now = new Date();
let curLogTimestamp = now.valueOf();
const lastYear = new Date(now.setFullYear(now.getFullYear() - 1)).valueOf();
let isLogEnd = false;

async function getPasswordLog() {
  if (isLogEnd) return;
  const res = await fetchPasswordLog({
    projectId: projectStore.curId,
    count: logPageSize,
    reportTs: curLogTimestamp
  });
  if (res.data) {
    // eslint-disable-next-line require-atomic-updates
    if (res.data.length < logPageSize) isLogEnd = true;
    res.data.forEach(item => {
      if (item.reportTs < lastYear) {
        isLogEnd = true;
        return;
      }
      if (item.reportTs < curLogTimestamp) curLogTimestamp = item.reportTs;
      curPasswordLogData.push({
        building: item.spaceName,
        adminPassword: item.password,
        adminName: item.userName,
        adminPhone: item.mobilePhone,
        date: item.reportAt
      });
    });
  }
}

function onPageChange(page: number) {
  const shang = Math.floor(curPasswordLogData.length / pagination.value.pageSize);
  const yu = curPasswordLogData.length % pagination.value.pageSize;
  if ((page === shang && yu === 0) || (page > shang && yu > 0)) {
    getPasswordLog();
  }
}

/**
 * ************************************************************
 */
const isShowAttrDel = ref(false);
const isShowAttrEdit = ref(false);
const curChooseAttrId = ref('');
const curChooseAttrName = ref('');
const curChooseAttrValues = ref<{ id: string; attr: string }[]>([{ id: '', attr: '' }]);

function onCreateDInput() {
  return { id: '', attr: '' };
}

const roomAttrData = reactive<roomAttrRowData[]>([]);

type roomAttrRowData = {
  attrId: string;
  isEnable: boolean;
  attrName: string;
  attrValues: { id: string; value: string }[];
};

const customRoomAttrColumns: DataTableColumns<roomAttrRowData> = [
  {
    title: '是否启用',
    key: 'isEnable',
    width: 80,
    render(row) {
      return h(NCheckbox, {
        style: {
          'margin-left': '14px'
        },
        checked: row.isEnable,
        onClick: async () => {
          await fetchEnableLabel(projectStore.curId, row.attrId, !row.isEnable);
          row.isEnable = !row.isEnable;
        }
      });
    }
  },
  {
    title: '属性名称',
    key: 'attrName',
    width: 180
  },
  {
    title: '值',
    key: 'attrValues',
    render(row) {
      return row.attrValues.map(item => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            bordered: false
          },
          {
            default: () => item.value
          }
        );
      });
    }
  },
  {
    title: '操作',
    key: 'none',
    width: 180,
    render(row) {
      const buttons = [
        { key: 'edit', label: '编辑', type: 'primary' },
        { key: 'delete', label: '删除', type: 'error' }
      ];
      return buttons.map(item => {
        return h(
          NButton,
          {
            style: {
              marginLeft: '10px'
            },
            type: item.type,
            onClick: () => {
              curChooseAttrId.value = row.attrId;
              curChooseAttrName.value = row.attrName;
              curChooseAttrValues.value = row.attrValues.map(label => {
                return { id: label.id, attr: label.value };
              });
              if (item.key === 'delete') {
                isShowAttrDel.value = true;
              } else if (item.key === 'edit') {
                isShowAttrEdit.value = true;
              }
            }
          },
          {
            default: () => item.label
          }
        );
      });
    }
  }
];

function onNewAttrClick() {
  curChooseAttrId.value = '';
  curChooseAttrName.value = '';
  curChooseAttrValues.value = [{ id: '', attr: '' }];
  isShowAttrEdit.value = true;
}

async function delAttrConfirm() {
  await fetchDeleteLabel(projectStore.curId, curChooseAttrId.value);
  await updateLabels();
}

async function editAttrConfirm() {
  if (!curChooseAttrName.value) {
    message.warning('请输入标签名称');
    return false;
  }
  if (!curChooseAttrValues.value || curChooseAttrValues.value.length === 0) {
    message.warning('请输入标签值');
    return false;
  }
  for (let i = 0; i < curChooseAttrValues.value.length; i += 1) {
    if (!curChooseAttrValues.value[i].attr) {
      message.warning('请输入标签值');
      return false;
    }
  }
  if (curChooseAttrId.value) {
    const roomAttrItem = roomAttrData.find(item => item.attrId === curChooseAttrId.value);
    const params = {
      projectId: projectStore.curId,
      labelId: curChooseAttrId.value,
      property: '',
      isEnabled: roomAttrItem?.isEnable ? 1 : 0,
      childLabelList: [] as any[]
    };
    curChooseAttrValues.value.forEach(item => {
      const child = {
        property: item.attr,
        isEnabled: 1,
        childLabelList: []
      };
      if (item.id) Object.assign(child, { labelId: item.id });
      params.childLabelList.push(child);
    });
    await fetchUpdateLabel(params);
  } else {
    await fetchAddLabel({
      projectId: projectStore.curId,
      property: curChooseAttrName.value,
      propertyValue: curChooseAttrValues.value
        .map(item => {
          return item.attr;
        })
        .join('/'),
      isEnabled: 1
    });
  }
  await updateLabels();
  return true;
}

function editAttrCancel() {
  isShowAttrEdit.value = false;
  curChooseAttrId.value = '';
  curChooseAttrName.value = '';
  curChooseAttrValues.value = [{ id: '', attr: '' }];
}

function onlyAllowNumber(value: string) {
  return !value || /^\d+$/.test(value);
}

function onlyAllowChar(value: string) {
  return !value || /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value);
}

// { attrId: '001', isEnable: false, attrName: 'myAttr1', attrValues: ['aaa', 'bbb'] }
async function updateLabels() {
  const res = await fetchLabelsByProject(projectStore.curId);
  if (!res.data) return;
  const list = res.data;
  roomAttrData.splice(0, roomAttrData.length);
  list.forEach(item => {
    const attrValues: { id: string; value: string }[] = [];
    item.childLabelList.forEach(child => {
      attrValues.push({
        id: child.labelId,
        value: child.property
      });
    });
    roomAttrData.push({
      attrId: item.labelId,
      isEnable: item.isEnabled === 1,
      attrName: item.property,
      attrValues
    });
  });
}

async function getBuildings() {
  const res = await fetchSpaceForProject(projectStore.curId);
  if (!res.data) return;
  const srcArr = res.data;
  buildingOption.splice(0, buildingOption.length);
  for (let i = 0; i < srcArr.length; i += 1) {
    if (srcArr[i].spaceLevel === 2) {
      buildingOption.push({
        label: srcArr[i].spaceName,
        value: srcArr[i].spaceId
      });
    }
  }
}

onMounted(() => {
  getBuildings();
  getPasswordLog();
  updateLabels();
});

onUnmounted(() => {
  if (codeTimer) {
    clearInterval(codeTimer);
    codeTimer = null;
  }
});
</script>
