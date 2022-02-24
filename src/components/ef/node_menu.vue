<template>
    <div class="flow-menu" ref="tool">
        <!-- 左侧供选择模型 -->
        <!-- {{menuList}} -->
        <div v-for="menu  in  menuList" :key="menu.id">
            <span class="ef-node-pmenu" @click="menu.open = !menu.open"><i :class="{'el-icon-caret-bottom': menu.open,'el-icon-caret-right': !menu.open}"></i>&nbsp;{{menu.name}}</span>
            <ul v-show="menu.open" class="ef-node-menu-ul">
                <draggable @end="end" @start="move" v-model="menu.children" :options="draggableOptions">
                    <li v-for="subMenu in menu.children" class="ef-node-menu-li" :key="subMenu.id" :type="subMenu.type">
                        <!-- <i :class="subMenu.ico"></i>  -->
                        <div v-if="subMenu.name==17">
                            <img :src="subMenu.imgUrl" width="100%" alt="" />信号发生器
                        </div>
                        <div v-if="subMenu.name==18">
                            <img :src="subMenu.imgUrl" width="100%" alt="" />示波器
                        </div>
                         <div v-if="subMenu.name!=17&subMenu.name!=18">
                            <img :src="subMenu.imgUrl" width="100%" alt="" />模型{{subMenu.name}}
                        </div>
                        
                        <!-- <modelA v-show="subMenu.model=='a'"></modelA>
                        <modelB v-show="subMenu.model=='b'"></modelB> -->
                    </li>
                </draggable>
            </ul>
        </div>
    </div>
