import { request } from '../request';

/**
 * 获取项目列表
 * @param params
 */
export function fetchProjectByPage(params: ApiProject.SelectProjectParams) {
  return request.post<ApiProject.PageProject>('/v1/mzgd/cl/user/project/query', params);
}

/**
 * 新增项目
 * @param params
 */
export function fetchAddProjectByPage(params: ApiProject.CreateProjectParams) {
  return request.post<null>('/v1/mzgd/cl/user/project/add', params);
}

/**
 * 编辑项目
 * @param params
 */
export function fetchUptProjectByPage(params: ApiProject.UpdateProjectParams) {
  return request.post<null>('/v1/mzgd/cl/user/project/update', params);
}

/**
 * 删除项目
 * @param params
 */
export function fetchDelProjectByPage(params: ApiProject.DeleteProjectParams) {
  return request.post<null>('/v1/mzgd/cl/user/project/del', params);
}

/**
 * 找到项目
 * @param params
 */
export function fetchFindProject(params: ApiProject.DeleteProjectParams) {
  return request.post<null>('/v1/mzgd/cl/user/project/query', params);
}

/**
 * 获取项目大盘数据
 */
export function fetchOverviewForProject(id?: string) {
  return request.post<ApiBoard.Board>('/v1/mzgd/cl/user/project/overview', id ? { projectId: id } : {});
}

/**
 * 根据当前用户权限查询项目列表
 */
export function queryProjectByUser() {
  return request.post<ApiUser.AuthProjectItem[]>('/v1/mzgd/cl/user/project/queryProjectByUser');
}

/**
 * 项目成员列表查询
 */
export function queryProjectMember(params: ApiProject.SelectMemberParams) {
  return request.post<ApiProject.PageProjectMember>('/v1/mzgd/cl/user/project/queryProjectMembersList', params);
  // return mockRequest.post<ApiProject.PageProjectMember>('/v1/mzgd/cl/user/project/queryProjectMembersList');
}

/**
 * 项目代理商变更
 */
export function updateProjectMerchant(params: ApiProject.updateProjectMerchantForm) {
  return request.post<ApiUser.PageSysUser>('/v1/mzgd/cl/user/project/updateProjectMerchant', params);
}

/**
 * 项目代理商变更
 */
export function fetchAllMerchantUser(params: { projectId: string }) {
  return request.post<Array<{ mobilePhone: string; userId: string; userName: string }>>(
    '/v1/mzgd/cl/user/project/queryMerchantUserByProjectId',
    params
  );
}

/**
 * 新增成员
 * @param params
 */
export function fetchAddProjectMember(params: ApiProject.AddProjectUserParams) {
  return request.post<null>('/v1/mzgd/cl/user/account/addProjectUser', params);
}

/**
 * 批量添加项目成员
 * @param params
 */
export function fetchBatchAddProjectMember(params: ApiProject.AddProjectUserParams) {
  return request.post<null>('/v1/mzgd/cl/user/account/batchAddProjectUser', params);
}

/**
 * 查询单个成员
 * @param params
 */
export function fetchMemberDetail(params: ApiProject.SelectMemberInfoParams) {
  return request.post<ApiUser.SysUser>('/v1/mzgd/cl/user/account/info', params);
}

/**
 * 编辑成员
 * @param params
 */
export function fetchUptProjectMember(params: ApiProject.MemberHandle) {
  return request.post<null>('/v1/mzgd/cl/user/account/update', params);
}

/**
 * 删除成员
 * @param params
 */
export function fetchDelProjectMember(params: ApiProject.DeleteProjectMemberParams) {
  return request.post<null>('/v1/mzgd/cl/user/account/delProjectUser', params);
}
