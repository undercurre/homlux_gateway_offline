import { request } from '../request';

/**
 * 获取项目空间树
 * @param projectId - 项目id
 */
export function fetchSpaceForProject(projectId: string) {
  return request.post<Array<Omit<ApiProject.Space, 'cid'>>>('/v1/mzgd/cl/user/project/queryAllSpaceByProjectId', {
    projectId
  });
}

/**
 *
 * 根据项目/空间查询设备列表
 * @param params
 */

export function fetchDeviceListBySpace(params: ApiProject.FetchDeviceListBySpaceParams) {
  return request.post<ApiProject.FetchDeviceListBySpaceRes<ApiProject.DeviceInContentItem>>(
    '/v1/cl/device/web/queryDeviceInfoByProjectId',
    params
  );
}

/**
 *
 * 根据空间查询分组列表
 * @param params
 */

export function fetchGroupListBySpace(params: ApiProject.FetchGroupListBySpaceParams) {
  return request.post<ApiProject.FetchDeviceListBySpaceRes<ApiProject.GroupData>>(
    '/v1/mzgd/cl/scene/queryGroupBySpaceIdToPage',
    params
  );
}

/**
 * 空间新增
 * @param params
 */
export function fetchAddSpace(params: ApiProject.addSpaceParams) {
  return request.post<null>('/v1/mzgd/cl/user/space/add', params);
}

/**
 * 空间新增-批量
 * @param params
 */
export function fetchAddSpaceBatch(params: ApiProject.addSpaceBatchParams) {
  return request.post<null>('/v1/mzgd/cl/user/space/batch/add', params);
}

/**
 * 空间删除
 * @param spaceId
 */
export function fetchDeleteSpace(spaceId: string) {
  return request.post<null>('/v1/mzgd/cl/user/space/del', { spaceId });
}

/**
 * 公寓项目空间-编辑
 * @param params
 */
export function fetchEditSpace(params: ApiProject.editSpaceParams) {
  return request.post<null>('/v1/mzgd/cl/user/space/new/update', params);
}

/**
 * 空间详情查询
 * @param spaceId
 */
export function fetchSpaceDetail(spaceId: string) {
  return request.post<ApiProject.SpaceDetail>('/v1/mzgd/cl/user/space/queryDetail', { spaceId });
}

/**
 * 通过空间查询所有房间
 * @param params
 */
export function fetchAllRoomBySpace(params: ApiProject.queryRoomParams) {
  return request.post<ApiCommon.PageList<ApiProject.SpaceDetail>>('/v1/mzgd/cl/user/space/queryBySpaceId', params);
}

/**
 * 通过空间查询人员
 * @param spaceId
 */
export function fetchMembersBySpace(spaceId: string) {
  return request.post<ApiProject.roomMember[]>('/v1/mzgd/cl/user/space/user/query', { spaceId });
}
