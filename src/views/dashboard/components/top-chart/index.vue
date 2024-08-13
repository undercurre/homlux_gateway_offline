<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <!-- <n-grid-item span="0:24 640:24 1024:6">
      <n-card :bordered="false" class="rounded-8px shadow-sm">
        <div class="w-full h-360px py-12px">
          <h3 class="text-16px font-bold">当月数据</h3>
          <h3 class="pt-32px text-24px font-bold">
            <count-to prefix="" :start-value="0" :end-value="7754" />
          </h3>
          <p class="text-#aaa">新增项目数</p>
          <h3 class="pt-32px text-24px font-bold">
            <count-to :start-value="0" :end-value="10234" />
          </h3>
          <p class="text-#aaa">新增设备数</p>
          <h3 class="pt-32px text-24px font-bold">
            <count-to :start-value="0" :end-value="104" />
          </h3>
          <p class="text-#aaa">新增离线设备数</p>
        </div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:10">
      <n-card :bordered="false" class="rounded-8px shadow-sm">
        <div ref="lineRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item> -->
    <n-grid-item span="0:48 640:48 1024:16">
      <n-card :bordered="false" class="rounded-8px shadow-sm">
        <div ref="mapRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card :bordered="false" class="rounded-8px shadow-sm">
        <div ref="pieRef" class="w-full h-600px"></div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { Ref } from 'vue';
import type { GeoJSON } from 'echarts/types/src/coord/geo/geoTypes';
import * as echarts from 'echarts';
import { type ECOption, useEcharts } from '@/composables';
import china from '@/assets/data/china.json';
import { useBoardStore } from '~/src/store';

const board = useBoardStore();

// eslint-disable-next-line import/namespace
echarts.registerMap('china', china as GeoJSON);

defineOptions({ name: 'DashboardAnalysisTopCard' });

// const lineOptions = ref<ECOption>({
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'cross',
//       label: {
//         backgroundColor: '#6a7985'
//       }
//     }
//   },
//   legend: {
//     data: ['设备总量', '离线数量']
//   },
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true
//   },
//   xAxis: [
//     {
//       type: 'category',
//       boundaryGap: false,
//       data: ['1/2', '1/5', '1/8', '1/11', '1/14', '1/17', '1/20', '1/23', '1/26', '1/29']
//     }
//   ],
//   yAxis: [
//     {
//       type: 'value'
//     }
//   ],
//   series: [
//     {
//       color: '#26deca',
//       name: '离线数量',
//       type: 'line',
//       smooth: true,
//       stack: 'Total',
//       areaStyle: {
//         color: {
//           type: 'linear',
//           x: 0,
//           y: 0,
//           x2: 0,
//           y2: 1,
//           colorStops: [
//             {
//               offset: 0.25,
//               color: '#26deca'
//             },
//             {
//               offset: 1,
//               color: '#fff'
//             }
//           ]
//         }
//       },
//       emphasis: {
//         focus: 'series'
//       },
//       data: [1, 5, 10, 15, 20, 30, 50, 30, 20, 10]
//     }
//   ]
// }) as Ref<ECOption>;
// const { domRef: lineRef } = useEcharts(lineOptions);
const pieOptions = ref<ECOption>({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
      name: '项目数',
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        fontSize: 72,
        position: 'center',
        fontWeight: 'bold'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '72',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: board.data.projectAreaList
        ? board.data.projectAreaList.map(item => {
            return {
              value: item.projectAreaTotal,
              name: item.projectArea
            };
          })
        : []
    }
  ]
}) as Ref<ECOption>;
const { domRef: pieRef } = useEcharts(pieOptions);

const mapOptions = ref<ECOption>({
  visualMap: {
    type: 'piecewise',
    show: true,
    splitList: [
      { start: 500, end: 600 },
      { start: 200, end: 400 },
      { start: 100, end: 200 },
      { start: 10, end: 100 },
      { start: 1, end: 10 },
      { start: 0, end: 1 }
    ],
    color: ['#5475f5', '#9feaa5', '#85daef', '#74e2ca', '#e6ac53', '#9fb5ea'],
    itemWidth: 8,
    itemHeight: 8
  },
  series: [
    {
      type: 'map',
      map: 'china',
      roam: true,
      label: {
        color: 'black',
        fontSize: 10,
        show: true
      },
      itemStyle: {
        borderColor: 'black',
        borderWidth: 1
      },
      zoom: 1.2, // 控制地图的放大缩小
      data: board.data.projectAreaList.map(item => {
        return {
          name: item.projectArea,
          value: item.projectAreaTotal
        };
      }) // 数据
    }
  ]
}) as Ref<ECOption>;
const { domRef: mapRef } = useEcharts(mapOptions);

watchEffect(() => {
  pieOptions.value = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '1%',
      left: 'center',
      itemStyle: {
        borderWidth: 0
      }
    },
    series: [
      {
        color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
        name: '项目数',
        type: 'pie',
        radius: ['45%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: '12'
          }
        },
        labelLine: {
          show: false
        },
        data: board.data.projectAreaList
          ? board.data.projectAreaList.map(item => {
              return {
                value: item.projectAreaTotal,
                name: item.projectArea
              };
            })
          : []
      }
    ]
  } as ECOption;
  mapOptions.value = {
    visualMap: {
      type: 'piecewise',
      show: true,
      splitList: [
        { start: 500, end: 600 },
        { start: 200, end: 400 },
        { start: 100, end: 200 },
        { start: 10, end: 100 },
        { start: 1, end: 10 },
        { start: 0, end: 1 }
      ],
      color: ['#5475f5', '#9feaa5', '#85daef', '#74e2ca', '#e6ac53', '#9fb5ea'],
      itemWidth: 8,
      itemHeight: 8
    },
    series: [
      {
        type: 'map',
        map: 'china',
        roam: true,
        label: {
          color: 'black',
          fontSize: 10,
          show: true
        },
        itemStyle: {
          borderColor: 'black',
          borderWidth: 1
        },
        zoom: 1.2, // 控制地图的放大缩小
        data: board.data.projectAreaList.map(item => {
          return {
            name: item.projectArea,
            value: item.projectAreaTotal
          };
        }) // 数据
      }
    ]
  } as ECOption;
});
</script>

<style scoped></style>
