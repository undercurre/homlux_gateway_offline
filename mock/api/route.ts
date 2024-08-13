import type { MockMethod } from 'vite-plugin-mock';
import { routeModel, userModel } from '../model';
const RESPONSE_CODE = 0;

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (options: Service.MockOption): Service.MockServiceResult => {
      const { userId = undefined } = options.body;

      const routeHomeName: AuthRoute.LastDegreeRouteKey = 'dashboard';

      const role = userModel.find(item => item.userId === userId)?.userRole || 'user';

      const filterRoutes = routeModel[role];

      return {
        code: RESPONSE_CODE,
        msg: 'ok',
        result: {
          routes: filterRoutes,
          home: routeHomeName
        },
        success: true,
        timestamp: 0
      };
    }
  }
];

export default apis;
