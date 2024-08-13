<template>
  <n-drawer v-model:show="modalVisible" :title="title" width="400" :mask-closable="false">
    <n-drawer-content v-if="auth.roleLevel !== 0" closable>
      <template #header>{{ type === 'add' ? '添加项目' : '编辑项目' }}</template>
      <template #footer>
        <n-button class="w-72px mr-10px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" :loading="submitLoading" type="primary" @click="handleSubmit">确定</n-button>
      </template>
      <n-form ref="formRef" class="w-full" label-placement="top" :label-width="80" :model="formModel" :rules="rules">
        <n-grid class="w-full" :cols="24">
          <n-form-item-grid-item :span="24" label="项目类型" path="projectType">
            <n-select
              v-model:value="formModel.projectType"
              :disabled="type !== 'add'"
              placeholder="请选择"
              :options="auth.projectTypeDict.slice(1, auth.projectTypeDict.length)"
              clearable
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="项目名称" path="projectName">
            <n-input v-model:value="formModel.projectName" maxlength="20" show-count />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="项目区域" path="projectAreaCode">
            <n-cascader
              v-model:value="formModel.projectAreaCode"
              clearable
              placeholder="请选择"
              placement="bottom-end"
              :options="areaOptions"
              check-strategy="child"
              size="medium"
              @update:value="handleUpdateValue"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="负责人" path="projectLeader">
            <n-input v-model:value="formModel.projectLeader" maxlength="10" show-count />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="联系方式" path="contact">
            <n-input v-model:value="formModel.contact" />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="详细地址" path="address">
            <n-input
              v-model:value="formModel.address"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5
              }"
              maxlength="100"
              show-count
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="项目超管注册手机" path="projectAdminMobile">
            <n-input v-model:value="formModel.projectAdminMobile" placeholder="请输入项目超注册手机" />
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="type !== 'add'" :span="24" label="归属代理商" path="address">
            <n-button class="w-full" :disabled="auth.roleLevel !== 0" @click="innerVisible = true">
              {{ formModel.merchantName }}
            </n-button>
          </n-form-item-grid-item>
        </n-grid>
      </n-form>
    </n-drawer-content>

    <n-drawer-content v-if="auth.roleLevel === 0" closable>
      <template #header>变更代理商</template>
      <template #footer>
        <n-button class="w-72px mr-10px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" :loading="submitLoading" type="primary" @click="handleSubmit">确定</n-button>
      </template>
      <n-form ref="formRef" class="w-full" label-placement="top" :label-width="80" :model="formModel" :rules="rules">
        <n-grid class="w-full" :cols="24">
          <n-form-item-grid-item :span="24" label="项目名称" path="projectName">
            <n-input v-model:value="formModel.projectName" maxlength="20" show-count disabled />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="原代理商" path="merchantName">
            <n-button class="w-full" disabled>
              {{ formModel.merchantName }}
            </n-button>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="24" label="新代理商" path="merchantCode">
            <div class="w-full">
              <n-select
                v-model:value="newMerchantCode"
                placeholder="请选择"
                :options="merchantOptions"
                :status="newMerchantCode || first2In ? 'success' : 'error'"
                clearable
              />
              <div v-show="!(newMerchantCode || first2In)" class="n-form-item-feedback-wrapper text-#F5222D">
                <div class="n-form-item-feedback n-form-item-feedback--error">
                  <div class="n-form-item-feedback__line">请选择变更的代理商</div>
                </div>
              </div>
            </div>
          </n-form-item-grid-item>
        </n-grid>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import type { Ref } from 'vue';
import type { FormInst, FormItemRule, SelectOption, CascaderOption } from 'naive-ui';
import { createRequiredFormRule } from '@/utils';
import areaData from '@/assets/data/area.json';
import { fetchAddProjectByPage, fetchMerchantList, fetchUptProjectByPage, updateProjectMerchant } from '~/src/service';
import { REGEXP_PHONE } from '~/src/config/regexp';
import { useAuthStore } from '~/src/store';

const auth = useAuthStore();

const innerVisible = ref(false);

interface District {
  code: string;
  name: string;
}

interface City {
  code: string;
  name: string;
  children: District[];
}

interface Province {
  code: string;
  name: string;
  children: City[];
}

const parseTreeJson = (data: Array<Province>) => {
  return data.map(province => {
    return {
      value: province.code,
      label: province.name,
      children: province.children.map(city => {
        return {
          value: city.code,
          label: city.name,
          children: city.children.map(district => {
            return {
              value: district.code,
              label: district.name
            };
          })
        };
      })
    };
  });
};

const areaOptions: Ref<CascaderOption[]> = ref([]);

areaOptions.value = parseTreeJson(areaData);

