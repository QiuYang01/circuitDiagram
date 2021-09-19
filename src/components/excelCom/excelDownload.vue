<template>
    <el-button :type="type" :size="size" @click="export2Excel">{{text}}</el-button>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    props:{
        // 按钮大小 medium / small / mini
        size:{
            type:String,
            default(){
                return '';
            }
        },
        // 按钮类型 primary / success / warning / danger / info / text
        type:{
            type:String,
            default(){
                return '';
            }
        },
        // 按钮文字
        text:{
            type:String,
            default(){
                return '导出Excel';
            }
        },
        // 字段对应
        excelParam:{
            type:Object,
            required:true
        },
        // 数据
        data:{
            type:Array,
            required:true
        },
        title:{
            type:String,
            default(){
                return '导出数据';
            }
        }
    },
    computed: {
        
    },
    methods:{
    formatJson(filterVal, jsonData) {
      return [...jsonData].map(v => [...filterVal].map(j => v[j]));
    },
    export2Excel() {
        
      require.ensure([], () => {
        const { export_json_to_excel } = require("./vendor/Export2Excel");
        const list = this.data;
        const data1 = this.formatJson(this.excelParam.filter, list);
        export_json_to_excel(this.excelParam.head, data1, this.title);
      });
    }
    }
}
</script>
