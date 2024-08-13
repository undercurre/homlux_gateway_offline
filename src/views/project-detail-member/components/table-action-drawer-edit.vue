<template>
  <n-drawer v-model:show="modalVisible" title="编辑权限" width="400" :mask-closable="false">
    <n-drawer-content closable>
      <template #header>编辑权限</template>
      <template #footer>
        <n-button class="w-72px mr-10px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" :loading="submitLoading" :disabled="!treeReady" type="primary" @click="handleSubmit">
          确定
        </n-button>
      </template>
      <n-form ref="formRef" class="w-full" label-placement="top" :label-width="80" :model="formModel" :rules="rules">
        <n-grid class="w-full" :cols="24">
          <n-form-item-grid-item :span="24" label="用户名称" path="userName">
            <n-input v-model:value="formModel.userName" disabled />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="手机号" path="userName">
            <n-input v-model:value="formModel.mobilePhone" disabled />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="12" label="项目权限" path="roleLevel">
            <n-select
              v-model:value="formModel.roleLevel"
              :options="showRoleOptions"
              label-field="roleName"
              value-field="roleLevel"
              clearable
              @update:value="handleUpdateValue"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item v-show="formModel.roleLevel === 3" :span="24" label="空间权限" path="projectSpace">
            <div class="w-100% flex-col">
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
                block-line
                :data="spaceTreeOptions"
                :checked-keys="selectSpaceList"
                key-field="spaceId"
                label-field="spaceName"
                expand-on-click
                cascade
                checkable
                multiple
                default-expand-all
                :disabled="!treeReady"
                @update:checked-keys="handleSpaceAuthUpdate"
              />
            </div>
          </n-form-item-grid-item>
        </n-grid>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import { NTree } from 'naive-ui';
import type { FormInst, FormItemRule, SelectOption, TreeOption } from 'naive-ui';
import { buildSpaceTree, createRequiredFormRule } from '@/utils';
import { useAuthStore, useProjectStore } from '~/src/store';
import { fetchMemberDetail, fetchUptProjectMember } from '~/src/service';

const auth = useAuthStore();
const projectStore = useProjectStore();

const { roleLevel, isSuperAdmin } = auth;

const projectOptions = ref<ApiUser.AuthProjectItem[]>([]);

const spaceTreeOptions = ref<TreeOption[]>([]);

const selectSpaceList = ref<string[]>([]); // 勾选的空间权限列表

const allCheck = ref(false);

const treeReady = ref(false);

interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /** 编辑的表格行数据 */
  editData?: ApiProject.Member | null;
  roleOptions: SelectOption[];
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
const closeModal = () => {
  modalVisible.value = false;
};

function selectAllSpace(checked: boolean) {
  if (checked) {
    selectSpaceList.value = spaceTreeOptions.value.map(item => item.spaceId) as string[];
  } else {
    selectSpaceList.value = [];
  }
  allCheck.value = checked;
}

const formRef = ref<HTMLElement & FormInst>();

type FormModel = ApiProject.UpdateProjectMemberParams;

const formModel = reactive<FormModel>(createDefaultFormModel());

type FormRuleRequiredKey = keyof Omit<
  FormModel,
  'userId' | 'userName' | 'mobilePhone' | 'roleLevelName' | 'projectId' | 'roleId'
>;

const rules: Record<FormRuleRequiredKey, FormItemRule | FormItemRule[]> = {
  roleLevel: createRequiredFormRule('请选择项目权限'),
  projectSpace: createRequiredFormRule('请选择空间权限')
};

function createDefaultFormModel(): FormModel {
  return {
    projectId: '',
    userId: '',
    userName: '',
    mobilePhone: '',
    roleId: '',
    roleLevel: -1,
    projectSpace: {} as ApiUser.AuthProjectItem
  };
}

const projectInfo = ref<ApiUser.AuthProjectItem>();

