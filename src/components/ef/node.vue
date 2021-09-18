<template>
    <!--中间一个模型的样式 -->
    
    <div
        ref="node"
        :style="nodeContainerStyle"
        @click="clickNode"
        @mouseover="mouseover"
        @mouseup="changeNodeSite"
        @mousedown="mouseDown"
        :class="nodeContainerClass"
    >
        <!-- 拖拽点 -->
        <!-- <div v-for="(dragdot,index) in node.dragdotlen" :key="dragdot" class="ef-node-left-ico flow-node-drag dragdotposition" :style="node.style[index]"> -->
        <div ref="dot" v-for="(dragdot,index) in node.dragdotlen" :key="dragdot" class="ef-node-left-ico flow-node-drag dragdotposition" :style="node.style[index]">
            <div   :class="nodeIcoClass" ></div>
        </div> 
        <!-- 数据标注 -->
        <p v-for="(data,index) in node.dataarr" :key="index+100"  :style="data.style" class="datalabel">
            <span v-html="data.label"></span>
        </p>
        <!-- 模型图 -->
        <el-tooltip  placement="top"  effect="light">
        <div slot="content">
            <p v-for="(data,index) in node.dataarr" :key="index+200" >
                <span style="font-weight:700">{{data.label}}: </span>{{data.value}}
            </p>
        </div>
        
        <button style="padding:0;">
        <div :show-overflow-tooltip="true" style="width:150px">
            <img :src="node.imgUrl" width="100%" height="100%" alt="">
             <!-- {{node.id}} -->
        </div>
        </button>
        </el-tooltip>
    </div>
  
</template>

<script>
import modelA from '../models/modelA'
    export default {
        components:{modelA},
        props: {
            node: Object,
            activeElement: Object,
            jsPlumb: Object
        },
        data() {
            return {}
        },
        mounted(){
            
        },
        computed: {
            nodeContainerClass() {
                return {
                    'ef-node-container': true,
                    'ef-node-active': this.activeElement.type == 'node' ? this.activeElement.nodeId === this.node.id : false
                }
            },
            // 节点容器样式
            nodeContainerStyle() {
                return {
                    top: this.node.top,
                    left: this.node.left,

                }
            },
            nodeIcoClass() {
                var nodeIcoClass = {}
                nodeIcoClass[this.node.dragdotclass] = true
                // 添加该class可以拖拽连线出来，viewOnly 可以控制节点是否运行编辑
                nodeIcoClass['flow-node-drag'] = this.node.viewOnly ? false : true;
                console.log(nodeIcoClass)
                return nodeIcoClass
            }
        },
        methods: {
            //强制刷新
            forceUpdate(){
                console.log("子组件强制刷新")
                this.$forceUpdate();
            },
            //鼠标按下 就是表示要连线 当前位置为起始点
            mouseDown(e){
                // console.log("____________",e.target.parentNode.style.top);
                this.$emit('setConnParamanchorsSatrt',e.target.parentNode.style.left.split('px')[0],e.target.parentNode.style.top.split('px')[0]); //setConnParamanchorsSatrt
            },
            // 点击节点
            clickNode() {
                // console.log("dsf")
                this.$emit('clickNode', this.node);
            },
            // 鼠标移动后抬起
            changeNodeSite(e) {
                // 避免抖动
                // console.log("鼠标抬起",e.target)
                this.$emit('setConnParamanchorsEnd',e.target.parentNode.style.left.split('px')[0],e.target.parentNode.style.top.split('px')[0]); //setConnParamanchorsSatrt
                if (this.node.left == this.$refs.node.style.left && this.node.top == this.$refs.node.style.top) {
                    return;
                }
                
                this.$emit('changeNodeSite', {
                    nodeId: this.node.id,
                    left: this.$refs.node.style.left,
                    top: this.$refs.node.style.top,
                })
            },
            //鼠标经过
            mouseover(ev){
                // console.log(ev)
                // var dotlist = this.$refs.dot;
                // console.log(this.$refs.dot[0].style.backgroundColor = "red")
                // for(let i=0; i<dotlist; i++){
                //     dotlist[i].style.backgroundColor = "red";
                // }
            }
        }
    }
</script>
<style scope>
.dragdot {
    width:10px;
    height: 10px;
    background-color: black;
    border-radius: 4px;
}
.datalabel {
    font-weight: 700;
}
</style>

