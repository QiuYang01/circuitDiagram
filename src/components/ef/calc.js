/**计算有关的函数 计算数据用于画图 */

const dt = 0.005;


//获取正弦波的初始数据
function getSinData(U0,f){
  var timeT = 1/f; //周期
  const iteration = parseInt(timeT/dt); //迭代次数
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

//获取锯齿波的初始数据
function getjvchiData(U0,f){
  var timeT = 1/f; //周期
  const iteration = parseInt(timeT/dt); //迭代次数
  var chartData = []; //数据
  for(let i=0; i<iteration; i++){ //斜线
    let row = {'时间': '', '电压': ''};
    row.时间 = i/iteration*timeT;
    row.电压 = U0/iteration*i;
    chartData.push(row)
  }
  for(let i=1; i<=iteration; i++){ //垂线
    let row = {'时间': '', '电压': ''};
    row.时间 = timeT;
    row.电压 = U0/iteration*(iteration-i);
    chartData.push(row)
  }
  return chartData
}

//获取方波初始数据
function getfangboData(U0,f){
  var timeT = 1/f; //周期
  const iteration = parseInt(timeT/dt); //迭代次数
  var chartData = []; //数据
  for(let i=0; i<iteration/2; i++){ //低的水平线
    let row = {'时间': '', '电压': ''};
    row.时间 = i/iteration*timeT;
    row.电压 = 0;
    chartData.push(row)
  }
  for(let i=0; i<iteration/2; i++){ //垂直线
    let row = {'时间': '', '电压': ''};
    row.时间 = timeT/2;
    row.电压 = U0/iteration*i*2;
    chartData.push(row)
  }
  for(let i=iteration/2+1; i<iteration; i++){ //搞的水平线
    let row = {'时间': '', '电压': ''};
    row.时间 = timeT;
    row.电压 = U0;
    chartData.push(row)
  }
  for(let i=0; i<iteration/2; i++){ //垂直线
    let row = {'时间': '', '电压': ''};
    row.时间 = timeT;
    row.电压 = U0/iteration*(iteration/2-i)*2;
    chartData.push(row)
  }
  return chartData
}

//模型A
function modelA(U1,R1,R2){
  // console.log("modelA---",U1,R1,R2)
  let U0 = [];
  let temp={
    "时间": 0,
    "电压": 0
  }
  for(let i=0; i<U1.length; i++){
    temp = U1[i];
    temp.电压 = -(R2/R1)*temp.电压
    U0.push(temp)
  }
  console.log("模型A得到的数据",U0)
  return U0;
}

//模型B
function modelB(U1,R1,C){
  var U0 = [
    {
      "时间": 0,
      "电压": 0
    }
  ];
  let temp={
    "时间": 0,
    "电压": 0
  }
  for(let i=1; i<U1.length; i++){
    temp = U1[i];
    temp.电压 = U0[i-1].电压 - (1/R1*C) * temp.电压 * (dt)
    U0.push(temp)
  }
  console.log("模型B得到的数据",U0)
  return U0;
}

//模型C
function modelC(U1,R1,R2,R3,C){
  let templow  = {};
  var U0 = [
    {
      "时间": 0,
      "电压": 0
    }
  ];
  let temp;
  for(let i=1; i<U1.length; i++){
    templow = U1[i-1];
    temp = JSON.parse(JSON.stringify(U1[i]));
    temp.电压 = -1*((R3+R2)/R1) * (temp.电压+((R2*R3)/(R2+R3)) * C * ((temp.电压-templow.电压)/dt) )
    U0.push(temp)
  }
  console.log("模型C得到的数据",U0)
  return U0;
}

//模型D
function modelD(U1,R1,R2,C){
  let templow  = {};
  var U0 = [
    {
      "时间": 0,
      "电压": 0
    }
  ];
  let temp={
    "时间": 0,
    "电压": 0
  }
  for(let i=1; i<U1.length; i++){
    templow = U1[i-1];
    temp = JSON.parse(JSON.stringify(U1[i]));
    temp.电压 =U0[i-1].电压 +   (-1/(R2*C)) * ((R2/R1) * temp.电压 + ((R2*R2*C)/R1) * ((temp.电压-templow.电压)/dt) )*dt;
    
    U0.push(temp)
  }
  console.log("模型D得到的数据",U0)
  return U0;
}

//模型E
function modelE(U1,R1,R2,C1,C2){
  let templow  = {};
  var U0 = [
    {
      "时间": 0,
      "电压": 0
    }
  ];
  let temp={
    "时间": 0,
    "电压": 0
  }
  for(let i=1; i<U1.length; i++){
    templow = U1[i-1];
    temp = JSON.parse(JSON.stringify(U1[i]));
    temp.电压 =U0[i-1].电压 +  ((-1/R1*C2)*( temp.电压 + (R1*C1 + R2*C2)*((temp.电压-templow.电压)/dt) + (R1*C1*R2*C2)*((temp.电压-templow.电压)/dt/dt)))*dt;
    // console.log(temp.电压)
    U0.push(temp)
  }
  console.log("模型E得到的数据",U0)
  return U0;
}

//模型F
function modelF(U1,R1,R2,C){
  let templow  = {};
  var U0 = [
    {
      "时间": 0,
      "电压": 0
    }
  ];
  let temp={
    "时间": 0,
    "电压": 0
  }
  for(let i=1; i<U1.length; i++){
    templow = U1[i-1];
    temp = JSON.parse(JSON.stringify(U1[i]));
    temp.电压 =-1*((R2/R1)*(temp.电压)*dt+templow.电压 )/(dt+R2*C)
    U0.push(temp)
  }
  console.log("模型F得到的数据",U0)
  return U0;
}
export default {
  getSinData,
  getjvchiData,
  getfangboData,
  modelA,
  modelB,
  modelC,
  modelD,
  modelE,
  modelF
  
}