<template>
  <n-drawer v-model:show="modalVisible" display-directive="show" title="添加成员" width="70%" :mask-closable="false">
    <n-drawer-content closable>
      <template #header>添加成员</template>
      <template #footer>
        <n-button class="w-72px mr-10px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" :loading="submitLoading" type="primary" @click="handleSubmit">确定</n-button>
      </template>
      <n-grid class="w-full h-full" :cols="24">
        <n-grid-item :span="15">
          <n-table :single-line="false">
            <thead>
              <tr>
                <th class="w-200px">
                  <div class="text-center">
                    手机号
                    <span class="n-form-item-label__asterisk text-#F5222D">&nbsp;*</span>
                  </div>
                </th>
                <th class="w-200px">
                  <div class="text-center">
                    角色类型
                    <span class="n-form-item-label__asterisk text-#F5222D">&nbsp;*</span>
                  </div>
                </th>
                <th v-show="formModels.length > 1" class="w-20px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in formModels" :key="item.formId">
                <td>
                  <n-form ref="formRef" :rules="rules" :model="item">
                    <n-form-item path="mobilePhone" maxlength="11" show-count>
                      <n-input v-model:value="item.mobilePhone" clearable :on-change="handleInputChange"></n-input>
                    </n-form-item>
                  </n-form>
                </td>
                <td>
                  <n-form ref="formRef" :rules="rules" :model="item">
                    <n-form-item path="roleLevel">
                      <n-select
                        v-model:value="item.roleLevel"
                        :options="showRoleOptions"
                        label-field="roleName"
                        value-field="roleLevel"
                        clearable
                      />
                    </n-form-item>
                  </n-form>
                </td>
                <td v-show="formModels.length > 1">
                  <div @click="handleMinusForm(item.formId)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 32 32">
                      <path
                        fill="#f40"
                        d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-6 10v2h12v-2z"
                      />
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </n-table>
          <NButton class="mr-10px mt-20px" type="primary" size="small" @click="handleAddDefaultMember2Form()">
            <icon-ic-round-plus class="text-20px" />
          </NButton>
        </n-grid-item>
        <n-grid-item :span="1" class="flex justify-center p-10px">
          <div class="border-l-1 border-l-gray/20"></div>
        </n-grid-item>
        <n-grid-item
          :span="8"
          label="空间权限"
          class="flex flex-wrap justify-start"
          :class="{ 'flex-col': spaceTreeOptions.length !== 0 }"
        >
          <div class="w-100% flex-col">
            <span>空间权限</span>
            <span class="text-12px text-gray/70">仅对项目使用者生效</span>
          </div>
          <div class="w-100% flex-1">
            <n-checkbox
              v-if="spaceTreeOptions.length !== 0"
              :checked="allCheck"
              class="mx-28px my-10px"
              :on-update:checked="selectAllSpace"
            >
              全选
            </n-checkbox>
            <n-tree
              ref="spaceTree"
              bleock-line
              :data="spaceTreeOptions"
              :checked-keys="selectSpaceList"
              key-field="spaceId"
              label-field="spaceName"
              expand-on-click
              cascade
              checkable
              multiple
              @update:checked-keys="handleSpaceAuthUpdate"
            />
          </div>
        </n-grid-item>
      </n-grid>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { NTree } from 'naive-ui';
import type { FormInst, FormItemRule, SelectOption, TreeOption, FormValidationError } from 'naive-ui';
import { buildSpaceTree, createRequiredFormRule } from '@/utils';
import { useAuthStore, useProjectStore } from '~/src/store';
import { queryProjectByUser, fetchBatchAddProjectMember } from '~/src/service';
import { REGEXP_PHONE } from '~/src/config/regexp';

const auth = useAuthStore();
const projectStore = useProjectStore();

const formRef = ref<Array<HTMLElement & FormInst>>();

const { roleLevel, isSuperAdmin } = auth;

const projectOptions = ref<ApiUser.AuthProjectItem[]>([]);

const spaceTreeOptions = ref<TreeOption[]>([]);

const selectSpaceList = ref<string[]>([]); // 勾选的空间权限列表

const allCheck = ref(false);

type FormRuleRequiredKey = keyof { mobilePhone: string; roleLevel: number };

const formModels = ref<FormModelInList[]>([]);

// 表单校验规则
const rules: Record<FormRuleRequiredKey, FormItemRule | FormItemRule[]> = {
  roleLevel: createRequiredFormRule('请选择角色类型'),
  mobilePhone: [
    createRequiredFormRule('请输入正确的手机号码'),
    { pattern: REGEXP_PHONE, message: '手机号码格式错误', trigger: 'input' },
    {
      validator: (rule, value) => {
        const curIndex = formModels.value.findIndex(model => model.mobilePhone === value);
        if (curIndex !== -1 && formModels.value[curIndex].phoneStatus === 'error') {
          return Promise.reject(rule.message);
        }
        return Promise.resolve();
      },
      trigger: ['blur'],
      message: '该手机号不支持添加为成员/该手机号已是项目成员'
    }
  ]
};

interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  curLevel: number;
  roleOptions: SelectOption[];
  hadData: ApiProject.Member[];
}

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  editData: null,
  roleOptions: () => []
});

