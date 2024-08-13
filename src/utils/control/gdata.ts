// 函数来剥离指定属性并合并对象
export function updateMemoryObject(data: any, propertiesToStrip: string[], hadMemoryObject: any) {
  // 创建一个新的对象副本来进行修改
  const updatedData = { ...data };

  // 剥离指定属性
  propertiesToStrip.forEach(prop => delete updatedData[prop]);

  // 合并对象
  const memoryObject = { ...hadMemoryObject, ...updatedData };

  // 打印合并后的对象
  console.log('合并后', memoryObject);

  return memoryObject;
}

/**
 * 获取对象中除了指定属性外的其他属性的字符串数组
 * @param {Object} obj - 要处理的对象
 * @param {Array} propertiesToExclude - 需要剥离的属性数组
 * @returns {Array} - 剩余属性的字符串数组
 */
export function getRemainingProperties(obj: any, propertiesToExclude: string[]) {
  // 获取对象的所有属性
  const allProperties = Object.keys(obj);

  // 过滤掉指定的属性
  const remainingProperties = allProperties.filter(prop => !propertiesToExclude.includes(prop));

  // 返回剩余属性的字符串数组
  return remainingProperties;
}
