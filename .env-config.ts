/** 请求服务的环境配置 */
type ServiceEnv = Record<ServiceEnvType, ServiceEnvConfig>;

/** 不同请求服务的环境域名配置 */
const serviceEnv: ServiceEnv = {
  dev: {
    url: 'https://test.meizgd.com/mzaio'
  },
  test: {
    url: 'https://test.meizgd.com/mzaio'
  },
  prod: {
    url: 'https://mzaio.meizgd.com/mzaio'
  }
};

/**
 * 获取当前环境模式下的请求服务的配置
 * @param env 环境
 */
export function getServiceEnvConfig(env: ImportMetaEnv): ServiceEnvConfigWithProxyPattern {
  const { VITE_SERVICE_ENV = 'dev' } = env;

  const config = serviceEnv[VITE_SERVICE_ENV];

  return {
    ...config,
    proxyPattern: '/shangzhao'
  };
}
