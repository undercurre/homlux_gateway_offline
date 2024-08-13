import { mock } from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';
const RESPONSE_CODE = 0;

const apis: MockMethod[] = [
  {
    url: '/mock/v1/mzgd/cl/user/project/queryAll',
    method: 'post',
    response: (): Service.MockServiceResult<ApiProject.PageProject> => {
      const data = mock({
        'list|1000': [
          {
            projectId: '@id',
            projectName: '@ctitle(5, 10)',
            projectArea: '@county(true) @ctitle(5, 10) @natural(100, 999) 号',
            projectAreaCode: '@county(true) @ctitle(5, 10) @natural(100, 999) 号',
            onlineDevices: '@integer(1, 100)',
            offlineDevices: '@integer(1, 100)',
            deviceTotal: '@integer(1, 100)',
            contact:
              /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/,
            projectLeader: '@cname'
          }
        ]
      });

      return {
        code: RESPONSE_CODE,
        msg: 'ok',
        result: {
          content: data.list,
          totalElements: 1000,
          size: 50,
          current: 1,
          totalPages: 20
        },
        success: true,
        timestamp: 0
      };
    }
  },
  {
    url: '/mock/v1/mzgd/cl/user/project/add',
    method: 'post',
    response: (): Service.MockServiceResult<null> => {
      return {
        code: RESPONSE_CODE,
        msg: 'ok',
        result: null,
        success: true,
        timestamp: 0
      };
    }
  },
  {
    url: '/mock/v1/mzgd/cl/user/project/update',
    method: 'post',
    response: (): Service.MockServiceResult<null> => {
      return {
        code: RESPONSE_CODE,
        msg: 'ok',
        result: null,
        success: true,
        timestamp: 0
      };
    }
  },
  {
    url: '/mock/v1/mzgd/cl/user/project/del',
    method: 'post',
    response: (): Service.MockServiceResult<null> => {
      return {
        code: RESPONSE_CODE,
        msg: 'ok',
        result: null,
        success: true,
        timestamp: 0
      };
    }
  }
];

export default apis;
