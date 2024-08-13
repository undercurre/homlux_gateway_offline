import { request } from '../request';

/**
 * 获取项目大盘数据
 */
export function fetchOverview() {
  return request.post<ApiBoard.Board>('/v1/mzgd/cl/user/project/overview', {});
}
