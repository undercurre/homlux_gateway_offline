import { unref, nextTick } from 'vue';
import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchLogin, fetchSysUserByPage } from '@/service';
import { useRouterPush } from '@/composables';
import { localStg, sessionStg } from '@/utils';
import { $t } from '@/locales';
import { useTabStore } from '../tab';
import { useRouteStore } from '../route';
import { useProjectStore } from '../project';
import { getToken, getUserInfo, clearAuthStorage } from './helpers';

interface AuthState {
  /** 用户信息 */
  userInfo: ApiAuth.UserInfo;
  /** 用户token */
  token: string;
  /** 登录的加载状态 */
  loginLoading: boolean;
  users: Array<ApiUser.SysUser>;
  dictList: ApiAuth.DictList;
  showForgetPassword: boolean;
  offlineAuth: {
    username: string;
  };
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    userInfo: getUserInfo(),
    token: getToken(),
    loginLoading: false,
    users: [],
    dictList: [],
    showForgetPassword: false,
    offlineAuth: {
      username: ''
    }
  }),
  getters: {
    projectTypeDict(state) {
      const arr = state.dictList
        .filter(item => item.type === 1 && (item.dictCode === '01' || item.dictCode === '02'))
        .map(dict => {
          return {
            label: dict.dictName,
            value: dict.dictCode
          };
        });

      arr.unshift({
        label: '全部',
        value: ''
      });

      return arr;
    },
    projectMemberTypeDictInLight(state) {
      return state.dictList
        .filter(
          item => item.dictCode !== '0' && item.type === 2 && (item.projectType === '01' || item.projectType === '00')
        )
        .map(dict => {
          return {
            label: dict.dictName,
            value: Number(dict.dictCode)
          };
        })
        .filter(item => item.value > 1);
    },
    projectMemberTypeDictInLock(state) {
      return state.dictList
        .filter(
          item => item.dictCode !== '0' && item.type === 2 && (item.projectType === '02' || item.projectType === '00')
        )
        .map(dict => {
          return {
            label: dict.dictName,
            value: Number(dict.dictCode)
          };
        })
        .filter(item => item.value > 1);
    },
    projectRoleDictInLight(state): ApiAuth.UserRole[] {
      return state.dictList
        .filter(
          item => item.dictCode !== '0' && item.type === 2 && (item.projectType === '01' || item.projectType === '00')
        )
        .map(dict => {
          return {
            roleId: dict.dictCode, // 角色Id
            roleName: dict.dictName, // 角色名称
            roleLevel: Number(dict.dictCode),
            defaultRoleFlag: dict.projectType === '00' ? 1 : (0 as 0 | 1),
            projectId: ''
          };
        })
        .filter(item => item.roleLevel > 1);
    },
    projectRoleDictInLock(state): ApiAuth.UserRole[] {
      return state.dictList
        .filter(
          item => item.dictCode !== '0' && item.type === 2 && (item.projectType === '02' || item.projectType === '00')
        )
        .map(dict => {
          return {
            roleId: dict.dictCode, // 角色Id
            roleName: dict.dictName, // 角色名称
            roleLevel: Number(dict.dictCode),
            defaultRoleFlag: dict.projectType === '00' ? 1 : (0 as 0 | 1),
            projectId: ''
          };
        })
        .filter(item => item.roleLevel > 1);
    },
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.token);
    },
    userRole(state) {
      const roleList = state.userInfo.roleList || []; // 针对旧版本已登录用户，不存在roleList字段

      const defaultRole = roleList.find(item => item.defaultRoleFlag !== 0); // 兼容历史数据，有且只有一个角色的数据的defaultRoleFlag为null

      return (
        defaultRole || {
          roleId: '', // 角色Id
          roleName: '', // 角色名称
          roleLevel: 3, // 角色级别 0: 总管 1：商户超管 2：项目管理员 3：使用者
          defaultRoleFlag: 1, //	默认角色标记：0-非默认 1-默认	integer
          projectId: '' //	项目id};
        }
      );
    },

    roleLevel(): number {
      return this.userRole.roleLevel;
    },
    /** 是否项目使用者 */
    isCommonUser(): boolean {
      return this.roleLevel === 3;
    },
    /** 是否总部管理员 ✨ */
    isSuperAdmin(): boolean {
      return this.roleLevel === 0;
    },
    hasFirstPage(): boolean {
      return this.roleLevel === 0 || this.roleLevel === 1;
    },
    outMyself(): Array<ApiUser.SysUser> {
      return this.users.filter(
        item => item.mobilePhone !== this.userInfo.mobilePhone && item.roleLevel !== 0 && item.roleLevel !== 1
      );
    }
  },
  actions: {
    async getDictList() {
      // const list = await fetchDictList();
      // if (list.data) {
      //   this.dictList = list.data;
      // }
    },
    async getAllUser() {
      const us = await fetchSysUserByPage({ pageSize: 99999 });
      if (us.data) {
        this.users = us.data.content;
      }
    },
    updateUserInfo(data: Partial<ApiAuth.UserInfo>) {
      Object.assign(this.userInfo, data);

      localStg.set('userInfo', this.userInfo);
    },
    /** 重置auth状态 */
    resetAuthStore() {
      const { toLogin } = useRouterPush(false);
      const { resetTabStore } = useTabStore();
      const { resetRouteStore } = useRouteStore();
      const route = unref(router.currentRoute);
      const routerStore = useRouteStore();
      const projectStore = useProjectStore();

      clearAuthStorage();
      this.$reset();

      if (route.meta.requiresAuth) {
        toLogin();
      }

      nextTick(() => {
        resetTabStore();
        resetRouteStore();
        projectStore.clearCurProjectId();
        routerStore.handleOpenProjectDetail(false);
      });
    },
    /**
     * 处理登录后成功或失败的逻辑
     * @param backendToken - 返回的token
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handleActionAfterLogin(backendToken: ApiAuth.Token) {
      const route = useRouteStore();
      const { toLoginRedirect } = useRouterPush(false);

      const loginSuccess = await this.loginByToken(backendToken);

      if (loginSuccess) {
        await route.initAuthRoute();

        // 跳转登录后的地址
        toLoginRedirect();

        // 登录成功弹出欢迎提示
        if (route.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', {
              userName: this.userInfo.userName || `用户${this.userInfo.mobilePhone}`
            }),
            duration: 3000
          });
        }

        return;
      }

      // 不成功则重置状态
      this.resetAuthStore();
    },
    /**
     * 根据token进行登录
     * @param backendToken - 返回的token
     */
    async loginByToken(backendToken: ApiAuth.Token) {
      // 先把token存储到缓存中(后面接口的请求头需要token)
      const { token, mobilePhone, roleList, userName } = backendToken;
      const userInfo = {
        userName,
        mobilePhone,
        roleList: roleList || []
      };

      localStg.set('userInfo', userInfo);
      localStg.set('token', token);

      sessionStg.set('isSessionActive', true);

      // 更新状态
      this.userInfo = userInfo;
      this.token = token;

      return true;
    },
    /**
     * 登录
     * @param param.mobilePhone 手机号
     * @param param.password 密码
     * @param param.verifyCode 验证码
     */
    async login(param: { username: string; password: string }) {
      const { username, password } = param;

      const res = await fetchLogin({
        username,
        password
      });

      const route = useRouteStore();
      const { toLoginRedirect } = useRouterPush(false);

      if (!res.error) {
        this.offlineAuth.username = res.data.username;

        await route.initAuthRoute();

        localStg.set('token', 'offlinetoken');
        localStg.set('username', res.data.username);

        sessionStg.set('isSessionActive', true);

        // 跳转登录后的地址
        toLoginRedirect();

        // 登录成功弹出欢迎提示
        if (route.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', {
              userName: `用户${res.data.username}`
            }),
            duration: 3000
          });
        }
      } else {
        window.$notification?.error({
          title: '登录失败',
          content: '密码错误',
          duration: 3000
        });
      }
    }
  }
});
