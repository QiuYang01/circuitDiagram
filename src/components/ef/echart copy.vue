<template>
<el-dialog
  title="信号发生器"
  :visible.sync="dialogVisible"
  width="80%"
  >
    <ve-line :data="chartData" :settings="chartSettings"></ve-line>
    {{node17data}}
    <!-- { "U0": "1", "f": "1", "信号": "正弦波" } -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

</template>
<script>
export default {
  props:["node17data"],
  data () {
    this.chartSettings = {
      // yAxisName:'电压/V',
      xAxisType: "value",//横轴的数据类型
      yAxisType: "value", //左右坐标轴数据类型
    }
    return {
      dialogVisible:false,
      chartData: {
        columns: ['时间', '电压'],
        rows: [
          // { '时间': '1/1', '电压': 1393},
          // { '时间': '1/2', '电压': 3530},
          // { '时间': '1/3', '电压': 2923},
          // { '时间': '1/4', '电压': 1723},
          // { '时间': '1/5', '电压': 3792 },
          // { '时间': '1/16', '电压': 4593}
        ],
      },
      iteration:200, //把一个周期分割成这么多小块
      // maxU:5, //电压的最大值 峰值
      // timeT:Math.PI*3, //周期

    }
  },
 
  created(){
    console.log(Math.sin(Math.PI).toFixed(2));
    this.initechart();
  },
  methods: {
    initechart(){
      this.chartData.rows = [];
      var timeT = 1/this.node17data.f; //周期
      console.log("timeT",timeT)
      for(let i=0; i<this.iteration; i++){
        let row = {'时间': '', '电压': ''};
        row.时间 = i/this.iteration*timeT;
        row.电压 = Math.sin(i/this.iteration*timeT)*this.node17data.U0;
        this.chartData.rows.push(row)
      }
      console.log(this.chartData.rows)
    },
    changedialogVisible(){
      
      this.dialogVisible = !this.dialogVisible;
      if(this.dialogVisible){
        console.log("重绘表格")
        this.initechart(); //
      }
    }
  },
  
}
</script>