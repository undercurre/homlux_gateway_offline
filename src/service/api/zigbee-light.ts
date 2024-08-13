import { request } from '../request';

/**
 * 下发指令
 * @param actions - 指令
 * @param deviceId - 设备id
 * @param masterId - 网关id
 */
export function fetchZigbeeLightController(
  deviceId: string,
  masterId: string,
  actions: {
    power?: 0 | 1;
    brightness?: number;
    colorTemperature?: number;
  }
) {
  return request.post<ApiDevice.DetailRes>('/v1/cl/device/down', {
    customJson: {},
    deviceId: masterId,
    deviceType: '2',
    inputData: [
      {
        devId: deviceId,
        modelName: 'light',
        ...actions
      }
    ],
    method: 'lightControlNew',
    qos: 0,
    timeout: '0',
    topic: '/subdevice/control',
    waitReponse: false
  });
}
