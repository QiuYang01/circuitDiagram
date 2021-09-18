/**计算有关的函数 计算数据用于画图 */

const dt = 0.001;


//获取正弦波的初始数据
function getSinData(U0,f){
  var timeT = 1/f; //周期
  const iteration = parseInt(timeT/0.001); //迭代次数
  var chartData = []; //数据
  console.log("周期",timeT)
  for(let i=0; i<iteration; i++){ //生成离散的点
    let row = {'时间': '', '电压': ''};
    row.时间 = i/iteration*timeT;
    row.电压 = Math.sin(row.时间/timeT*2*Math.PI)*U0;
    chartData.push(row)
  }
  return chartData
}
export default {
  getSinData
}