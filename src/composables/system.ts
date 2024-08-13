import UAParser from 'ua-parser-js';
import { useAuthStore } from '@/store';
import { isArray, isNumber } from '@/utils';

/** 获取设备信息 */
export function useDeviceInfo() {
  const parser = new UAParser();
  const result = parser.getResult();
  return result;
}

/** 权限判断 */
export function usePermission() {
  const auth = useAuthStore();

  function hasPermission(permission: ApiAuth.UserRole['roleLevel'] | ApiAuth.UserRole['roleLevel'][]) {
    const { roleLevel } = auth;

    let has = false;
    if (!has) {
      if (isArray(permission)) {
        has = (permission as ApiAuth.UserRole['roleLevel'][]).includes(roleLevel);
      }
      if (isNumber(permission)) {
        has = (permission as ApiAuth.UserRole['roleLevel']) === roleLevel;
      }
    }
    return has;
  }

  return {
    hasPermission
  };
}
