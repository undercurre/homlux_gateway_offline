import { localStg } from '@/utils';

/** 获取token */
export function getToken() {
  return localStg.get('token') || '';
}

/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo: ApiAuth.UserInfo = {
    userName: '',
    roleList: [],
    mobilePhone: ''
  };
  const userInfo: ApiAuth.UserInfo = localStg.get('userInfo') || emptyInfo;
  return userInfo;
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  localStg.remove('token');
  localStg.remove('refreshToken');
  localStg.remove('userInfo');
}
