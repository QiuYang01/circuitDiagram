<template>
    <div v-if="easyFlowVisible" style="height: calc(100vh);">
        <el-row>
            <!--顶部工具菜单-->
            <el-col :span="24">
                <div class="ef-tooltar">
                    <el-link type="primary" :underline="false">物理画图</el-link>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" icon="el-icon-delete" size="large" @click="deleteElement" :disabled="!this.activeElement.type"></el-button>
                    <!-- <el-divider direction="vertical"></el-divider>
                    <el-button type="text" icon="el-icon-download" size="large" @click="downloadData"></el-button> -->
                    <!-- <el-divider direction="vertical"></el-divider>
                    <el-button type="text" icon="el-icon-plus" size="large" @click="zoomAdd"></el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" icon="el-icon-minus" size="large" @click="zoomSub"></el-button> -->
                    <el-button @click="show17chart()">测试查看信号发生器</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 当前激活的：{{activeElement}} -->
        
        <div style="display: flex;height: calc(100% - 47px);">
            <div style="width: 230px;border-right: 1px solid #dce3e8;overflow: scroll;">
                <node-menu @addNode="addNode" ref="nodeMenu"></node-menu>
            </div>
            
            <div id="efContainer" ref="efContainer" class="container" v-flowDrag>
                <!-- {{data.nodeList}}<br /> -->
            <!-- {{anchorsStart}}{{anchorsEnd}} -->
                <template v-for="node in data.nodeList" >
                    <flow-node
                        :ref="node.id"
                        :id="node.id"
                        :key="node.id"
                        :node="node"
                        :activeElement="activeElement"
                        :jsPlumb="jsPlumb"
                        @changeNodeSite="changeNodeSite"
                        @nodeRightMenu="nodeRightMenu"
                        @clickNode="clickNode"
                       @setConnParamanchorsSatrt="setConnParamanchorsSatrt"
                       @setConnParamanchorsEnd="setConnParamanchorsEnd"
                    >
                    </flow-node>
                </template>
                <!-- 给画布一个默认的宽度和高度 -->
                <div style="position:absolute;top: 5000px;left: 2000px;">&nbsp;</div>
            </div>
            <!-- 右侧表单 -->
            
            <div style="width: 300px;border-left: 1px solid #dce3e8;background-color: #FBFBFB">
                <flow-node-form ref="nodeForm" @setLineLabel="setLineLabel" @repaintEverything="repaintEverything"></flow-node-form>
            </div>
        </div>
        <!-- 流程数据详情 -->
        <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
        <flow-help v-if="flowHelpVisible" ref="flowHelp"></flow-help>
        <!-- 显示结果 -->
        <echart ref="echart17" :node17data="node17data"></echart>
    </div>

</template>

