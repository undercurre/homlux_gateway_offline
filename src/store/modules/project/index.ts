import { defineStore } from 'pinia';
import { localStg } from '~/src/utils';

interface ProjectState {
  /** 项目列表 */
  projects: Array<ApiProject.Project>;
  projectsWithAuth: ApiUser.AuthProjectItem[];
  /** 当前处理项目 */
  curId: string;
  users: Array<{
    mobilePhone: string;
    userId: string;
    userName: string;
  }>;
}

export const useProjectStore = defineStore('project-store', {
  state: (): ProjectState => ({
    projects: [],
    projectsWithAuth: [],
    users: [],
    curId: ''
  }),
  getters: {
    curProject(state) {
      return state.projects.find(item => item.projectId === state.curId);
    },
    isLockProject(state) {
      const curProject = state.projects.find(item => item.projectId === state.curId);

      if (curProject) {
        return curProject.projectType === '02';
      }
      return false;
    }
  },
  actions: {
    /** 项目详情打开情况 */
    initCurProjectId() {
      this.getAllProjectWithAuth();
      const data = localStg.get('curProjectId');
      this.curId = data || '';
    },
    /** 项目详情打开情况 */
    cacheCurProjectId() {
      this.getAllProjectWithAuth();
      console.log('存储当前detail-curProjectId', this.curId);
      localStg.set('curProjectId', this.curId);
    },
    clearCurProjectId() {
      console.log('即将清除当前detail-curProjectId', this.curId);
      localStg.remove('curProjectId');
      this.curId = '';
    },
    async getAllProject() {
      // const ps = await fetchProjectByPage({ pageSize: 99999 });
      // if (ps.data) {
      //   this.projects = ps.data.content;
      // }
    },
    async getAllProjectWithAuth() {
      // const ps = await queryProjectByUser();
      // if (ps.data) {
      //   this.projectsWithAuth = ps.data;
      // }
    },
    async getAllUser() {
      // const us = await fetchAllMerchantUser({ projectId: this.curId });
      // if (us.data) {
      //   this.users = us.data;
      // }
      // console.log('代理商下用户列表更新');
      // return us.data;
    }
  }
});
