<template>
<el-dialog
  :visible.sync="dialogVisible"
  width="80%"
  top="10vh"
  >
  <p slot="title">
    模型{{echarttitle?echarttitle.name:""}}
    
    <excel-download
        style="float:right;margin-top:20px"
        type="success"
        :excelParam="excelParam"
        :data="tempechartdata"
        :title="echarttitle?`模型${echarttitle.name}的数据`:'请输入文件名'"
    ></excel-download>
  </p>
  <!-- {{echartData[0]}} -->
  
     
    <ve-line :data="echartData"  :settings="chartSettings" :title="title" :legend-visible="false" :yAxis="yAxis" ></ve-line>
  <span slot="footer" class="dialog-footer">
    <!-- <el-button @click="dialogVisible = false"></el-button> -->
    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
  </span>
</el-dialog>
</template>
<script>
export default {
  props:["tempechartdata","echarttitle"],
  data () {
    this.title = {
      // text: "Main Title",
      // subtext: "Sub Title",
      // left: "center",
      // top: "top",
    }
    this.yAxis = {
      name:"电压"
    }
    
    this.chartSettings = {
      xAxisType: "value",//横轴的数据类型
      // xAxisName: "时间",
      // yAxisName: "电压",
    }
    return {
      dialogVisible:false,
      echartData: {
        columns: ['时间', '电压'],
        rows: [],
      },
      iteration:200, //把一个周期分割成这么多小块
      // maxU:5, //电压的最大值 峰值
      // timeT:Math.PI*3, //周期

      excelParam:{ //导出excel的head
          head: [
          "时间",
          "电压",
          ],
          filter: [
          "时间",
          "电压",
          ]
      },
    }
  },
 
  created(){
    // console.log(Math.sin(Math.PI).toFixed(2));
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
    changedialogVisible(){
      this.dialogVisible = !this.dialogVisible;
      if(this.dialogVisible){
        // console.log("重绘表格",this.tempechartdata)
        // this.initechart(); //
        this.echartData.rows = this.tempechartdata
      }
    }
  },
  
}
</script>