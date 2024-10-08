import axios from 'axios';
import type { AxiosResponse, AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import { REFRESH_TOKEN_CODE } from '@/config';
import { useAuthStore } from '@/store';
import {
  localStg,
  handleAxiosError,
  handleBackendError,
  handleResponseError,
  handleServiceResult,
  transformRequestData
} from '@/utils';
// import { handleRefreshToken } from './helpers';

type RefreshRequestQueue = (config: AxiosRequestConfig) => void;

/**
 * 封装axios请求类
 * @author Soybean<honghuangdc@gmail.com>
 */
export default class CustomAxiosInstance {
  instance: AxiosInstance;

  backendConfig: Service.BackendResultConfig;

  isRefreshing: boolean;

  retryQueues: RefreshRequestQueue[];

  /**
   *
   * @param axiosConfig - axios配置
   * @param backendConfig - 后端返回的数据配置
   */
  constructor(
    axiosConfig: AxiosRequestConfig,
    backendConfig: Service.BackendResultConfig = {
      codeKey: 'code',
      dataKey: 'data',
      msgKey: 'msg',
      successCode: 200
    }
  ) {
    this.backendConfig = backendConfig;
    this.instance = axios.create(axiosConfig);
    this.setInterceptor();
    this.isRefreshing = false;
    this.retryQueues = [];
  }

  /** 设置请求拦截器 */
  setInterceptor() {
    this.instance.interceptors.request.use(
      async config => {
        const handleConfig = { ...config };
        handleConfig.data = handleConfig.data || {};

        if (handleConfig.headers) {
          // 数据转换
          const contentType = handleConfig.headers['Content-Type'] as UnionKey.ContentType;
          handleConfig.data = await transformRequestData(handleConfig.data, contentType);
          // 设置token
          handleConfig.headers.Authorization = localStg.get('token') || '';
        }

        if (handleConfig.data) {
          handleConfig.data = {
            ...handleConfig.data,
            frontendType: 'web',
            reqId: `${_.random(100000, 999999).toString(36)}-${Date.now().toString(36)}`,
            systemSource: 'windows',
            timestamp: 0
          };
        }
        return handleConfig;
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
    this.instance.interceptors.response.use(
      (async response => {
        const { status } = response;

        if (status === 200 || status === 201 || status < 300 || status === 304) {
          const backend = response.data;
          const { codeKey, dataKey, successCode } = this.backendConfig;
          // 请求成功
          if (backend[codeKey] === successCode) {
            return handleServiceResult(null, backend[dataKey]);
          }

          // token失效, 退出登录
          if (REFRESH_TOKEN_CODE.includes(backend[codeKey])) {
            const { resetAuthStore } = useAuthStore();

            resetAuthStore();
            // 原始请求
            // const originRequest = new Promise(resolve => {
            //   this.retryQueues.push((refreshConfig: AxiosRequestConfig) => {
            //     config.headers.Authorization = refreshConfig.headers?.Authorization;
            //     resolve(this.instance.request(config));
            //   });
            // });
            // if (!this.isRefreshing) {
            //   this.isRefreshing = true;
            //   const refreshConfig = await handleRefreshToken(response.config);
            //   if (refreshConfig) {
            //     this.retryQueues.map(cb => cb(refreshConfig));
            //   }
            //   this.retryQueues = [];
            //   this.isRefreshing = false;
            // }
            // return originRequest;
          }

          const error = handleBackendError(backend, this.backendConfig);
          return handleServiceResult(error, null);
        }
        const error = handleResponseError(response);
        return handleServiceResult(error, null);
      }) as (response: AxiosResponse<any, any>) => unknown as (
        response: AxiosResponse<any, any>
      ) => AxiosResponse<any, any>,
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
  }
}
