export const strUtil = {
  /**
   * 自动化场景desc转换 区分时间条件和传感器条件
   * @param effectiveTime
   * @param timeConditions
   */
  transDesc(effectiveTime: ApiScene.effectiveTime, timeConditions?: ApiScene.TimeCondition) {
    if (timeConditions && timeConditions.time) {
      return `${timeConditions.time} ${strUtil.transPeriodDesc(timeConditions.timeType, timeConditions.timePeriod)}`;
    }
    if (strUtil.isAllday(effectiveTime)) {
      return `${strUtil.transPeriodDesc(effectiveTime.timeType, effectiveTime.timePeriod)}`;
    }
    return `${effectiveTime.startTime.substring(0, 5)}-${strUtil.transEndTimeDesc(
      effectiveTime.startTime.substring(0, 5),
      effectiveTime.endTime.substring(0, 5)
    )} ${strUtil.transPeriodDesc(effectiveTime.timeType, effectiveTime.timePeriod)}`;
  },
  isAllday(effectiveTime: ApiScene.effectiveTime) {
    const start = effectiveTime.startTime.split(':');
    const startMin = Number(start[0]) * 60 + Number(start[1]);
    const end = effectiveTime.endTime.split(':');
    const endMin = Number(end[0]) * 60 + Number(end[1]);
    if (startMin - endMin === 1 || (startMin === 0 && endMin === 1439)) {
      return true;
    }
    return false;
  },
  /**
   * 周期描述转换
   * @param timeType
   * @param timePeriod
   * @returns
   */
  transPeriodDesc(timeType: string, timePeriod: string) {
    if (timeType === '0') {
      return '仅一次';
    } else if (timeType === '2') {
      return '法定工作日';
    } else if (timeType === '3') {
      return '法定节假日';
    }
    const weekMap: Record<string, string> = {
      '1': '周日',
      '2': '周一',
      '3': '周二',
      '4': '周三',
      '5': '周四',
      '6': '周五',
      '7': '周六'
    };
    const weekArr = timePeriod.split(',');
    if (weekArr.length === 7) {
      return '每天';
    }
    const newWeekArr: string[] = [];
    weekArr.forEach(item => {
      newWeekArr.push(weekMap[item]);
    });
    return newWeekArr.join('、');
  },
  /**
   * 传入开始时间和结束时间，解释结束时间是否为次日
   * @param startTime '12:00'
   * @param endTime '14:00'
   * @returns
   */
  transEndTimeDesc(startTime: string, endTime: string) {
    const startTimeHour = parseInt(startTime.substring(0, 2), 10);
    const endTimeHour = parseInt(endTime.substring(0, 2), 10);
    const startTimeMin = parseInt(startTime.substring(startTime.indexOf(':') + 1), 10);
    const endTimeMin = parseInt(endTime.substring(endTime.indexOf(':') + 1), 10);

    if (endTimeHour < startTimeHour) {
      return `次日${endTime}`;
    } else if (endTimeHour === startTimeHour) {
      if (endTimeMin <= startTimeMin) {
        return `次日${endTime}`;
      }
      return endTime;
    }
    return endTime;
  }
};
