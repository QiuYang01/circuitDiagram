<template>
  <div>
		
    <canvas :id="htmlElementId" > </canvas>
    <!-- <div id="aa" style="border:1px solid #ccc;">111</div> -->
  </div>
</template>
<script>
// import {jsPlumb} from 'jsplumb'
export default {
  data() {
    return {
			htmlElementId:'',
      modelAData:{	
        R1:0,
        R2:0,
        U1:0,
        U0:0,
      }
    }
  },
  mounted(){
		this.htmlElementId = 'b'+(new Date()).getTime();
    // let plumbIns = jsPlumb.getInstance();
    // console.log(plumbIns);
    // plumbIns.ready(()=> {
    //   plumbIns.draggable('a')
    //   // console.log("sdfs")
    // })
		// this.$nextTick(() => {
		// 		this.init()
		// })
		setTimeout(()=>{this.init(),1000})
	},
	methods: {
		init(){
			// console.log(document.getElementById(this.htmlElementId))
			var canvasWidth = 240, //这个模型的宽度和高度
					canvasHeight = 200;
			var canvas = new fabric.Canvas(this.htmlElementId,{
				width : canvasWidth,
				height : canvasHeight
			});
			// console.log(canvas)
			// //绘制文字
			// console.log()
			// var a =  a = this.modelAData.R1;
			// var tex = new fabric.IText(a,{
			//   fontSize:12,
			//   left:10,
			//   top:10
			//   });
			// canvas.add(tex);
			// tex.enterEditing(); //进入编辑
			// tex.hiddenTextarea.focus();
			// tex.exitEditing(); //退出编辑

			//绘制模型的图
			let initPositionX = 0, //画图的初始位置x，y 从模型整体高度的一半出发
				initPositionY = canvasHeight/2;
			let RWidth = 30,	//电阻的宽度 后面以这个为标准
				RHeight = 10;	//电阻高度
			var path = new fabric.Path(`M ${initPositionX} 		 ${initPositionY} //从模型整体高度的一半出发
										L ${initPositionX+RWidth*1}  ${initPositionY} //画R1 向右到达开始画电阻的位置
										L ${initPositionX+RWidth*1}  ${initPositionY+RHeight} //向下
										L ${initPositionX+RWidth*2.5}  ${initPositionY+RHeight} //向右
										L ${initPositionX+RWidth*2.5}  ${initPositionY-RHeight} //向上
										L ${initPositionX+RWidth*1}  ${initPositionY-RHeight} //向左
										L ${initPositionX+RWidth*1}  ${initPositionY} //向下 画R1结束
										M ${initPositionX+RWidth*2.5}  ${initPositionY}
										L ${initPositionX+RWidth*3}  ${initPositionY} //到了交点处
										L ${initPositionX+RWidth*3.5} ${initPositionY} //信号相加相减器开始
										L ${initPositionX+RWidth*3.5} ${initPositionY-1.5*RHeight} //向上
										L ${initPositionX+RWidth*5} ${initPositionY-1.5*RHeight} //向右
										L ${initPositionX+RWidth*5} ${initPositionY+5*RHeight} //向下
										L ${initPositionX+RWidth*3.5} ${initPositionY+5*RHeight} //向左
										L ${initPositionX+RWidth*3.5} ${initPositionY} //向上
										M ${initPositionX+RWidth*3.5} ${initPositionY+3*RHeight} //往下移动一点
										L ${initPositionX+RWidth*2.5} ${initPositionY+3*RHeight} //向左
										L ${initPositionX+RWidth*2.5} ${initPositionY+4*RHeight} //向下接地
										M ${initPositionX+RWidth*2.0} ${initPositionY+4*RHeight} //第一根横线
										L ${initPositionX+RWidth*3.0} ${initPositionY+4*RHeight} 
										M ${initPositionX+RWidth*2.25} ${initPositionY+4.5*RHeight} //第二根横线
										L ${initPositionX+RWidth*2.75} ${initPositionY+4.5*RHeight} 
										M ${initPositionX+RWidth*2.45} ${initPositionY+5*RHeight} //第三根横线
										L ${initPositionX+RWidth*2.65} ${initPositionY+5*RHeight} 
										M ${initPositionX+RWidth*3} ${initPositionY} //移到交点处 向上画R2
										L ${initPositionX+RWidth*3} ${initPositionY-5*RHeight} //向上
										L ${initPositionX+RWidth*4} ${initPositionY-5*RHeight} //向右
										L ${initPositionX+RWidth*4}  ${initPositionY-4*RHeight} //开始画R2 向下
										L ${initPositionX+RWidth*5.5}  ${initPositionY-4*RHeight} //向右
										L ${initPositionX+RWidth*5.5}  ${initPositionY-6*RHeight} //向上
										L ${initPositionX+RWidth*4}  ${initPositionY-6*RHeight} //向左
										L ${initPositionX+RWidth*4}  ${initPositionY-4*RHeight} //向下 R2画完了
										M ${initPositionX+RWidth*5.5}  ${initPositionY-5*RHeight} //移动到上边那个R2的右边
										L ${initPositionX+RWidth*6.5}  ${initPositionY-5*RHeight} //向右
										L ${initPositionX+RWidth*6.5}  ${initPositionY+4*RHeight} //向下
										M ${initPositionX+RWidth*5}  ${initPositionY+4*RHeight} //移动到信号相加相减器右边
										L ${initPositionX+RWidth*8}  ${initPositionY+4*RHeight} //向右
										
										M ${initPositionX+RWidth*3} ${initPositionY-5*RHeight} //移动到在Amodel的基础上开始画C的起始位置
										L ${initPositionX+RWidth*3} ${initPositionY-8*RHeight} 
										L ${initPositionX+RWidth*4.5} ${initPositionY-8*RHeight}
										M ${initPositionX+RWidth*4.5} ${initPositionY-9*RHeight}
										L ${initPositionX+RWidth*4.5} ${initPositionY-7*RHeight}
										M ${initPositionX+RWidth*5} ${initPositionY-9*RHeight}
										L ${initPositionX+RWidth*5} ${initPositionY-7*RHeight}
										M ${initPositionX+RWidth*5} ${initPositionY-8*RHeight}
										L ${initPositionX+RWidth*6.5} ${initPositionY-8*RHeight}
										L ${initPositionX+RWidth*6.5} ${initPositionY-5*RHeight}
										`);
			path.set({
					fill : 'white', //填充的颜色
					stroke: 'BLACK', // 边框颜色
					strokeWidth: 2, // 边框大小
					selectable: false, //设置不可移动
			});
			path.hoverCursor = 'defaultCursor';  //设置鼠标样式
			canvas.add(path);
			// 监听点击事件
			canvas.on('mouse:down', (e) => {
				console.log(e);
				console.log("设置模型1的参数")
			})
		}
	},
}
</script>