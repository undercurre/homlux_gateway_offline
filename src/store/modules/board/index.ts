import { defineStore } from 'pinia';
import { fetchOverview } from '~/src/service';

interface BoardState {
  data: ApiBoard.Board;
}

export const useBoardStore = defineStore('board-store', {
  state: (): BoardState => ({
    data: {} as ApiBoard.Board
  }),
  actions: {
    async getBoardData() {
      const res = await fetchOverview();
      if (res.data) {
        console.log('overview', res.data);
        this.data = res.data;
        this.data.projectAreaList = organizeData(this.data.projectAreaList);
      }
    }
  }
});

function organizeData(inputData: Array<ApiBoard.MapDataItem>) {
  const provinces = [
    '北京',
    '天津',
    '河北',
    '山西',
    '内蒙古',
    '辽宁',
    '吉林',
    '黑龙江',
    '上海',
    '江苏',
    '浙江',
    '安徽',
    '福建',
    '江西',
    '山东',
    '河南',
    '湖北',
    '湖南',
    '广东',
    '广西',
    '海南',
    '重庆',
    '四川',
    '贵州',
    '云南',
    '西藏',
    '陕西',
    '甘肃',
    '青海',
    '宁夏',
    '新疆',
    '台湾',
    '香港',
    '澳门'
  ];

  const provincesRight = [
    '北京市',
    '天津市',
    '河北省',
    '山西省',
    '内蒙古自治区',
    '辽宁省',
    '吉林省',
    '黑龙江省',
    '上海市',
    '江苏省',
    '浙江省',
    '安徽省',
    '福建省',
    '江西省',
    '山东省',
    '河南省',
    '湖北省',
    '湖南省',
    '广东省',
    '广西壮族自治区',
    '海南省',
    '重庆市',
    '四川省',
    '贵州省',
    '云南省',
    '西藏自治区',
    '陕西省',
    '甘肃省',
    '青海省',
    '宁夏回族自治区',
    '新疆维吾尔自治区',
    '台湾省',
    '香港特别行政区',
    '澳门特别行政区'
  ];

  const result: {
    [key: string]: ApiBoard.MapDataItem;
  } = {};

  inputData.forEach(item => {
    const projectArea = item.projectArea;
    const str = provinces.find(province => projectArea.includes(province));
    if (str) {
      const rightStr = provincesRight.find(province => province.includes(str));
      if (rightStr) {
        // 如果项目区域已存在于结果中，则累加项目总量
        if (result[rightStr]) {
          result[rightStr].projectAreaTotal += item.projectAreaTotal;
        } else {
          // 否则，将项目区域添加到结果中
          result[rightStr] = {
            projectArea: rightStr,
            projectAreaTotal: item.projectAreaTotal
          };
        }
      }
    }
  });

  // 将结果转换为数组形式
  const organizedData = Object.values(result);

  return organizedData;
}
