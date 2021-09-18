<template>
<el-dialog
  title="信号发生器"
  :visible.sync="dialogVisible"
  width="80%"
  >
    <ve-line :data="chartData" :settings="chartSettings"></ve-line>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

</template>
<script>
export default {
  // props:["echartData"],
  data () {
    this.chartSettings = {
      xAxisType: "value",//横轴的数据类型
      yAxisType: "value", //左右坐标轴数据类型
    }
    return {
      
      dialogVisible:false,
      chartData: {
        columns: ['时间', '电压'],
        rows: [ ],
      },
      iteration:200, //把一个周期分割成这么多小块
      // maxU:5, //电压的最大值 峰值
      // timeT:Math.PI*3, //周期

    }
  },
 
  created(){
    console.log(Math.sin(Math.PI).toFixed(2));
    // this.initechart();
  },
  methods: {
    // initechart(){
    //   this.chartData.rows = [];
    //   const iteration = this.iteration;
    //   var timeT = 1/this.echartData.f; //周期
    //   // timeT = timeT*2*Math.PI; //周期乘以2PI
    //   console.log("周期",timeT)
    //   for(let i=0; i<iteration; i++){
    //     let row = {'时间': '', '电压': ''};
    //     row.时间 = i/iteration*timeT;
    //     row.电压 = Math.sin(row.时间/timeT*2*Math.PI)*this.echartData.U0;
    //     this.chartData.rows.push(row)
    //   }
    //   console.log(this.chartData.rows[0])
    // },
    changedialogVisible(echartData){
      this.dialogVisible = !this.dialogVisible;
      if(this.dialogVisible){
        console.log("重绘表格",echartData)
        // this.initechart(); //
        this.chartData.rows = echartData
      }
    }
  },
  
}
</script>