<template>
    <div>
        <div style="float: left; margin-top: 3vh">
            <h1 style="color: #2277aa">COMMENT OPTIONS</h1>
        </div>
        <div style="margin-top: 3vh; width: 80vw">
            <el-table
                    :data="commentList"
                    style="width: 100%">
                <el-table-column
                        label="COMMENT_ID"
                        width="80">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">
                            <el-input
                                    v-model="scope.row.commentId"
                                    disabled="true">
                            </el-input>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="评论时间"
                        width="180">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.commentTime"
                                :disabled="true">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        label="评论内容"
                        width="180">
                    <template slot-scope="scope">
                        <el-input
                                type="textarea"
                                :rows="1"
                                v-model="scope.row.commentContent"
                                :disabled="scope.row.disable">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="info"
                                   size="mini"
                                   v-show="scope.row.disable"
                                   @click="handleUpdate(scope.$index, scope.row)">修改评论</el-button>
                        <el-button type="info"
                                   v-show="!scope.row.disable"
                                   size="mini"
                                   @click="handleSave(scope.$index, scope.row)">保存评论</el-button>
                        <el-button
                                style="margin-left: 1vw"
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除评论
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="float: bottom; margin-top: 3vh; margin-left: 25vw;display: flex">
            <el-button icon="el-icon-refresh-right" @click="refreshData" circle></el-button>
            <el-pagination
                    style="margin-left: 3vw"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage1"
                    :page-sizes="[5, 10, 20]"
                    :page-size="count"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNum">
            </el-pagination>

        </div>
    </div>
</template>

<script>
    export default {
        name: "ManagerCommentList",
        data (){
            return {
                currentPage1: 1,
                begin: 0,
                totalNum: 0,
                count: 10,
                commentList: [],
                selectedOptions: [],
            }
        },
        methods: {
            handleUpdate(index, row){
                row.disable = false;
            },
            handleSave(index, row){
                row.disable = true;
                let _this= this;
                let url = this.$store.state.baseUrl + "/comment/updateComment?";
                let params = new FormData()
                params.append('commentId', row.commentId);
                params.append('commentContent', row.commentContent);
                this.$axios.post(url, params).then(res =>{
                    if (res.data.code == 200){
                        _this.$message.success("修改评论成功");
                        _this.refreshData();
                    }else {
                        _this.$message.error(res.data.msg);
                    }
                })
            },
            handleDelete(index, row){
                this.$confirm('此操将删除该评论, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _this= this;
                    let url = this.$store.state.baseUrl + "/comment/removeCommentByCommentId?" + 'commentId=' + row.commentId;
                    this.$axios.get(url).then(res =>{
                        if (res.data.code == 200){
                            _this.$message.success("删除成功");
                            _this.refreshData();
                        }else{
                            _this.$message.success("删除失败" +　res.data.msg);
                        }
                    })
                }).catch((msg) => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除' + msg
                    });
                });

            },
            refreshData(){
                this.commentList.length = 0;
                this.getComments(this.begin, this.count);
            },
            getComments(begin, count){
                let _this= this;
                let url = this.$store.state.baseUrl + "/comment/listComments?" + "begin=" +  begin + "&count=" + count;
                this.$axios.get(url).then(res =>{
                    if (res.data.code == 200){
                        _this.totalNum = parseInt(res.data.data.totalNum) ;
                        for (let comment of res.data.data.commentList){
                            if (comment.commentTime){
                              comment.commentTime = comment.commentTime.substr(0, 10) + " " + comment.commentTime.substr(10, 19);
                            }
                            comment["disable"] = true;
                            _this.commentList.push(comment)
                        }
                    }else {
                        _this.$message.error(res.data.msg)
                    }
                })
            },
            handleSizeChange(val) {
                this.begin = 0;
                this.count = val
                this.commentList.length = 0;
                this.getComments(this.begin, this.count)
            },
            handleCurrentChange(val) {
                this.begin = this.count * (val - 1);
                this.commentList.length = 0;
                this.getComments(this.begin, this.count)
            },
        }
    }
</script>

<style scoped>

</style>