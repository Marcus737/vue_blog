<template>
    <div>
        <div style="float: left; margin-top: 3vh">
            <h1 style="color: #2277aa">PERMISSION OPTIONS</h1>
        </div>
        <div style="margin-top: 3vh; width: 80vw">
            <el-table
                    :data="roleList"
                    style="width: 100%">
                <el-table-column
                        label="PERMISSION_ID"
                        width="80">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">
                            <el-input
                                    v-model="scope.row.permissionId"
                                    disabled="true">
                            </el-input>
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="权限名"
                        width="180">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.permissionName"
                                :disabled="scope.row.disable">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column
                        label="拥有此权限的角色"
                        width="180">
                    <template slot-scope="scope">
                        <div class="block">
                            <el-cascader
                                    id="MyCascade"
                                    :options="scope.row.options"
                                    v-model="scope.row.selectedOptions"
                                    :props="{ multiple: true, checkStrictly: true}"
                                    clearable>
                            </el-cascader>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="权限描述"
                        width="180">
                    <template slot-scope="scope">
                        <el-input
                                v-model="scope.row.permissionUrl"
                                :disabled="scope.row.disable">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                width="300"
                                trigger="click">
                            <h3>请输入角色id:</h3>
                            <el-input v-model="roleId" placeholder="角色id:"></el-input>
                            <el-button @click="addPermissionToRole(scope.$index, scope.row)" style="margin-top: 1vh">确定</el-button>
                            <el-button type="info" size="mini" slot="reference">授权权限给角色</el-button>
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
                            <h3>请输入权限名:</h3>
                            <el-input v-model="permissionName" placeholder="权限名:"></el-input>
                            <h3>请输入权限路径:</h3>
                            <el-input v-model="permissionUrl" placeholder="权限路径"></el-input>
                            <el-button @click="savePermission(scope.$index, scope.row)" style="margin-top: 1vh">确定</el-button>
                            <el-button type="success" size="mini" slot="reference">添加权限</el-button>
                        </el-popover>
                        <el-button
                                style="margin-left: 1vw"
                                size="mini"
                                type="info"
                                @click="removePermission(scope.$index, scope.row)">删除权限</el-button>
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
        name: "ManagerPermissionList",
        data (){
            return {
                roleId: null,
                roleName: null,
                roleList: [],
                selectedOptions: [],
                permissionName: null,
                permissionUrl: null

            }
        },
        methods: {
            addPermissionToRole(index, row){
                let _this= this;
                let url = this.$store.state.baseUrl + "/permission/addPermissionToRole";
                let params = new FormData()
                params.append('roleIdList', [this.roleId]);
                params.append('permissionId', row.permissionId);
                this.$axios.post(url, params, {headers:{
                        refreshToken: _this.$store.state.managerData.refreshToken,
                        expireToken: _this.$store.state.managerData.expireToken
                    }}).then(res =>{
                    if (res.data.success){
                        _this.$message.success("添加成功");
                        _this.refreshData();
                    }else{
                        _this.$message.success(res.data.msg);
                    }
                })
                this.userId = "";
            },
            savePermission(index, row){
                let _this= this;
                let url = this.$store.state.baseUrl + "/permission/savePermission";
                let params = new FormData();
                params.append('permissionName', this.permissionName);
                params.append('permissionUrl', this.permissionUrl);
                this.$axios.post(url, params, {headers:{
                        refreshToken: _this.$store.state.managerData.refreshToken,
                        expireToken: _this.$store.state.managerData.expireToken
                    }}).then(res =>{
                    if (res.data.success){
                        _this.$message.success("添加成功");
                        _this.refreshData();
                    }else{
                        _this.$message.success(res.data.msg);
                    }
                })
            },
            removePermission(index, row){
                this.$confirm('此操将删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _this= this;
                    let url = this.$store.state.baseUrl + "/permission/removePermission?permissionName=" + row.permissionId ;
                    alert(url)
                    this.$axios.get(url, {headers:{
                            refreshToken: _this.$store.state.managerData.refreshToken,
                            expireToken: _this.$store.state.managerData.expireToken
                        }}).then(res =>{
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
                this.$confirm('此操将该权限取消授权于选中角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _this= this;
                    let url = this.$store.state.baseUrl + "/permission/removePermissionFromRole";
                    let params = new FormData();
                    params.append('roleIdList', row.selectedOptions);
                    params.append('permissionId', row.permissionId);
                    this.$axios.post(url, params, {headers:{
                            refreshToken: _this.$store.state.managerData.refreshToken,
                            expireToken: _this.$store.state.managerData.expireToken
                        }}).then(res =>{
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
                let url = this.$store.state.baseUrl + "/permission/listPermissions";
                this.$axios.get(url).then(res =>{
                    if (res.data.success){
                        for (let permission of res.data.data){
                            permission["options"] = [];
                            permission["disable"] = true;
                            permission["selectedOptions"] = []
                            _this.roleList.push(permission)
                        }
                        for (let permission of res.data.data){
                            let tempUrl = this.$store.state.baseUrl + "/role/listRolesByPermissionId?permissionId=" + permission.permissionId;
                            this.$axios.get(tempUrl).then(tempRes =>{
                                if (tempRes.data.success){
                                    for (let role of tempRes.data.data){
                                        permission["options"].push({value: role.roleId, label: role.roleName});
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