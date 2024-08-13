import { request } from '../request';
// import { mockRequest } from '../request';

/**
 * 查询项目下的场景
 * @param params
 */
export function fetchSceneByProjectId(params: ApiScene.fetchSceneParams) {
  return request.post<ApiScene.PageScene>('/v1/mzgd/cl/scene/querySceneListByProjectIdToPage', params);
}

/**
 * 查询项目下的场景执行日志
 * @param params
 */
export function fetchSceneLogByProjectId(params: ApiScene.fetchSceneLogParams) {
  return request.post<ApiScene.apiSceneLog>('/v1/mzgd/cl/scene/querySceneLog', params);
}

/**
 * 执行一键场景
 * @param params
 */
export function execScene(params: { sceneId: string }) {
  return request.post('/v1/mzgd/cl/scene/sceneControl', params);
}
/**
 * 使能 日程/自动场景
 * @param params
 */
export function setAutoSceneEnabled(params: { sceneId: string; isEnabled: '1' | '0' }) {
  return request.post('/v1/mzgd/cl/scene/setSceneEnabled', params);
}