<script>
    import draggable from 'vuedraggable'
    // import { jsPlumb } from 'jsplumb'
    // 使用修改后的jsplumb
    import '../../assets/js/jsplumb'
    import { easyFlowMixin } from '@/assets/js/mixins'
    import flowNode from '@/components/ef/node'
    import nodeMenu from '@/components/ef/node_menu'
    import FlowInfo from '@/components/ef/info'
    import FlowHelp from '@/components/ef/help'
    import FlowNodeForm from './node_form'
    import lodash from 'lodash'
    import { getDataB } from '../../assets/js/data_B'
    import echart from './echart'
    import calc from "./calc"

    export default {
        data() {
            return {
                node17data:{}, //绘制信号发生器曲线的数据
                // jsPlumb 实例
                jsPlumb: null,
                // 控制画布销毁
                easyFlowVisible: true,
                // 控制流程数据显示与隐藏
                flowInfoVisible: false,
                // 是否加载完毕标志位
                loadEasyFlowFinish: false,
                flowHelpVisible: false,
                // 数据
                data: {
                   
                },
                // 激活的元素、可能是节点、可能是连线
                activeElement: {
                    // 可选值 node 、line
                    type: undefined,
                    // 节点ID
                    nodeId: undefined,
                    // 连线ID
                    sourceId: undefined,
                    targetId: undefined
                },
                zoom: 0.5,
                anchorsStart:[],
                anchorsEnd:[],
            }
        },
        // 一些基础配置移动该文件中
        mixins: [easyFlowMixin],
        components: {
            draggable, flowNode, nodeMenu, FlowInfo, FlowNodeForm, FlowHelp,echart
        },
        directives: {
            'flowDrag': {
                bind(el, binding, vnode, oldNode) {
                    if (!binding) {
                        return
                    }
                    el.onmousedown = (e) => {
                        // console.log("鼠标按下");
                        if (e.button == 2) {
                            // 右键不管
                            return
                        }
                        //  鼠标按下，计算当前原始距离可视区的高度
                        // console.log("鼠标按下",e)
                        let disX = e.clientX
                        let disY = e.clientY
                        el.style.cursor = 'move'

                        document.onmousemove = function (e) {
                            
                            // 移动时禁止默认事件
                            e.preventDefault()
                            const left = e.clientX - disX
                            disX = e.clientX
                            el.scrollLeft += -left

                            const top = e.clientY - disY
                            disY = e.clientY
                            el.scrollTop += -top
                        }

                        document.onmouseup = function (e) {
                            // console.log("onmouseup",e)
                            el.style.cursor = 'auto'
                            document.onmousemove = null
                            document.onmouseup = null
                        }
                    }
                }
            }
        },
        mounted() {
            this.jsPlumb = jsPlumb.getInstance();
            this.$nextTick(() => {
                // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
                this.dataReload(getDataB())
            })
            console.log("计算",calc.getSinData(1,1))
            this.$refs.echart17.changedialogVisible(calc.getSinData(1,1));
        },
        methods: {
            
            //设置当前连线开始点的相对位置
            setConnParamanchorsSatrt(offsetX,offsetY){
                // console.log("父组件被调用--------",offsetX,offsetY)
                offsetX = Number(offsetX);
                offsetY = Number(offsetY);
                this.anchorsStart = [0,0,0,0,offsetX+3,offsetY+3];
            },
            //设置当前连线结束点的相对位置
            setConnParamanchorsEnd(offsetX,offsetY){
                // console.log(offsetX,offsetY)
                offsetX = Number(offsetX);
                offsetY = Number(offsetY);
              this.anchorsEnd = [0,0,0,0,offsetX+3,offsetY+3];
            },
            
            // 返回唯一标识
            getUUID() {
                return Math.random().toString(36).substr(3, 10)
            },
            jsPlumbInit() {
                this.jsPlumb.ready(() => {
                    // 导入默认配置
                    this.jsPlumb.importDefaults(this.jsplumbSetting)
                    // 会使整个jsPlumb立即重绘。
                    this.jsPlumb.setSuspendDrawing(false, true);
                    // 初始化节点
                    this.loadEasyFlow()
                    // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
                    this.jsPlumb.bind('click', (conn, originalEvent) => {
                        console.log("点击了设置activeElement",conn)
                        this.activeElement.type = 'line'
                        this.activeElement.sourceId = conn.sourceId
                        this.activeElement.targetId = conn.targetId
                        this.$refs.nodeForm.lineInit({
                            from: conn.sourceId,
                            to: conn.targetId,
                            label: conn.getLabel()
                        })
                    })

                    // 连线
                    this.jsPlumb.bind("connection", (evt) => {
                        // console.log("连线",evt.sourceEndpoint)
                        let from = evt.source.id
                        let to = evt.target.id
                        if (this.loadEasyFlowFinish) {
                            this.data.lineList.push({from: from, to: to})
                        }
                    })

                    // 删除连线回调
                    this.jsPlumb.bind("connectionDetached", (evt) => {
                        this.deleteLine(evt.sourceId, evt.targetId)
                    })

                    // 改变线的连接节点
                    this.jsPlumb.bind("connectionMoved", (evt) => {
                        this.changeLine(evt.originalSourceId, evt.originalTargetId)
                    })

                    // 连线右击
                    this.jsPlumb.bind("contextmenu", (evt) => {
                        console.log('连线被右击contextmenu', evt)
                    })

                    // 连线  https://wdd.js.org/jsplumb-chinese-tutorial/#/?id=_61-g6-antv
                    this.jsPlumb.bind("beforeDrop", (evt) => {
                        if(window.event.target.nodeName.toLowerCase()=='img'){
                            console.log("连线无效")
                            return
                        }
                        // console.log("结束点的位置",window.event,evt) //.style.left.split('px')[0]
                        //https://blog.csdn.net/zeping891103/article/details/72627855
                        console.log(window.event.toElement.nodeName)
                        // alert(window.event.clientY-42)
                        // alert(document.getElementById(evt.targetId).offsetTop)
                        // console.log(document.getElementById(evt.targetId).offsetLeft)

                        this.anchorsEnd=[0,0,0,0,window.event.clientX-231-document.getElementById(evt.targetId).offsetLeft,
                        window.event.clientY-49-document.getElementById(evt.targetId).offsetTop];
                        let from = evt.sourceId;
                        // console.log("evt.sourceEndpoint",evt) 392 159 231
                        let to = evt.targetId
                        if (from === to) {
                            this.$message.error('不支持连接自己')
                            return false
                        }
                        if (this.hasLine(from, to)) {
                            this.$message.error('该关系已存在,不允许重复创建')
                            return false
                        }
                        if (this.hashOppositeLine(from, to)) {
                            this.$message.error('不支持两个模型之间连线回环');
                            return false
                        }

                        var connParam = {
                            source: evt.sourceId,
                            target: evt.targetId,
                            // label: line.label ? line.label : '',
                            // connector: line.connector ? line.connector : '',
                            // anchors: line.anchors ? line.anchors : undefined,
                            //https://blog.csdn.net/weixin_36401046/article/details/79756422
                            // 可以使用基于数组的形式来定义锚点位置：[x,y,dx,dy,offsetX,offsetY]。
                            // [0,0]表示节点的左上角。
                            // x表示锚点在横轴上的距离，y表示锚点在纵轴上的距离，这两个值可以从0到1来设置，0.5为center。
                            // 而dx表示锚点向横轴射出线，dy表示锚点向纵轴射出线，有0，-1，1三个值来设置。0为不放射线。
                            // offsetX表示锚点偏移量x（px），offsetY表示锚点偏移量y（px）。
                            anchors: [this.anchorsStart, this.anchorsEnd],

                            // anchors: top,
                            // paintStyle: line.paintStyle ? line.paintStyle : undefined,
                        }
                        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
                        return false;
                        
                       
                    })

                    // beforeDetach
                    this.jsPlumb.bind("beforeDetach", (evt) => {
                        console.log('beforeDetach', evt)
                    })
                    this.jsPlumb.setContainer(this.$refs.efContainer)
                })
            },
            // 加载流程图
            loadEasyFlow() {
                // 初始化节点
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    // 设置源点，可以拖出线连接其他节点
                    // console.log(this.jsplumbSourceOptions)
                    this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
                    // // 设置目标点，其他源点拖出的线可以连接该节点
                    this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
                    if (!node.viewOnly) {
                        this.jsPlumb.draggable(node.id, {
                            containment: 'parent',
                            stop: function (el,ev) {
                                // 拖拽节点结束后的对调
                                console.log('拖拽结束: ', ev)
                            }
                        })
                    }
                }
                // 初始化连线
                for (var i = 0; i < this.data.lineList.length; i++) {
                    
                    let line = this.data.lineList[i];
                    console.log("初始化连接",line)
                    var connParam = {
                        source: line.from,
                        target: line.to,
                        label: line.label ? line.label : '',
                        connector: line.connector ? line.connector : '',
                        // anchors: line.anchors ? line.anchors : undefined,
                        anchors: ['RightMiddle', 'RightMiddle'],
                        // anchors: top,
                        paintStyle: line.paintStyle ? line.paintStyle : undefined,
                    }
                    this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
                }
                this.$nextTick(function () {
                    this.loadEasyFlowFinish = true
                })
            },
            // 设置连线条件
            setLineLabel(from, to, label) {
                var conn = this.jsPlumb.getConnections({
                    source: from,
                    target: to
                })[0]
                if (!label || label === '') {
                    conn.removeClass('flowLabel')
                    conn.addClass('emptyFlowLabel')
                } else {
                    conn.addClass('flowLabel')
                }
                conn.setLabel({
                    label: label,
                })
                this.data.lineList.forEach(function (line) {
                    if (line.from == from && line.to == to) {
                        line.label = label
                    }
                })

            },
            // 删除激活的元素
            deleteElement() {
                console.log("删除的",this.activeElement)
                if (this.activeElement.type === 'node') {
                    this.deleteNode(this.activeElement.nodeId)
                } else if (this.activeElement.type === 'line') {
                    this.$confirm('确定删除所点击的线吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var conn = this.jsPlumb.getConnections({
                            source: this.activeElement.sourceId,
                            target: this.activeElement.targetId
                        })[0]
                        this.jsPlumb.deleteConnection(conn)
                    }).catch(() => {
                    })
                }
            },
            // 删除线
            deleteLine(from, to) {
                this.data.lineList = this.data.lineList.filter(function (line) {
                    if (line.from == from && line.to == to) {
                        return false
                    }
                    return true
                })
            },
            // 改变连线
            changeLine(oldFrom, oldTo) {
                this.deleteLine(oldFrom, oldTo)
            },
            // 改变节点的位置
            changeNodeSite(data) {
                // console.log("changeNodeSite")
                for (var i = 0; i < this.data.nodeList.length; i++) {
                    let node = this.data.nodeList[i]
                    if (node.id === data.nodeId) {
                        node.left = data.left
                        node.top = data.top
                    }
                }
            },
            /**
             * 拖拽结束后添加新的节点
             * @param evt
             * @param nodeMenu 被添加的节点对象
             * @param mousePosition 鼠标拖拽结束的坐标
             */
            addNode(evt, nodeMenu, mousePosition) {
                console.log("添加的节点信息",nodeMenu);
                //只能添加一个信号发生器
                if(nodeMenu.id==17 && this.selectNode17uId(this.data.nodeList)!=-1){ 
                    this.$message.error("添加失败，已经有了信号发生器")
                    return
                }
                var screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
                let efContainer = this.$refs.efContainer
                var containerRect = efContainer.getBoundingClientRect()
                var left = screenX, top = screenY
                // 计算是否拖入到容器中
                if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
                    this.$message.error("请把模型拖入到画布中")
                    return
                }
                left = left - containerRect.x + efContainer.scrollLeft
                top = top - containerRect.y + efContainer.scrollTop
                // 居中
                left -= 85
                top -= 16
                var nodeId = this.getUUID()
                // 动态生成名字
                var origName = nodeMenu.name
                var nodeName = origName
                var index = 1
                while (index < 10000) {
                    var repeat = false
                    for (var i = 0; i < this.data.nodeList.length; i++) {
                        let node = this.data.nodeList[i]
                        if (node.name === nodeName) {
                            nodeName = origName + index
                            repeat = true
                        }
                    }
                    if (repeat) {
                        index++
                        continue
                    }
                    break
                }
                var node = {
                    id: nodeId,
                    name: nodeName,
                    type: nodeMenu.type,
                    left: left + 'px',
                    top: top + 'px',
                    dragdotlen:nodeMenu.dragdotlen, //课拖拽点的个数
                    dragdotclass: nodeMenu.dragdotclass,
                    imgUrl:nodeMenu.imgUrl,
                    style:nodeMenu.style,
                    dataarr:nodeMenu.dataarr, //把数据传到右边编辑区
                }
                /**
                 * 这里可以进行业务判断、是否能够添加该节点
                 */
                this.data.nodeList.push(node)
                this.$nextTick(function () {
                    this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
                    this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
                    this.jsPlumb.draggable(nodeId, {
                        containment: 'parent',
                        stop: function (el) {
                            // 拖拽节点结束后的对调
                            // console.log('拖拽结束: ', el)
                        }
                    })
                })
            },
            /**
             * 删除节点
             * @param nodeId 被删除节点的ID
             */
            deleteNode(nodeId) {
                console.log("删除的modeId",nodeId)
                this.$confirm('确定要删除节点' + nodeId + '?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    /**
                     * 这里需要进行业务判断，是否可以删除
                     */
                    this.data.nodeList = this.data.nodeList.filter(function (node) {
                        if (node.id === nodeId) {
                            // 伪删除，将节点隐藏，否则会导致位置错位
                            // node.show = false
                            return false
                        }
                        return true
                    })
                    this.$nextTick(function () {
                        this.jsPlumb.removeAllEndpoints(nodeId);
                    })
                }).catch(() => {
                })
                return true
            },
            //计算每个模型的输入输出
            calc(data,node){
                console.log("进入calc",data,node);
                var node17 = this.selectNode17uId(data.nodeList); //返回信号发生器的id
                console.log(node17)
                if(node17== -1){ //没有信号发生器就退出 不计算
                    console.log("没有信号发生器");
                    return
                }
                if(node17.dataarr[0].value==null){
                    this.$message.warning("请先设定信号发生器电压");
                    return
                }
                var from = node17.id;
                var to = this.selectNodeFromLineListByfrom(data.lineList,from)
                while(to!=-1){ //根据连线顺序 遍历所有的模型的id 然后改变模型的U
                    console.log(`${from}--->${to}`);
                    this.setUByUid(from,to);
                    from = to;
                    to = this.selectNodeFromLineListByfrom(data.lineList,from);
                }
                // console.log("有信号发生器",)
            },
            //设置模型的U参数           !!!!!!!!!!!!!!!!传入什么呢 from to 一起 
            setUByUid(from,to){
                // console.log("开始设置一个模型的参数",this.data.nodeList);
                // console.log("uid",from,to)
                var fromindex = this.selectIndexByUid(from);
                var toindex = this.selectIndexByUid(to);
                // console.log("对应下标",fromindex,toindex);
                // console.log(this.data.nodeList[toindex].dataarr);
                var fromU=0,toU1=0,toU0=0;
                //获取from输出的电压
                for(let i=0; i<this.data.nodeList[fromindex].dataarr.length; i++){
                    if(this.data.nodeList[fromindex].dataarr[i].label=="U0"){
                        fromU = this.data.nodeList[fromindex].dataarr[i].value;
                    }
                }
                console.log("-----------------------",fromU)
                //计算to的输入电压
                toU1 = fromU;
                toU0 = parseInt(fromU) + 1;
                //设置to的输入电压
                for(let i=0; i<this.data.nodeList[toindex].dataarr.length; i++){
                    if(this.data.nodeList[toindex].dataarr[i].label=="U1"){
                        this.data.nodeList[toindex].dataarr[i].value = toU1 
                    }
                    else if(this.data.nodeList[toindex].dataarr[i].label=="U0"){
                        this.data.nodeList[toindex].dataarr[i].value = toU0
                    }
                }
                
            },
            //通过uid查出节点在nodeList的下标
            selectIndexByUid(uid){
                for(let i=0;i<this.data.nodeList.length; i++){
                    if(this.data.nodeList[i].id == uid){
                        return i;
                    }
                }
                return -1;
            },
            //查出一条连线的to 通过from 传入所有连线关系
            selectNodeFromLineListByfrom(lineList,from){ 
                for(let i=0;i<lineList.length; i++){
                    if(lineList[i].from == from){
                        return lineList[i].to;
                    }
                }
                return -1
            },
            //查询 信号发生器 所对应的的id 就是连线的开始位置 传入所有node
            selectNode17uId(nodeList){ 
                for(let i=0;i<nodeList.length; i++){
                    if(nodeList[i].name == "17"){
                        return nodeList[i];
                    }
                }
                return -1;
            },
            clickNode(node) {
                var nodeId = node.id;
                //点击了模型 计算各个的值
                console.log("selectNode17uId",this.selectNode17uId(this.data.nodeList));
                
                this.calc(this.data,node);
                if (node.name == 18 ) {
                        console.log("点击的是示波器,显示图像");
                        //检查是否已经
                }
                // this.data.nodeList.filter((node) => {
                //     if (node.name == 18 && node.id==nodeId) {
                //         console.log("点击的是示波器,显示图像");
                //     }
                // })
                this.activeElement.type = 'node'
                this.activeElement.nodeId = nodeId
                this.$refs.nodeForm.nodeInit(this.data, nodeId)
            },
            // 是否具有该线
            hasLine(from, to) {
                for (var i = 0; i < this.data.lineList.length; i++) {
                    var line = this.data.lineList[i]
                    if (line.from === from && line.to === to) {
                        return true
                    }
                }
                return false
            },
            // 是否含有相反的线
            hashOppositeLine(from, to) {
                return this.hasLine(to, from)
            },
            nodeRightMenu(nodeId, evt) {
                this.menu.show = true
                this.menu.curNodeId = nodeId
                this.menu.left = evt.x + 'px'
                this.menu.top = evt.y + 'px'
            },
            repaintEverything() {
                this.jsPlumb.repaint();
                this.$message.success('保存成功');
            },
            // 流程数据信息
            dataInfo() {
                this.flowInfoVisible = true
                this.$nextTick(function () {
                    this.$refs.flowInfo.init()
                })
            },
            // 加载流程图
            dataReload(data) {
                this.easyFlowVisible = false
                this.data.nodeList = []
                this.data.lineList = []
                this.$nextTick(() => {
                    data = lodash.cloneDeep(data)
                    this.easyFlowVisible = true
                    this.data = data
                    this.$nextTick(() => {
                        this.jsPlumb = jsPlumb.getInstance()
                        this.$nextTick(() => {
                            this.jsPlumbInit()
                        })
                    })
                })
            },
            // // 模拟载入数据dataA
            // dataReloadA() {
            //     this.dataReload(getDataA())
            // },
            // // 模拟载入数据dataB
            // dataReloadB() {
            //     this.dataReload(getDataB())
            // },
            // // 模拟载入数据dataC
            // dataReloadC() {
            //     this.dataReload(getDataC())
            // },
            // // 模拟载入数据dataD
            // dataReloadD() {
            //     this.dataReload(getDataD())
            // },
            // // 模拟加载数据dataE，自适应创建坐标
            // dataReloadE() {
            //     let dataE = getDataE()
            //     let tempData = lodash.cloneDeep(dataE)
            //     let data = ForceDirected(tempData)
            //     this.dataReload(data)
            //     this.$message({
            //         message: '力导图每次产生的布局是不一样的',
            //         type: 'warning'
            //     });
            // },
            zoomAdd() {
                if (this.zoom >= 1) {
                    return
                }
                this.zoom = this.zoom + 0.1
                this.$refs.efContainer.style.transform = `scale(${this.zoom})`
                this.jsPlumb.setZoom(this.zoom)
            },
            zoomSub() {
                if (this.zoom <= 0) {
                    return
                }
                this.zoom = this.zoom - 0.1
                this.$refs.efContainer.style.transform = `scale(${this.zoom})`
                this.jsPlumb.setZoom(this.zoom)
            },
            // 下载数据
            downloadData() {
                this.$confirm('确定要下载该流程数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false
                }).then(() => {
                    var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, '\t'));
                    var downloadAnchorNode = document.createElement('a')
                    downloadAnchorNode.setAttribute("href", datastr);
                    downloadAnchorNode.setAttribute("download", 'data.json')
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                    this.$message.success("正在下载中,请稍后...")
                }).catch(() => {
                })
            },
            openHelp() {
                this.flowHelpVisible = true
                this.$nextTick(function () {
                    this.$refs.flowHelp.init()
                })
            },
            //显示信号发生器的电压随时间变化的折线图
            show17chart(){
                var node17 = this.selectNode17uId(this.data.nodeList);
                if(node17==-1) {
                    this.$message.error('请选择信号发生器元件！')
                    return;
                }
                console.log("信号发生器",node17);
                node17.dataarr.forEach((item)=>{   //把信号发生器的值传给绘制曲线图的组件
                    if(item.label==="U0"){
                        this.node17data.U0=item.value
                    }else if(item.label==="f"){
                        this.node17data.f=item.value
                    }else if(item.label==="信号"){
                        this.node17data.信号=item.value
                    }
                })
                // this.$refs.echart17.changedialogVisible();
                this.$refs.echart17.changedialogVisible();
                // this.node17data = node17;
            }
        }
    }
</script>
