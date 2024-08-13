import { mock, Random } from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';
const RESPONSE_CODE = 0;

const apis: MockMethod[] = [
  {
    url: '/mock/v1/mzgd/cl/scene/querySceneListByProjectIdToPage',
    method: 'post',
    response: (options: Service.MockOption): Service.MockServiceResult<ApiProject.PageProject> => {
      const data = mock({
        'list|25': [
          {
            sceneId: '@id',
            sceneName: '@ctitle(5, 10)',
            timeConditions: {
              time: Random.time('HH:mm'),
              timeType: '@integer(0, 3)',
              timePeriod: Random.range(1, 7).join(',')
            },
            effectiveTime: {
              timePeriod: Random.range(1, 7).join(','),
              timeType: '@integer(0, 3)', // 时间类型，0-仅一次，1-自定义，2-法定工作日，3-法定节假日
              startTime: Random.time('HH:mm:00'),
              endTime: Random.time('HH:mm:59')
            },
            isEnabled: Random.boolean()
          }
        ]
      });

      return {
        code: RESPONSE_CODE,
        msg: 'ok',
        result: {
          content: data.list,
          totalElements: 1000,
          size: options.body.pageSize,
          current: options.body.page,
          totalPages: 20
        },
        success: true,
        timestamp: 0
      };
    }
  },
  {
    url: '/mock/v1/mzgd/cl/scene/querySceneLog',
    method: 'post',
    response: (): Service.MockServiceResult<ApiProject.PageProject> => {
      const data = mock({
        'list|25': [
          {
            sceneId: '@id',
            sceneName: '@ctitle(5, 10)',
            errorCode: '@integer(0, 1)',
            reportAt: `${Random.date('yyyy-MM-dd')} ${Random.time('HH:mm:ss')}`
          }
        ]
      });

      return {
        code: RESPONSE_CODE,
        msg: 'ok',
        result: data.list,
        success: true,
        timestamp: 0
      };
    }
  }
];

export default apis;
