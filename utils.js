/**
 * 工具函数库：余弦相似度、答案转为16维向量
 */


/**
 * 计算两个向量之间的余弦相似度
 * @param {number[]} vecA 用户向量
 * @param {number[]} vecB 人物标准向量
 * @returns {number} 相似度 0 ~ 1
 */
export function calcCosSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error("向量维度不一致，必须都是16维！");
  }
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;


  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] ** 2;
    magB += vecB[i] ** 2;
  }
  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);


  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
}


/**
 * 根据用户答题答案数组，生成16维向量
 * @param {number[]} answerIdxList 选中选项下标数组 [1,2,3,1,4...]
 * @param {Array} qList 完整题库数组（当前版本暂时保留兼容占位，后续自定义计分使用）
 * @returns {number[]} 长度=16，每个值0~1
 * 【重要】这里是映射模板，后续我们可以根据你的题库调整加权规则
 */
export function getUserVector(answerIdxList, qList) {
  // 初始化16个维度全部为0
  let vec = new Array(16).fill(0);


  // ============ 这里后续根据你的题目自定义加权规则 ============
  // 示例逻辑（仅示范，后面配合完整题库再精细调整）
  answerIdxList.forEach((choose, qIndex) => {
    const weight = choose * 0.12;
    const dimIndex = qIndex % 16;
    vec[dimIndex] += weight;
  });


  // 归一化，全部限制在 0 ~ 1
  const maxVal = Math.max(...vec);
  if (maxVal > 0) {
    vec = vec.map(v => v / maxVal);
  }
  return vec;
}


/**
 * 匹配最合适的人物
 * @param {number[]} userVec 用户16维向量
 * @param {Array} personList characterList.js导出的人物数组
 * @param {number} threshold 相似度阈值，默认0.62
 * @returns {object} 匹配到的人物信息
 */
export function matchPerson(userVec, personList, threshold = 0.62) {
  const resultList = personList.map(person => {
    const sim = calcCosSimilarity(userVec, person.vector);
    return { ...person, similarity: sim };
  });
  // 相似度从高到低排序
  resultList.sort((a, b) => b.similarity - a.similarity);
  const topOne = resultList[0];


  // 低于阈值，返回兜底人物（曾国藩 id=7）
  if (topOne.similarity < threshold) {
    return personList.find(item => item.id === 7);
  }
  return topOne;
}
