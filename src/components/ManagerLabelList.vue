<template>
    <div>
        <div style="float: left; margin-top: 3vh">
            <h1 style="color: #2277aa">LABEL OPTIONS</h1>
        </div>
        <div style="margin-top: 3vh; width: 80vw">
            <el-table
                    :data="labelList"
                    style="width: 100%">
                <el-table-column
                        label="LABEL_ID"
                        width="80">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">
                            <el-input
                                    v-model="scope.row.labelId"
                                    disabled="true">
                            </el-input>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="标签名"
                        width="180">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.labelName"
                                :disabled="true">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                width="400"
                                trigger="click">
                            <h3>请输入标签名字:</h3>
                            <el-input v-model="labelName" placeholder="标签名字:"></el-input>
                            <el-button @click="saveLabel(scope.$index, scope.row)" style="margin-top: 1vh">确定</el-button>
                            <el-button type="info" size="mini" slot="reference">添加标签</el-button>
                        </el-popover>
                        <el-button
                                style="margin-left: 1vw"
                                size="mini"
                                type="danger"
                                @click="removeLabel(scope.$index, scope.row)">删除标签
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-button icon="el-icon-refresh-right" @click="refreshData" circle></el-button>
    </div>
</template>

<script>
    export default {
        name: "ManagerLabelList",
        data (){
            return {
                labelList: [],
                labelName: ""
            }
        },
        methods: {
            refreshData(index, row){
                let _this= this;
                let url = this.$store.state.baseUrl + "/label/listLabels";
                this.$axios.get(url).then(res =>{
                    if (res.data.success){
                        _this.labelList = res.data.data;
                    }else{
                        _this.$message.error(res.data.msg)
                    }
                })
            },
            saveLabel(index, row){
                let _this= this;
                let url = this.$store.state.baseUrl + "/label/saveLabel";
                let params = new FormData();
                params.append("labelName", this.labelName);
                this.$axios.post(url, params).then(res =>{
                    if (res.data.success){
                        _this.$message.success("添加成功");
                        _this.refreshData();
                    }else{
                        _this.$message.error(res.data.msg);
                    }
                })
            },
            removeLabel(index, row){
                this.$confirm('此操将删除该标签, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _this= this;
                    let url = this.$store.state.baseUrl + "/label/removeLabel?labelId=" + row.labelId;
                    this.$axios.get(url).then(res =>{
                        if (res.data.success){
                            _this.$message.success("删除成功");
                            _this.refreshData();
                        }else{
                            _this.$message.success("删除失败" +　res.data.msg);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>