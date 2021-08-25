<template>
    <div>
        <div style="float: left; margin-top: 3vh">
            <h1 style="color: #2277aa">USER OPTIONS</h1>
        </div>
        <div style="margin-top: 3vh; width: 83vw">
            <el-table
                    :data="userList"
                    style="width: 100%">
                <el-table-column
                        label="USER_ID"
                        width="80">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">
                            <el-input
                                    v-model="scope.row.userId"
                                    disabled="true">
                            </el-input>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="用户名"
                        width="150">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.username"
                                :disabled="scope.row.disable">
                        </el-input>
                    </template>
                </el-table-column>


                <el-table-column
                        label="用户状态"
                        width="60">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.state"
                                :disabled="scope.row.disable">
                        </el-input>
                    </template>
                </el-table-column>


                <el-table-column
                        label="注册时间"
                        width="180">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.registerTime"
                                disabled="true">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        label="最近登录时间"
                        width="180">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.loginTime"
                                disabled="true">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        label="邮箱地址"
                        width="150">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.email"
                                :disabled="scope.row.disable">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        label="头像地址"
                        width="150">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.avatar"
                                disabled="true">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                v-show="scope.row.disable"
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                v-show="!scope.row.disable"
                                size="mini"
                                @click="updateUser(scope.$index, scope.row)">保存</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="removeUser(scope.$index, scope.row)">删除</el-button>
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
        name: "ManagerUserList",
        data() {
            return {
                currentPage1: 1,
                begin: 0,
                totalNum: 0,
                count: 5,
                username: "",
                userList: [],
            }
        },
        mounted(){
        },
        methods: {
            refreshData(){
                this.userList.length = 0;
                this.getUsers(this.begin, this.count);
            },
            getUsers(begin, count){
                let _this= this;
                let url = this.$store.state.baseUrl + "/user/listUser?" + "begin=" +  begin + "&count=" + count;
                this.$axios.get(url).then(res =>{

                    if (res.data.code === 200){

                        _this.totalNum = parseInt(res.data.data.totalNum) ;
                        for (let user of res.data.data.userList){
                            user.loginTime = user.loginTime.substr(0, 10) + " " + user.loginTime.substr(10, 19);
                            user.registerTime = user.registerTime.substr(0, 10) + " " + user.registerTime.substr(10, 19);
                            user["disable"] = true;
                            _this.userList.push(user)

                        }
                    }else {
                        _this.$message.error(res.data.msg)
                    }

                })
            },
            handleEdit(index, row) {
                row.disable = false;
            },
            updateUser(index, row){
                row.disable = true;
                let _this= this;
                let url = this.$store.state.baseUrl + "/user/updateUser?";
                let params = {};
                params['userId'] = row.userId
                params['username'] = row.username
                params['password'] = _this.password
                params['email'] =  row.email
                this.$axios.post(url, params).then(res =>{
                    if (res.data.code === 200){
                        _this.$message.success("更新成功")
                        _this.refreshData();
                    }else {
                        _this.$message.error(res.data.msg)
                    }
                })

            },
            removeUser(index, row){
                this.$confirm('此操将删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _this= this;
                    let url = this.$store.state.baseUrl + "/user/removeUser?" + "userId=" + row.userId;
                    this.$axios.get(url).then(res =>{
                        if (res.data.code === 200){
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
            },
            handleSizeChange(val) {
                this.begin = 0;
                this.count = val
                this.userList.length = 0;
                this.getUsers(this.begin, this.count)
            },
            handleCurrentChange(val) {
                this.begin = this.count * (val - 1);
                this.userList.length = 0;
                this.getUsers(this.begin, this.count)
            },

        }
    }
</script>

<style scoped>

</style>