async function handleUpdateFormModel() {
  console.log('editData', props.editData);
  if (props.editData) {
    Object.assign(formModel, props.editData);
    projectInfo.value = projectOptions.value.find(
      item => item.projectId === projectStore.curId
    ) as ApiUser.AuthProjectItem;
    spaceTreeOptions.value = buildSpaceTree(projectInfo.value.projectChildList);
    console.log(
      'projectTree',
      spaceTreeOptions.value.map(item => item.spaceId)
    );
    // 使用者回显空间授权节点时，需要剔除非叶子节点。组件会根据叶子节点勾选状态正确显示父节点的状态
    const res = await fetchMemberDetail({
      userId: props.editData?.userId,
      roleLevel: props.editData?.roleLevel,
      projectId: projectStore.curId
    });
    if (res.data) {
      const curProjectInfo = res.data.projectList.find(item => item.projectId === projectStore.curId);
      // 使用者回显空间授权节点时，需要剔除非叶子节点。组件会根据叶子节点勾选状态正确显示父节点的状态
      if (curProjectInfo) {
        const curParentPoint = curProjectInfo?.projectChildList
          .filter(item => item.pid === '0')
          .map(item => item.spaceId);

        const allParentPoint = projectInfo.value.projectChildList
          .filter(item => item.pid === '0')
          .map(item => item.spaceId);
        if (allParentPoint.length > 0 && allParentPoint.every(parent => curParentPoint.includes(parent))) {
          allCheck.value = true;
        } else {
          allCheck.value = false;
        }
        selectSpaceList.value = curProjectInfo?.projectChildList
          .filter(item => item.cid === '0')
          .map(item => item.spaceId);
        treeReady.value = true;
      }
    }
  }
}

/**
 * 更新角色选项属性
 */
function handleUpdateValue(value: number) {
  formModel.roleLevel = value;
  selectSpaceList.value = []; // 变换角色类型时，需要清空所选的项目空间权限数据，不同角色校验规则不同
  allCheck.value = false;
  console.log('权限选择置空');
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
  console.log('提交前', formModel);
  if (submitLoading.value) return;
  submitLoading.value = true;
  const curProjectInfo = projectStore.projects.find(item => item.projectId === projectStore.curId);
  let selectSpaceListTemp = spaceTree.value?.getCheckedData().options as TreeOption[];

  selectSpaceListTemp = selectSpaceListTemp.concat(
    spaceTree.value?.getIndeterminateData().options as unknown as TreeOption[]
  );

  const projectChildList = selectSpaceListTemp.map(selectSpace => selectSpace as ApiProject.Space);
  formModel.roleId = formModel.roleLevel?.toString() ?? '';
  formModel.projectId = curProjectInfo?.projectId;
  formModel.projectSpace = {
    merchantCode: curProjectInfo?.merchantCode ?? '',
    projectName: curProjectInfo?.projectName ?? '',
    projectChildList,
    projectId: projectStore.curId
  };

  try {
    await formRef.value?.validate();
  } catch (e) {
    submitLoading.value = !submitLoading.value;
    return;
  }
  if (formModel.roleLevel && formModel.mobilePhone) {
    const res = await fetchUptProjectMember(formModel as ApiProject.MemberHandle);
    if (!res.error) {
      window.$message?.success('编辑成功!');
    } else {
      window.$message?.error('编辑失败!');
    }
  }
  closeModal();
  setTimeout(() => {
    submitLoading.value = false;
  }, 1200);
}

async function updateProjectList() {
  // 根据当前用户权限，查询可分配的项目列表
  // const projectRes = await queryProjectByUser();

  // if (!projectRes.error) {
  //   projectOptions.value = projectRes.data;
  //   console.log('项目列表', projectRes.data);
  // }
  projectOptions.value = projectStore.projectsWithAuth;
  console.log('项目列表', projectStore.projectsWithAuth);
}

watch(
  () => props.visible,
  async newValue => {
    if (newValue) {
      if (props.editData) {
        Object.assign(formModel, props.editData);
      }
      await updateProjectList();

      handleUpdateFormModel();
    } else {
      selectSpaceList.value = [];
      treeReady.value = false;
      console.log('权限树置空');
    }
  }
);
</script>

<style scoped></style>
