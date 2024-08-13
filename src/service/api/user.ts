import { request } from '../request';

/**
 * 获取系统用户列表
 * @param params
 */
export function fetchSysUserByPage(params: ApiUser.PageSysUserParams) {
  return request.post<ApiUser.PageSysUser>('/v1/mzgd/cl/user/account/query', { xsc: 'DESC', ...params });
}

/**
 * 查询用户信息
 * @param params
 */
export function fetchUserDetail(params: { userId?: string; projectId?: string; roleLevel?: number }) {
  return request.post<ApiUser.SysUser>('/v1/mzgd/cl/user/account/info', params);
}

/**
 * 新增系统用户
 * @param params
 */
export function fetchAddUser(params: Partial<ApiUser.CreateUserParams>) {
  return request.post<null>('/v1/mzgd/cl/user/account/add', params);
}

/**
 * 编辑系统用户
 * @param params
 */
export function fetchUptUser(params: ApiUser.CreateUserParams) {
  return request.post<null>('/v1/mzgd/cl/user/account/update', params);
}

/**
 * 删除系统用户
 * @param params
 */
export function fetchDelUser(userId: string) {
  return request.post<null>('/v1/mzgd/cl/user/account/del', { userId });
}

/**
 * 切换角色
 * @param params
 */
export function queryRoleList() {
  return request.post<ApiAuth.UserRole[]>('/v1/mzgd/cl/user/role/queryList');
}

/**
 * 用户权限列表查询
 * @param params
 */
export function queryUserAuthList(params: { merchantCode: string; userId: string }) {
  return request.post<{
    merchantList: ApiMerchant.MerchantItem[];
    userAuthList: ApiUser.UserAuthItem[];
  }>('/v1/mzgd/cl/user/account/queryUserAuthList', params);
}

/**
 * 查询角色列表
 * @param params
 */
export function toggleUserRole(roleLevel: number) {
  return request.post<{ mzgdUserInfoClDTO: ApiAuth.Token }>('/v1/mzgd/cl/user/account/userRoleSwitch', { roleLevel });
}

/**
 * 编辑用户信息，仅编辑用户名称
 * @param params
 */
export function updateUserInfo(params: { userName: string }) {
  return request.post<null>('/v1/mzgd/cl/user/account/updateUserInfo', params);
}
