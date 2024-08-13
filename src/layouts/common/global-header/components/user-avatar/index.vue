<template>
  <n-dropdown :options="options" @select="handleDropdown">
    <hover-container class="px-12px" :inverted="theme.header.inverted">
      <icon-local-avatar class="text-32px" />
      <span class="pl-8px text-16px font-medium">
        {{ auth.userInfo.userName || '用户' + auth.userInfo.mobilePhone }}
      </span>
    </hover-container>
  </n-dropdown>

  <UserInfo v-model:visible="isShowUserInfo"></UserInfo>

  <MerchantInfo v-model:visible="isShowMerchantInfo" entry="user-avatar"></MerchantInfo>
</template>

<script lang="tsx" setup>
import { h } from 'vue';
import type { DropdownOption } from 'naive-ui';
import { routeName } from '@/router';
import { toggleUserRole } from '@/service';
import { useAuthStore, useRouteStore, useThemeStore, useProjectStore } from '@/store';
import { useIconRender, useRouterPush } from '@/composables';
import { useBoolean } from '@/hooks';
import MerchantInfo from '@/views/merchant-manager/components/table-action-modal.vue';
import UserInfo from './components/user-info.vue';

defineOptions({ name: 'UserAvatar' });

const auth = useAuthStore();
const projectStore = useProjectStore();
const theme = useThemeStore();
const router = useRouterPush();
const { iconRender } = useIconRender();

const options: DropdownOption[] = [
  {
    render: () => {
      const icon = iconRender({ icon: 'carbon:arrows-horizontal' }); //     label: `切换角色（当前：${auth.isSuperAdmin ? '总管' : '代理商'}）`,

      return h(
        'n-space', // type
        {
          class: 'flex items-center hover:bg-white/[.09]',
          style: {
            padding: '5px 10px',
            fontSize: '14px',
            cursor: 'pointer'
          },
          onClick: () => {
            changeRole();
          }
        }, // props
        [
          icon(),
          h(
            'n-space',
            {
              vertical: true,
              style: {
                padding: '0 0 0 10px'
              }
            },
            [
              h('div', { innerHTML: '切换角色' }),
              h('div', {
                style: {
                  opacity: '0.6'
                },
                innerHTML: `当前：${auth.isSuperAdmin ? '总管' : '代理商'}`
              })
            ]
          )
          /* children */
        ]
      );
    },
    type: 'render',
    key: 'toggle-role',
    icon: iconRender({ icon: 'carbon:arrows-horizontal' }),
    show: auth.userInfo.roleList.findIndex(item => item.roleLevel === 0) >= 0 // 仅存在总管角色的有切换角色功能
  },
  {
    label: '个人信息',
    key: 'user-info',
    icon: iconRender({ icon: 'carbon:user' })
  },
  {
    label: '代理商信息',
    key: 'merchant-info',
    icon: iconRender({ icon: 'eos-icons:organization' }),
    show: auth.userInfo.roleList.findIndex(item => item.roleLevel === 0) < 0 && auth.roleLevel === 1 // 仅非总部代理商的超管角色拥有查看代理商信息功能
  },
  {
    label: '修改密码',
    key: 'reset-pwd',
    icon: iconRender({ icon: 'carbon:password' })
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: iconRender({ icon: 'carbon:logout' })
  }
];

type DropdownKey = 'reset-pwd' | 'logout' | 'toggle-role' | 'user-info' | 'merchant-info';

const { bool: isShowUserInfo, setTrue: openUserInfoModal } = useBoolean();

const { bool: isShowMerchantInfo, setTrue: openMerchantInfoModal } = useBoolean();

async function handleDropdown(optionKey: string) {
  const key = optionKey as DropdownKey;
  switch (key) {
    case 'toggle-role':
      changeRole();
      break;

    case 'user-info':
      openUserInfoModal();
      break;

    case 'merchant-info':
      openMerchantInfoModal();

      break;

    case 'reset-pwd':
      router.routerPush({ name: routeName('setting_reset-pwd') });

      break;

    case 'logout':
      window.$dialog?.info({
        title: '提示',
        content: '您确定要退出登录吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          auth.resetAuthStore();
          projectStore.clearCurProjectId();
        }
      });
      break;

    default:
      break;
  }
}

const routeStore = useRouteStore();

async function changeRole() {
  const { userInfo } = auth;

  const targetRole = userInfo.roleList.find(item => item.defaultRoleFlag === 0) as ApiAuth.UserRole;

  const res = await toggleUserRole(targetRole.roleLevel);

  if (!res.error) {
    auth.updateUserInfo({ roleList: res.data.mzgdUserInfoClDTO.roleList });

    router.toHome();
    window.$message?.success('切换成功!');

    setTimeout(() => {
      window.location.reload();
      router.routerPush({ name: routeName('project-manager') });
      routeStore.handleOpenProjectDetail(false);
    }, 1000);
  }
}
</script>

<style scoped></style>
