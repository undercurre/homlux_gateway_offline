import { request } from '../request';

/**
 * 公寓 - 获取项目管理人员列表
 */
export function fetchPersonalList(params: ApiProject.SelectPersonalParams) {
  return request.post<ApiProject.PagePersonal>('/v1/mzgd/cl/user/qylock/project/queryProjectMembersList', params);
}

/**
 * 公寓 - 获取用户门锁操作日志
 */
// export function fetchLockLog() {}

/**
 * 公寓 - 删除用户
 */
// export function deleteProjectUser() {}
