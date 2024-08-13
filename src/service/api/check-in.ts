import { request } from '../request';

/**
 * 办理入住
 * @param spaceId
 * @param checkInList
 */
export function fetchMembersCheckIn(spaceId: string, checkInList: ApiCheckIn.membersCheckInParams[]) {
  return request.post<null>('/v1/mzgd/cl/user/space/checkIn', { spaceId, checkInList });
}

/**
 * 办理续房
 * @param spaceId
 * @param extendList
 */
export function fetchMembersExtend(spaceId: string, extendList: ApiCheckIn.membersExtendParams[]) {
  return request.post<null>('/v1/mzgd/cl/user/space/extend', { spaceId, extendList });
}

/**
 * 办理退房
 * @param spaceId
 * @param checkOutList
 */
export function fetchMembersCheckOut(spaceId: string, checkOutList: ApiCheckIn.membersCheckOutParams[]) {
  return request.post<null>('/v1/mzgd/cl/user/space/checkOut', { spaceId, checkOutList });
}

/**
 * 锁定-解锁房间
 * @param spaceId
 * @param isLock 是否锁定，0-否，1-是
 */
export function fetchLockRoom(spaceId: string, isLock: number) {
  return request.post<null>('/v1/mzgd/cl/user/space/lock', { spaceId, isLock });
}

/**
 * 房间日志
 * @param params
 */
export function fetchRoomLog(params: ApiCheckIn.roomLogParams) {
  return request.post<ApiCheckIn.roomLog[]>('/v1/mzgd/cl/user/space/log/query', params);
}
