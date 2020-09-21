<template>
    <div>
        <div style="float: left; margin-top: 3vh">
            <h1 style="color: #2277aa">ROLE OPTIONS</h1>
        </div>
        <div style="margin-top: 3vh; width: 80vw">
            <el-table
                    :data="roleList"
                    style="width: 100%">
                <el-table-column
                        label="ROLE_ID"
                        width="80">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">
                            <el-input
                                    v-model="scope.row.roleId"
                                    disabled="true">
                            </el-input>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="角色名"
                        width="180">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.roleName"
                                :disabled="scope.row.disable">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        label="拥有此角色的用户"
                        width="180">
                    <template slot-scope="scope">
                        <div class="block">
                            <el-cascader
                                    id="MyCascade"
                                    :options="scope.row.options"
                                    v-model="scope.row.selectedOptions"
                                    :props="{ multiple: 'true', checkStrictly: 'true'}"
                                    clearable>
                            </el-cascader>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                width="400"
                                trigger="click">
                            <h3>请输入用户id:</h3>
                            <el-input v-model="userId" placeholder="用户id:"></el-input>
                            <el-button @click="addRoleToUser(scope.$index, scope.row)" style="margin-top: 1vh">确定</el-button>
                            <el-button type="info" size="mini" slot="reference">授权角色给用户</el-button>
                        </el-popover>
                        <el-button
                                style="margin-left: 1vw"
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">取消授权</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-popover
                                placement="right"
                                width="400"
                                trigger="click">
                            <h3>请输入角色名字:</h3>
                            <el-input v-model="roleName" placeholder="角色名字:"></el-input>
                            <el-button @click="saveRole(scope.$index, scope.row)" style="margin-top: 1vh">确定</el-button>
                            <el-button type="info" size="mini" slot="reference">添加角色</el-button>
                        </el-popover>
                        <el-button
                                style="margin-left: 1vw"
                                size="mini"
                                type="danger"
                                @click="removeRole(scope.$index, scope.row)">删除角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 5vh">

            <el-button icon="el-icon-refresh-right" @click="refreshData" circle></el-button>
        </div>

    </div>

</template>

<script>
    export default {
        name: "ManagerRoleList",
        data (){
            return {
                userId: null,
                roleName: null,
                roleList: [],
                selectedOptions: [],
            }
        },
        methods: {
            addRoleToUser(index, row){
                let _this= this;
                let url = this.$store.state.baseUrl + "/role/addRoleToUser";
                let params = new FormData()
                params.append('userIdList', [this.userId]);
                params.append('roleId', row.roleId);
                this.$axios.post(url, params).then(res =>{
                    if (res.data.success){
                        _this.$message.success("添加成功");
                        _this.refreshData();
                    }else{
                        _this.$message.success(res.data.msg);
                    }
                })
                this.userId = null;
            },
            saveRole(index, row){
                let _this= this;
                let url = this.$store.state.baseUrl + "/role/saveRole";
                let params = new FormData()
                params.append('roleName', this.roleName);
                this.$axios.post(url, params).then(res =>{
                    if (res.data.success){
                        _this.$message.success("添加成功");
                        _this.refreshData();
                    }else{
                        _this.$message.success(res.data.msg);
                    }
                })
                this.roleName = null;
            },
            removeRole(index, row){
                this.$confirm('此操将删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _this= this;
                    let url = this.$store.state.baseUrl + "/role/removeRole?roleId=" + row.roleId;
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
            },
            handleDelete(index, row){
                this.$confirm('此操将该角色取消授权于选中用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _this= this;
                    let url = this.$store.state.baseUrl + "/role/removeRoleFromUser";
                    let params = new FormData()

                    params.append('userIdList', row.selectedOptions);
                    params.append('roleId', row.roleId);
                    this.$axios.post(url, params).then(res =>{
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
            },
            refreshData(){
                let _this= this;
                this.roleList.length = 0;
                let url = this.$store.state.baseUrl + "/role/listRoles";
                this.$axios.get(url).then(res =>{
                    if (res.data.success){
                        for (let role of res.data.data){
                            role["options"] = [];
                            role["disable"] = true;
                            role["selectedOptions"] = []
                            _this.roleList.push(role)
                        }
                        for (let role of res.data.data){
                            let tempUrl = this.$store.state.baseUrl + "/user/listUserByRoleId?roleId=" + role.roleId;
                            this.$axios.get(tempUrl).then(tempRes =>{
                                if (tempRes.data.success){
                                    for (let user of tempRes.data.data){
                                        role["options"].push({value: user.userId, label: user.username});
                                    }
                                }else {
                                    _this.$message.error(res.data.msg);
                                }
                            })
                        }
                    }else {
                        _this.$message.error(res.data.msg);
                    }
                })

            }
        }
    }
</script>

<style scoped>

</style>