import { mock } from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';
const RESPONSE_CODE = 0;

const apis: MockMethod[] = [
  {
    url: '/mock/v1/mzgd/cl/user/account/query',
    method: 'post',
    response: (): Service.MockServiceResult<ApiUser.PageSysUser> => {
      const data = mock({
        'list|1000': [
          {
            userId: '@id',
            userName: '@cname',
            createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
            'roleType|1': [0, 1, 2],
            'roleName|1': ['总部管理员', '项目管理员', '项目使用者'],
            mobile:
              /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/,
            'status|1': [0, 1],
            'statusName|1': ['未激活', '已激活']
          }
        ]
      });

      return {
        code: RESPONSE_CODE,
        msg: 'ok',
        result: {
          content: data.list,
          current: 1,
          size: 50,
          totalElements: 1000,
          totalPages: 20
        },
        success: true,
        timestamp: 0
      };
    }
  },
  {
    url: '/mock/v1/mzgd/cl/user/account/add',
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
    url: '/mock/v1/mzgd/cl/user/account/update',
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
    url: '/mock/v1/mzgd/cl/user/account/del',
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
