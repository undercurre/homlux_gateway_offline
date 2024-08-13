import { request } from '../request';

/**
 * 获取设备详情
 * @param deviceId - 设备id
 */
export function fetchDeviceDetail(deviceId: string) {
  return request.post<ApiDevice.DetailRes>('/v1/cl/device/queryDeviceInfoByDeviceId', {
    deviceId
  });
}
