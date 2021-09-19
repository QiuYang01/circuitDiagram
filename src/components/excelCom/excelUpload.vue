<template>
    <el-upload
        ref="upload"
        class="upload-demo"
        action=""
        :show-file-list="false"
        :on-change="handleChange"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        :file-list="fileListUpload"
        :limit="100"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        :auto-upload="false">
        <el-button :size="size" :type="type">{{text}}</el-button>
    </el-upload>
</template>

<script>
import XLSX from 'xlsx';
export default {
    data(){
        return {
            // 文件上传
            fileListUpload:[],  // 上传的文件列表
        }
    },
    props: {
        // 按钮大小 medium / small / mini
        size: {
            type: String,
            default() {
                return '';
            }
        },
        // 按钮类型 primary / success / warning / danger / info / text
        type: {
            type: String,
            default() {
                return '';
            }
        },
        // 按钮文字
        text: {
            type: String,
            default() {
                return '导入Excel';
            }
        },
        // 字段对应
        excelParam:{
            type:Object,
            required:true
        },
    },
    methods:{
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 100 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleChange(file, fileList){
            this.fileTemp = file.raw;
            if(this.fileTemp){
                if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (this.fileTemp.type == 'application/vnd.ms-excel')){
                    this.importfxx(this.fileTemp)
                } else {
                    this.$message({
                        type:'warning',
                        message:'附件格式错误，请删除后重新上传！'
                    })
                }
            } else {
                this.$message({
                    type:'warning',
                    message:'请上传附件！'
                })
            }
        },

        handleRemove(file,fileList){
            this.fileTemp = null
        },
        importfxx(obj) {
            let _this = this;
            // 通过DOM取文件数据
            this.file = obj
            var rABS = false; //是否将文件读取为二进制字符串
            var f = this.file;
            var reader = new FileReader();
            FileReader.prototype.readAsBinaryString = function(f) {
                var binary = "";
                var rABS = false; //是否将文件读取为二进制字符串
                var pt = this;
                var wb; //读取完成的数据
                var outdata;
                var reader = new FileReader();
                reader.onload = function(e) {
                var bytes = new Uint8Array(reader.result);
                var length = bytes.byteLength;
                for(var i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                var XLSX = require('xlsx');
                if(rABS) {
                    wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(binary, {
                        type: 'binary'
                    });
                }

                // outdata为读取的表格数据
                outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                
                // 对导入数据进行格式化
                var da = [...outdata];
                let arr = [];
                da.map(v => {
                    let obj = {};
                    // 以下为每个字段
                    if(_this.excelParam.head.length==_this.excelParam.filter.length){
                        for(var i=0; i<_this.excelParam.head.length; i++){
                            obj[_this.excelParam.filter[i]] = v[_this.excelParam.head[i]];
                        }
                    }else{
                        console.log('错误！！！表头字段和变量字段数量不一致！！！')
                    }
                    arr.push(obj);
                });

                // 传到父组件
                _this.$emit("outData",arr);
                // 清空上传列表
                _this.$refs.upload.clearFiles();

                return outdata
                }
                reader.readAsArrayBuffer(f);
            }
            
            if(rABS) {
                reader.readAsArrayBuffer(f);
            } else {
                reader.readAsBinaryString(f);
            }
        },
    }
}
</script>