console.log(areaOptions.value);

/**
 * 弹窗类型
 * add: 新增
 * edit: 编辑
 */
export type ModalType = 'add' | 'edit';

interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: ModalType;
  /** 编辑的表格行数据 */
  editData?: ApiProject.Project | null;
}

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
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

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '添加项目',
    edit: '编辑项目'
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = ApiProject.UpdateProjectParams;

const formModel = reactive<FormModel>(createDefaultFormModel());

type FormRuleRequiredKey = keyof Omit<FormModel, 'projectId' | 'projectArea' | 'merchantCode' | 'merchantName'>;

const rules: Record<FormRuleRequiredKey, FormItemRule | FormItemRule[]> = {
  projectType: createRequiredFormRule('请选择项目类型'),
  projectName: createRequiredFormRule('请输入项目名称'),
  projectAreaCode: createRequiredFormRule('请输入项目区域'),
  projectLeader: createRequiredFormRule('请输入称呼'),

  contact: [
    createRequiredFormRule('请输入11位手机号'),
    { pattern: REGEXP_PHONE, message: '手机号码格式错误', trigger: 'input' }
  ],
  address: createRequiredFormRule('请选择地址'),
  projectAdminMobile: [
    createRequiredFormRule('请输入11位手机号'),
    { pattern: REGEXP_PHONE, message: '手机号码格式错误', trigger: 'input' }
  ]
};

function createDefaultFormModel(): FormModel {
  return {
    projectId: props.editData?.projectId ?? '',
    projectType: null,
    projectName: '',
    projectLeader: '',
    contact: '',
    projectArea: '',
    projectAreaCode: null,
    address: '',
    merchantCode: '',
    merchantName: '',
    projectAdminMobile: ''
  };
}

interface District {
  code: string;
  name: string;
}

interface City {
  code: string;
  name: string;
  children: District[];
}

interface Province {
  code: string;
  name: string;
  children: City[];
}

const findLocationByCode = (dataTree: Province[], targetCode: string): string => {
  for (const province of dataTree) {
    for (const city of province.children || []) {
      for (const district of city.children || []) {
        if (district.code === targetCode) {
          return `${province.name} / ${city.name} / ${district.name}`;
        }
      }
    }
  }
  return targetCode; // 如果找不到对应的 code，直接返回那个code
};

function handleUpdateValue(value: string, option: CascaderOption) {
  console.log(value, option);
  if (formModel.projectAreaCode) formModel.projectArea = findLocationByCode(areaData, formModel.projectAreaCode);
}

const merchantOptions: Ref<SelectOption[]> = ref([]);
// eslint-disable-next-line no-empty-function
async function getProjectTypes() {}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

const submitLoading = ref(false);

const newMerchantCode = ref<string | null>(null);

const first2In = ref(true);

const closeModal = () => {
  modalVisible.value = false;
  first2In.value = true;
  newMerchantCode.value = null;
};

async function handleSubmit() {
  console.log(formModel.merchantCode);
  if (submitLoading.value) return;
  submitLoading.value = true;
  try {
    await formRef.value?.validate();
  } catch (e) {
    submitLoading.value = !submitLoading.value;
    return;
  }
  if (props.type === 'add') {
    const res = await fetchAddProjectByPage(formModel);
    if (!res.error) {
      window.$message?.success('新增成功!');
      closeModal();
    } else {
      window.$message?.error('新增失败!');
    }
  } else if (auth.roleLevel !== 0) {
    const res = await fetchUptProjectByPage(formModel);
    if (!res.error) {
      window.$message?.success('编辑成功!');
      closeModal();
    } else {
      window.$message?.error('编辑失败!');
    }
  } else if (auth.roleLevel === 0) {
    first2In.value = false;
    if (!newMerchantCode.value) {
      submitLoading.value = !submitLoading.value;
      return;
    }
    const res = await updateProjectMerchant({
      newMerchantCode: newMerchantCode.value,
      oldMerchantCode: formModel.merchantCode,
      projectId: formModel.projectId
    });
    if (!res.error) {
      window.$message?.success('变更成功!');
      closeModal();
    } else {
      window.$message?.error('变更失败!');
    }
  }
  setTimeout(() => {
    submitLoading.value = false;
  }, 1200);
}

function init() {
  getProjectTypes();
}

init();

watch(
  () => props.visible,
  async newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
      const res = await fetchMerchantList();
      if (Array.isArray(res.data)) {
        merchantOptions.value = res.data
          .filter(item => item.merchantCode !== formModel.merchantCode)
          .map(item => {
            return {
              label: item.merchantName,
              value: item.merchantCode
            };
          });
      }
    } else {
      newMerchantCode.value = null;
    }
  }
);
</script>

<style scoped></style>
