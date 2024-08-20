import { request } from '../request';

/**
 */
export function fetchCheckDefault() {
  return request.get<{ isDefault: '0' | '1' }>('/check-default');
}

export function fetchQrcode() {
  return request.get<{ qrcode: string }>('/qrcode');
}

export function resetPWd(oldPwd: string, newPwd: string) {
  return request.post<null>('/reset', { password: oldPwd, newPassword: newPwd });
}
