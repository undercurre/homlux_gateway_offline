import { request } from '../request';

/**
 * 查询代理商列表（分页)
 * @param params
 */
export function fetchMerchantListByPage(params: ApiMerchant.PageQueryParams) {
  return request.post<ApiMerchant.PageMerchant>('/v1/mzgd/cl/user/merchant/queryListByPage', {
    xsc: 'DESC',
    ...params
  });
}

/**
 * 查询代理商列表（不分页)
 * @param params
 */
export function fetchMerchantList() {
  return request.post<ApiMerchant.PageMerchant>('/v1/mzgd/cl/user/merchant/queryListAll');
}

/**
 * 增加代理商
 * @param params
 */
export function fetchAddMerchant(params: ApiMerchant.CreateMerchantParams) {
  return request.post<null>('/v1/mzgd/cl/user/merchant/add', params);
}

/**
 * 编辑代理商
 * @param params
 */
export function fetchUptMerchant(params: ApiMerchant.UpdateMerchantParams) {
  return request.post<null>('/v1/mzgd/cl/user/merchant/update', params);
}

/**
 * 删除代理商
 * @param params
 */
export function fetchDelMerchant(merchantCode: string) {
  return request.post<null>('/v1/mzgd/cl/user/merchant/del', { merchantCode });
}

/**
 * 代理商手机号码变更
 * @param params
 */
export function updateMerchantMobile(params: { merchantCode: string; oldMobilePhone: string; newMobilePhone: string }) {
  return request.post<null>('/v1/mzgd/cl/user/merchant/mobilePhone/update', params);
}

/**
 * 查询所有代理商
 * @param params
 */
export function queryMerchantListAll() {
  return request.post<ApiMerchant.MerchantItem>('/v1/mzgd/cl/user/merchant/queryListAll');
}

/**
 * 查询所有代理商
 * @param params
 */
export function queryMerchantByUser() {
  return request.post<ApiMerchant.MerchantItem>('/v1/mzgd/cl/user/merchant/queryByUser');
}

/**
 *  * 查询指定代理商项目列表（分页）
 * @param params
 */
export function queryProjectListByPage(params: ApiMerchant.PageQueryProjectListParams) {
  return request.post<ApiMerchant.PageProject>('/v1/mzgd/cl/user/merchant/queryProjectListByPage', params);
}