const showRoleOptions = computed(() => {
  return props.roleOptions.filter(item => {
    if (isSuperAdmin) {
      return (item.roleLevel as number) > 1;
    }

    return (item.roleLevel as number) > roleLevel;
  });
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

// const formRef = ref<HTMLElement & FormInst>();

type FormModel = ApiProject.UpdateProjectMemberParams;

type FormModelInList = FormModel & {
  formId: string;
  phoneStatus: 'success' | 'warning' | 'error';
};

const closeModal = () => {
  modalVisible.value = false;
  formModels.value = [];
};

function selectAllSpace(checked: boolean) {
  if (checked) {
    selectSpaceList.value = spaceTreeOptions.value.map(item => item.spaceId) as string[];
  } else {
    selectSpaceList.value = [];
  }
  allCheck.value = checked;
}

function createDefaultFormModel(): FormModelInList {
  return {
    formId: new Date().getTime().toString(),
    projectId: projectStore.curId,
    phoneStatus: 'success',
    userId: null,
    userName: '',
    mobilePhone: '',
    roleLevel: null,
    roleId: '',
    projectSpace: {} as ApiUser.AuthProjectItem
  };
}
const projectInfo = ref<ApiUser.AuthProjectItem>();

async function handleUpdateFormModel() {
  formModels.value = [];
  formModels.value.push(createDefaultFormModel());
  projectInfo.value = projectOptions.value.find(
    item => item.projectId === projectStore.curId
  ) as ApiUser.AuthProjectItem;
  if (projectInfo.value) spaceTreeOptions.value = buildSpaceTree(projectInfo.value.projectChildList);
}

function handleAddDefaultMember2Form() {
  if (formModels.value.length === 5) {
    window.$message?.warning('每次提交最多能添加五个成员！');
    return;
  }
  formModels.value.push(createDefaultFormModel());
}

function handleMinusForm(formId: string) {
  formModels.value = formModels.value.filter(item => item.formId !== formId);
}

/**
 * 更新授权的空间范围信息
 */
function handleSpaceAuthUpdate(
  keys: Array<string>,
  option: Array<TreeOption | null>,
  meta: { node: TreeOption | null; action: 'check' | 'uncheck' }
) {
  console.info('handleSpaceAuthUpdate', keys, `option:`, option, 'meta', meta);

  selectSpaceList.value = keys;
  if (projectInfo.value) {
    const allParentPoint = projectInfo.value.projectChildList
      .filter(item => item.pid === '0')
      .map(item => item.spaceId);
    if (allParentPoint.length > 0 && allParentPoint.every(parent => keys.includes(parent))) {
      allCheck.value = true;
    } else {
      allCheck.value = false;
    }
  }
}

const submitLoading = ref(false);

const spaceTree = ref<InstanceType<typeof NTree> | null>(null);

async function handleSubmit() {
  // 检查表单
  if (submitLoading.value) return;
  submitLoading.value = true;

  try {
    if (!formRef.value) throw new Error('formRef is not defined');
    const promise: Array<
      Promise<{
        warnings: FormValidationError[] | undefined;
      }>
    > = [];
    formRef.value.forEach(item => {
      promise.push(item.validate());
    });
    const validRes = await Promise.allSettled(promise);
    if (validRes.some((resItem): boolean => resItem.status !== 'fulfilled')) {
      throw new Error();
    }
  } catch (err) {
    submitLoading.value = !submitLoading.value;
    return;
  }
  for (const x of formModels.value) {
    // 监测是否有相同的添加项
    if (formModels.value.filter(item => item.mobilePhone === x.mobilePhone).length >= 2) {
      window.$message?.error(`${x.mobilePhone}被重复添加`);
      submitLoading.value = false;
      return;
    }
  }

  console.log('selectSpaceList', projectOptions.value);
  const curProjectInfo = projectStore.projects.find(item => item.projectId === projectStore.curId);
  let selectSpaceListTemp = spaceTree.value?.getCheckedData().options as TreeOption[];

  selectSpaceListTemp = selectSpaceListTemp.concat(
    spaceTree.value?.getIndeterminateData().options as unknown as TreeOption[]
  );

  const projectChildList = selectSpaceListTemp.map(selectSpace => selectSpace as ApiProject.Space);

  const res = await fetchBatchAddProjectMember({
    projectId: projectStore.curId,
    projectUserList: formModels.value
      .filter(item => item.mobilePhone && item.roleLevel)
      .map(item => {
        return {
          mobilePhone: item.mobilePhone as string,
          roleLevel: item.roleLevel as number
        };
      }),
    projectSpace: {
      merchantCode: curProjectInfo?.merchantCode ?? '',
      projectName: curProjectInfo?.projectName ?? '',
      projectChildList,
      projectId: projectStore.curId
    }
  });

  if (!res.error) {
    window.$message?.success('新增成功!');
    closeModal();
  } else {
    // eslint-disable-next-line no-lonely-if
    if (res.error.result) {
      res.error.result.forEach((item: { code: number; msg: string; nickName: string | null; mobilePhone: any }) => {
        const index = formModels.value.findIndex((form: { mobilePhone: any }) => form.mobilePhone === item.mobilePhone);
        formModels.value[index].phoneStatus = 'error';
      });
      const promise: Array<
        Promise<{
          warnings: FormValidationError[] | undefined;
        }>
      > = [];
      formRef.value.forEach(item => {
        promise.push(item.validate());
      });
      await Promise.allSettled(promise);
    }
    // 会自动弹出理由
    // window.$message?.error('新增失败!');
  }
  setTimeout(() => {
    submitLoading.value = false;
  }, 1200);
}

async function updateProjectList() {
  // 根据当前用户权限，查询可分配的项目列表
  const projectRes = await queryProjectByUser();

  if (!projectRes.error) {
    projectOptions.value = projectRes.data;
  }
}

function handleInputChange() {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < formModels.value.length; i++) {
    const element = formModels.value[i];
    if (element.mobilePhone !== null && element.mobilePhone.length === 0) {
      element.phoneStatus = 'success';
    }
  }
}

watch(
  () => props.visible,
  async newValue => {
    if (newValue) {
      allCheck.value = false;
      await updateProjectList();

      handleUpdateFormModel();
    } else {
      selectSpaceList.value = [];
    }
  }
);
</script>

<style scoped></style>
