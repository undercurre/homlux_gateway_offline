import { request } from '../request';

/**
 * 获取项目门锁列表
 * @param projectId - 项目id
 */
export function fetchGetLocksInProject(params: ApiProject.SelectLockParams) {
  return request.post<ApiProject.PageLock>('/v1/cl/device/qyLock/getGylockList', params);
}

/**
 * 获取门锁日志
 * @param projectId - 项目id
 * @param sn - 机器sn
 */
export function fetchGetOneLockLog(params: ApiProject.SelectLockLogParams) {
  return request.post<ApiProject.PageLockLog>('/v1/cl/device/qyLock/getGylockLog', params);
}
