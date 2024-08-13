<template>
  <n-drawer v-model:show="modalVisible" :width="400" placement="right" :mask-closable="false">
    <n-drawer-content :title="title" closable>
      <n-form ref="formRef" label-placement="top" :label-width="80" :model="formModel" :rules="rules">
        <n-grid :cols="24">
          <n-form-item-grid-item :span="24" label="代理商名称" path="merchantName">
            <n-input v-model:value="formModel.merchantName" maxlength="20" show-count clearable />
          </n-form-item-grid-item>

          <n-form-item-grid-item :span="24" label="区域" path="merchantAreaCode">
            <n-cascader
              v-model:value="formModel.merchantAreaCode"
              placeholder="请选择"
              placement="bottom-end"
              :options="areaOptions"
              check-strategy="child"
              size="medium"
              @update:value="handleUpdateValue"
            />
          </n-form-item-grid-item>

          <n-form-item-grid-item :span="24" label="详细地址" path="address">
            <n-input
              v-model:value="formModel.address"
              maxlength="100"
              type="textarea"
              :autosize="{
                minRows: 2,
                maxRows: 5
              }"
              show-count
              clearable
            />
          </n-form-item-grid-item>

          <n-form-item-grid-item :span="24" label="联系人" path="merchantLeader">
            <n-input v-model:value="formModel.merchantLeader" maxlength="10" show-count clearable />
          </n-form-item-grid-item>

          <n-form-item-grid-item :span="24" label="联系方式" path="contract" maxlength="20" show-count>
            <n-input v-model:value="formModel.contract" clearable />
          </n-form-item-grid-item>

          <n-form-item-grid-item :span="24" label="注册手机" path="mobilePhone" maxlength="11" show-count>
            <n-input v-model:value="formModel.mobilePhone" clearable :disabled="isEdit" />
          </n-form-item-grid-item>
        </n-grid>
      </n-form>
      <template #footer>
        <n-space class="w-full pt-16px" :size="24" justify="end">
          <n-button class="w-72px" @click="closeModal">取消</n-button>
          <n-button class="w-72px" type="primary" :loading="isSubmit" @click="handleSubmit">确定</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { CascaderOption, FormInst, FormItemRule } from 'naive-ui';
import { createRequiredFormRule, formRules } from '@/utils';
import areaData from '@/assets/data/area.json';
import { fetchAddMerchant, fetchUptMerchant, queryMerchantByUser } from '~/src/service';

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(
  defineProps<{
    /** 弹窗可见性 */
    visible: boolean;
    /** 编辑的表格行数据 */
    editData?: ApiMerchant.MerchantItem | null;

    // 调用入口，存在右上角的头像，代理商超管编辑代理商信息的入口，key为【entry】
    entry: string;
  }>(),
  {
    editData: null,
    entry: ''
  }
);

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'update'): void;
}>();

const formRef = ref<HTMLElement & FormInst>();

type FormModel = ApiMerchant.CreateMerchantParams | ApiMerchant.UpdateMerchantParams;

const formModel = ref<FormModel>(createDefaultFormModel());

type FormRuleRequiredKey = keyof Omit<FormModel, 'address' | 'contract'>;

// 表单校验规则
const rules: Record<FormRuleRequiredKey, FormItemRule | FormItemRule[]> = {
  merchantName: createRequiredFormRule('请输入代理商名称'),
  mobilePhone: formRules.phone,
  merchantLeader: createRequiredFormRule('请输入代理商联系人'),
  merchantArea: createRequiredFormRule('请选择区域'),
  merchantAreaCode: createRequiredFormRule('请选择区域')
};

const areaOptions = ref<CascaderOption[]>([]);

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

areaOptions.value = parseTreeJson(areaData);

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

/**
 * 是否代理商超管编辑代理商信息
 */
const isEditSelf = computed(() => {
  return props.entry === 'user-avatar';
});
/**
 * 是否编辑用户
 */
const isEdit = computed(() => {
  return Boolean(props.editData) || isEditSelf.value;
});

const title = computed(() => {
  if (isEditSelf.value) {
    return '代理商信息';
  }
  return isEdit.value ? '编辑代理商' : '添加代理商';
});

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

function handleUpdateValue() {
  if (formModel.value.merchantAreaCode)
    formModel.value.merchantArea = findLocationByCode(areaData, formModel.value.merchantAreaCode);
}

const closeModal = () => {
  modalVisible.value = false;
};

function createDefaultFormModel(): FormModel {
  return {
    address: '',
    contract: '',
    merchantArea: '',
    merchantAreaCode: '',
    merchantLeader: '',
    merchantName: '',
    mobilePhone: ''
  };
}

function handleUpdateFormModel(model: FormModel) {
  Object.assign(formModel.value, model);
}

async function handleUpdateFormModelByModalType() {
  // 先清空历史数据，否则数据会闪烁显示之前的账号数据
  const defaultFormModel = createDefaultFormModel();
  handleUpdateFormModel(defaultFormModel);

  if (props.editData) {
    handleUpdateFormModel(props.editData);
  } else if (isEditSelf.value) {
    const res = await queryMerchantByUser();

    if (!res.error) {
      handleUpdateFormModel(res.data);
    }
  }
}

const isSubmit = ref(false);
async function handleSubmit() {
  await formRef.value?.validate();

  let res;

  isSubmit.value = true;
  if (!isEdit.value) {
    res = await fetchAddMerchant(formModel.value);
  } else {
    res = await fetchUptMerchant(formModel.value as ApiMerchant.UpdateMerchantParams);
  }

  if (!res.error) {
    window.$message?.success(!isEdit.value ? '新增成功!' : '编辑成功!');
    emit('update');
    closeModal();
  }

  isSubmit.value = false;
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<style scoped></style>
