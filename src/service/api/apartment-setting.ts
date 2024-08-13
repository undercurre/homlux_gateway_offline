import { request } from '../request';

/**
 * 查询标签列表
 * @param projectId
 */
export function fetchLabelsByProject(projectId: string) {
  return request.post<ApiApartSetting.Label[]>('/v1/mzgd/cl/user/label/query', { projectId });
}

/**
 * 增加标签
 * @param params
 */
export function fetchAddLabel(params: ApiApartSetting.addLabelParams) {
  return request.post<null>('/v1/mzgd/cl/user/label/add', params);
}

/**
 * 删除标签
 * @param projectId
 * @param labelId
 */
export function fetchDeleteLabel(projectId: string, labelId: string) {
  return request.post<null>('/v1/mzgd/cl/user/label/del', { projectId, labelId });
}

/**
 * 更新标签
 * @param params
 */
export function fetchUpdateLabel(params: ApiApartSetting.updateLabelParams) {
  return request.post<null>('/v1/mzgd/cl/user/label/update', params);
}

/**
 * 启动-停用标签
 * @param projectId
 * @param labelId
 * @param isEnable
 */
export function fetchEnableLabel(projectId: string, labelId: string, isEnable: boolean) {
  return request.post<null>('/v1/mzgd/cl/user/label/setEnabled', { projectId, labelId, isEnabled: isEnable ? 1 : 0 });
}

/**
 * 根据空间查询密码
 * @param spaceId
 */
export function fetchBuildingAdminPassword(spaceId: string) {
  return request.post<{ password: string | null }>('/v1/mzgd/cl/user/space/pwd/query', { spaceId });
}

/**
 * 获取验证码
 */
export function fetchVerificationCode(type: number) {
  return request.post<{ captcha: string | null }>('/v1/mzgd/cl/user/get/captcha', { type });
}

/**
 * 公寓增加管理员密码
 * @param params
 */
export function fetchNewAdminPassword(params: ApiApartSetting.newAdminPasswordParams) {
  return request.post<null>('/v1/mzgd/cl/user/space/pwd/add', params);
}

/**
 * 公寓找回管理员密码
 * @param params
 */
export function fetchFindAdminPassword(params: ApiApartSetting.findAdminPasswordParams) {
  return request.post<{ password: string | null }>('/v1/mzgd/cl/user/space/pwd/back', params);
}

/**
 * 查询管理员密码下发记录
 * @param params
 */
export function fetchPasswordLog(params: ApiApartSetting.passwordLogParams) {
  return request.post<ApiApartSetting.passwordLog[]>('/v1/mzgd/cl/user/space/pwd/log', params);
}
