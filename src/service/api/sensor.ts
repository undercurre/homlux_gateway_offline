import { request } from '../request';

/**
 * 获取传感器日志
 * @param deviceId - 设备id
 */
export function fetchSensorLog(deviceId: string) {
  return request.post<ApiDevice.SensorLog[]>('/v1/cl/device/querySensorLog', {
    deviceId
  });
}
