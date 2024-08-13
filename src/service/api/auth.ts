import { mockRequest, request } from '../request';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(mobilePhone: string) {
  return request.post<boolean>('/v1/mzgd/cl/auth/get/captcha', { mobilePhone });
}

/**
 * 获取校验码
 * @param phone - 手机号
 */
export function fetchVerifyCode() {
  return request.post<{ verifyCodeKey: string; verifyCode: string }>('/v1/mzgd/cl/auth/get/verifyCode');
}

/**
 * 登录
 * @param params
 * @param {Object} params - 接口参数
 * @param {String} params.mobilePhone - 用户手机号码
 * @param {String} params.password - 密码
 * @param {String} params.captcha - 用户手机验证码
 * @param {String} params.verifyCode - 校验码
 */
export function fetchLogin(params: {
  mobilePhone: string;
  password?: string;
  verifyCodeKey?: string;
  verifyCode?: string;
  captcha?: string;
}) {
  return request.post<ApiAuth.Token>('/v1/mzgd/cl/auth/web/login', params);
}

/**
 * 用户重置或找回密码
 * @param {Object} params - 接口参数
 * @param {String} params.mobilePhone - 用户手机号码
 * @param {String} params.password - 新密码
 * @param {String} params.captcha - 用户手机验证码
 */
export function findPassword(params: { mobilePhone: string; password: string; captcha: string }) {
  return request.post('/v1/mzgd/cl/auth/get/findPassword', params);
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return mockRequest.get<ApiAuth.UserInfo>('/getUserInfo');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return mockRequest.post<ApiAuth.Token>('/updateToken', { refreshToken });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchDictList() {
  return request.post<ApiAuth.DictList>('/v1/mzgd/cl/user/queryDictData');
}