</template>
<script>
import modelA from '../models/modelA'
import modelB from '../models/modelB'
import draggable from 'vuedraggable'
var mousePosition = {
    left: -1,
    top: -1
}
export default {
    components:{draggable,modelA,modelB},
    data() {
        return {
            activeNames: '1', 
            // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html 
            draggableOptions: {
                preventOnFilter: false,
                sort: false,
                disabled: false,
                ghostClass: 'tt',
                // 不使用H5原生的配置
                forceFallback: true,
                // 拖拽的时候样式
                fallbackClass: 'flow-node-draggable'
            },
            // 默认打开的左侧菜单的id
            defaultOpeneds: ['1', '2'],
            /**
             * A 11 https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618921154938image.png
             * C 13 https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618921228538image.png
             * D 14 https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618921265974image.png
             * E 15 https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618921300103image.png
             */
            menuList: [
                {
                    id: '2',
                    type: 'group',
                    name: '元件',
                    dragdotlen:1, //课拖拽点的个数
                    dragdotclass: 'el-icon-video-pause',
                    open: true,
                    children: [
                        {
                            echart:[], //结果图像显示
                            id: '17', //信号发生器
                            type: 'timer17',
                            name: '17',
                            dragdotlen:1, //可拖拽点的个数
                            dragdotclass: 'dragdot',
                            imgUrl:'https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618797925307image.png',
                            // 自定义覆盖拖拽点的样式
                            style: [{ //每个拖拽点的样式
                                top:"85px",
                                left:"144px",
                            }],
                            dataarr:[ //存放标在图上的数据 还会渲染在右边编辑区
                               {
                                   edit:true,
                                    label:'U0',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"60px",
                                        left:"37px" 
                                    } 
                                }, 
                                {
                                    label:'f',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"40px",
                                        left:"117px" 
                                    } 
                                }, 
                                {
                                    label:'信号',
                                    value:null,
                                    options: [{
                                        value: '正弦波',
                                        label: '正弦波'
                                        }, {
                                        value: '锯齿波',
                                        label: '锯齿波'
                                        }, {
                                        value: '方波',
                                        label: '方波'
                                        }],
                                    style:{
                                        position: 'absolute',
                                        top:"-10px",
                                        left:"80px" 
                                    } 
                                },
                                
                            ],
                            
                        }, 
                        {
                            echart:[], //结果图像显示
                            id: '18', //示波器
                            type: 'timer18',
                            name: '18',
                            dragdotlen:1, //可拖拽点的个数
                            dragdotclass: 'dragdot',
                            imgUrl:'https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618800255455image.png',
                            // 自定义覆盖拖拽点的样式
                            style: [{ //每个拖拽点的样式
                                top:"30px",
                                left:"0px",
                            }],
                            dataarr:[ //存放标在图上的数据 还会渲染在右边编辑区
                               {
                                    
                                    label:'U1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"20px",
                                        left:"25px" 
                                    } 
                                },
                            ],
                            
                        },
                    ]
                },
                {
                    id: '1',
                    type: 'group',
                    name: '模型',
                    ico: 'el-icon-video-play',
                    open: true,
                    children: [
                        {
                            echart:[], //结果图像显示
                            id: '11', //模型A
                            type: 'timer11',
                            name: '11',
                            dragdotlen:2, //可拖拽点的个数
                            dragdotclass: 'dragdot',
                            imgUrl:'https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618921154938image.png',
                            // 自定义覆盖拖拽点的样式
                            style: [{ //每个拖拽点的样式
                                top:"72px",
                                left:"141px",
                            },{
                                top:"46px",
                                left:"-1px",
                            }],
                            dataarr:[ //存放标在图上的数据 还会渲染在右边编辑区
                                {
                                    label:'R1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"13px",
                                        left:"25px" 
                                    } 
                                },
                                {
                                    label:'R2',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"-18px",
                                        left:"78px" 
                                    } 
                                },
                                
                                {
                                    label:'U0',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"50px",
                                        left:"152px" 
                                    } 
                                },
                                {
                                    label:'U1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"23px",
                                        left:"-20px" 
                                    } 
                                }
                            ],
                            
                        },  
                        {
                            echart:[], //结果图像显示
                            id: '12', //模型B
                            type: 'task',
                            name: '12',
                            dragdotlen:2, //课拖拽点的个数
                            dragdotclass: 'dragdot',
                            imgUrl : 'https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618367283849image.png',
                            // 自定义覆盖样式
                             style: [{ //每个拖拽点的样式
                                top:"70px",
                                left:"141px"

                            },{
                                top:"42px",
                                left:"-1px"
                            }],
                            dataarr:[ //存放标在图上的数据 还会渲染在右边编辑区
                                {
                                    label:'R1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"8px",
                                        left:"23px" 
                                    } 
                                },
                                {
                                    label:'U0',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"40px",
                                        left:"150px" 
                                    } 
                                },
                                {
                                    label:'U1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"10px",
                                        left:"-20px" 
                                    } 
                                },
                                {
                                    label:'C',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"-25px",
                                        left:"90px" 
                                    } 
                                },
                            ],
                        },
                        {
                            echart:[], //结果图像显示
                            id: '13', //模型C
                            type: 'task13',
                            name: '13',
                            dragdotlen:2, //课拖拽点的个数
                            dragdotclass: 'dragdot',
                            imgUrl : 'https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618921228538image.png',
                            // 自定义覆盖样式
                             style: [{ //每个拖拽点的样式
                                top:"62px",
                                left:"141px"

                            },{
                                top:"42px",
                                left:"-1px"
                            }],
                            dataarr:[ //存放标在图上的数据 还会渲染在右边编辑区
                                {
                                    label:'R1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"8px",
                                        left:"20px" 
                                    } 
                                },
                                {
                                    label:'R2',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"8px",
                                        left:"58px" 
                                    } 
                                },
                                {
                                    label:'R3',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"8px",
                                        left:"85px" 
                                    } 
                                },
                                {
                                    label:'U0',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"40px",
                                        left:"150px" 
                                    } 
                                },
                                {
                                    label:'U1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"15px",
                                        left:"-20px" 
                                    } 
                                },
                                {
                                    label:'C',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"-25px",
                                        left:"98px" 
                                    } 
                                },
                            ],
                        },
                        {
                            echart:[], //结果图像显示
                            id: '14', //模型D
                            type: 'timer14',
                            name: '14',
                            dragdotlen:2, //可拖拽点的个数
                            dragdotclass: 'dragdot',
                            imgUrl:'https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618921265974image.png',
                            // 自定义覆盖拖拽点的样式
                            style: [{ //每个拖拽点的样式
                                top:"58px",
                                left:"143px",
                            },{
                                top:"38px",
                                left:"-1px",
                            }],
                            dataarr:[ //存放标在图上的数据 还会渲染在右边编辑区
                                {
                                    label:'R1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"6px",
                                        left:"19px" 
                                    } 
                                },
                                {
                                    label:'R2',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"-17px",
                                        left:"63px" 
                                    } 
                                },
                                {
                                    label:'C',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"-17px",
                                        left:"107px" 
                                    } 
                                },
                                {
                                    label:'U0',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"55px",
                                        left:"152px" 
                                    } 
                                },
                                {
                                    label:'U1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"28px",
                                        left:"-20px" 
                                    } 
                                }
                            ],
                            
                        }, 
                        {
                            echart:[], //结果图像显示
                            id: '15', //模型D
                            type: 'timer15',
                            name: '15',
                            dragdotlen:2, //可拖拽点的个数
                            dragdotclass: 'dragdot',
                            imgUrl:'https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618921300103image.png',
                            // 自定义覆盖拖拽点的样式
                            style: [{ //每个拖拽点的样式
                                top:"58px",
                                left:"143px",
                            },{
                                top:"38px",
                                left:"-1px",
                            }],
                            dataarr:[ //存放标在图上的数据 还会渲染在右边编辑区
                                {
                                    label:'R1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"6px",
                                        left:"19px" 
                                    } 
                                },
                                {
                                    label:'R2',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"-20px",
                                        left:"63px" 
                                    } 
                                },
                                {
                                    label:'C1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"-20px",
                                        left:"17px" 
                                    } 
                                },
                                {
                                    label:'C2',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"-20px",
                                        left:"107px" 
                                    } 
                                },
                                {
                                    label:'U0',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"48px",
                                        left:"152px" 
                                    } 
                                },
                                {
                                    label:'U1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"28px",
                                        left:"-20px" 
                                    } 
                                }
                            ],
                            
                        }, 
                        {
                            echart:[], //结果图像显示
                            id: '16', //模型F
                            type: 'timer',
                            name: '16',
                            dragdotlen:2, //可拖拽点的个数
                            dragdotclass: 'dragdot',
                            imgUrl:'https://rjlmpic-1300589041.cos.ap-nanjing.myqcloud.com/articleImg/131618367186407image.png',
                            // 自定义覆盖拖拽点的样式
                            style: [{ //每个拖拽点的样式
                                top:"83px",
                                left:"141px",
                            },{
                                top:"56px",
                                left:"-1px",
                            }],
                            dataarr:[ //存放标在图上的数据 还会渲染在右边编辑区
                                {
                                    label:'R1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"20px",
                                        left:"25px" 
                                    } 
                                },
                                {
                                    label:'R2',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"19px",
                                        left:"78px" 
                                    } 
                                },
                                {
                                    label:'C',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"-25px",
                                        left:"85px" 
                                    } 
                                },
                                {
                                    label:'U0',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"55px",
                                        left:"152px" 
                                    } 
                                },
                                {
                                    label:'U1',
                                    value:null,
                                    style:{
                                        position: 'absolute',
                                        top:"28px",
                                        left:"-20px" 
                                    } 
                                }
                            ],
                            
                        }, 
                        
                    ]
                },
                
            ],
            nodeMenu: {}
        }
    },

    created() {
        /**
         * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
         * @param event
         */
        if (this.isFirefox()) {
            document.body.ondrop = function (event) {
                // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
                mousePosition.left = event.layerX
                mousePosition.top = event.clientY - 50
                event.preventDefault();
                event.stopPropagation();
            }
        }
    },
    methods: {
        // 根据类型获取左侧菜单对象
        getMenuByType(type) {
            for (let i = 0; i < this.menuList.length; i++) {
                let children = this.menuList[i].children;
                for (let j = 0; j < children.length; j++) {
                    if (children[j].type === type) {
                        return children[j]
                    }
                }
            }
        },
        // 拖拽开始时触发
        move(evt, a, b, c) {
            console.log("拖拽开始")
            var type = evt.item.attributes.type.nodeValue
            this.nodeMenu = this.getMenuByType(type);
            console.log(this.nodeMenu)
            
        },
        // 拖拽结束时触发
        end(evt, e) {
            console.log("拖拽结束")
            this.$emit('addNode', evt, this.nodeMenu, mousePosition)
        },
        // 是否是火狐浏览器
        isFirefox() {
            var userAgent = navigator.userAgent
            if (userAgent.indexOf("Firefox") > -1) {
                return true
            }
            return false
        }
    }
}
</script>
