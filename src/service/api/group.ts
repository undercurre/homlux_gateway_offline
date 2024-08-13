import { request } from '../request';

/**
 * 获取灯组详情
 * @param groupId - 灯组id
 */
export function fetchGroupDetail(groupId: string) {
  return request.post<ApiDevice.Group>('/v1/mzgd/cl/scene/queryGroupByGroupId', {
    groupId
  });
}

/**
 * 下发指令
 * @param actions - 指令
 * @param groupId - 灯组id
 */
export function fetchLightGroupController(
  groupId: string,
  actions: {
    power?: 0 | 1;
    brightness?: number;
    colorTemperature?: number;
  }
) {
  return request.post<ApiDevice.DetailRes>('v1/mzgd/cl/scene/groupControl', {
    controlAction: [actions],
    groupId
  });
}
