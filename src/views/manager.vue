<template>
    <div style="text-align: center">
        <div v-show="showLogin" style="margin-left: 26vw">
            <div class="loginCardRoot" >
                <div style="text-align: center; margin-left: 1vw">
                    <div style="padding-top: 2vh">
                        <p style="font-family: 微软雅黑; font-size: 30px;">登录</p>
                    </div>
                    <div style="display: flex;">
                        <h5 style="margin-left: 6%">用户名:</h5>
                        <div style="margin-left: 5%;">
                            <el-input
                                    type="text"
                                    placeholder="Username"
                                    v-model="username"
                                    maxlength="10"
                                    size="medium"
                                    style="width: 14vw"
                                    prefix-icon="el-icon-user"
                                    show-word-limit>
                            </el-input>
                        </div>
                    </div>
                    <div style="display: flex;">
                        <h5 style="margin-left: 10%">密码:</h5>
                        <div style="margin-left: 5%;">
                            <el-input
                                    type="text"
                                    placeholder="Password"
                                    v-model="pwd"
                                    size="medium"
                                    show-password
                                    style="width: 14vw"
                                    prefix-icon="el-icon-lock">
                            </el-input>
                        </div>
                    </div>
                    <div style="height: 8vh">
                        <el-button @click="login" type="info" ><span style="letter-spacing: 1vw;">登录</span></el-button>
                    </div>
                </div>
            </div>

        </div>
        <el-row :gutter="20">
            <el-col :span="2"><ManagerHeader/></el-col>
            <el-col :span="22">
                <ManagerUserList v-show="this.$store.state.managerData.show.showUserList"/>
                <ManagerRoleList v-show="this.$store.state.managerData.show.showRoleList"/>
                <ManagerPermissionList v-show="this.$store.state.managerData.show.showPermissionList"/>
                <ManagerCommentList v-show="this.$store.state.managerData.show.showCommentList"/>
                <ManagerArticleList v-show="this.$store.state.managerData.show.showArticleList"/>
                <ManagerLabelList v-show="this.$store.state.managerData.show.showLabelList" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import ManagerHeader from "../components/ManagerHeader";
    import ManagerUserList from "../components/ManagerUserList";
    import ManagerRoleList from "../components/ManagerRoleList";
    import ManagerPermissionList from "../components/ManagerPermissionList";
    import ManagerCommentList from "../components/ManagerCommentList";
    import ManagerArticleList from "../components/ManagerArticleList";
    import ManagerLabelList from "../components/ManagerLabelList";
    import md5 from 'js-md5';
    export default {
        name: "manager",
        components: {
            ManagerHeader,
            ManagerUserList,
            ManagerRoleList,
            ManagerPermissionList,
            ManagerCommentList,
            ManagerArticleList,
            ManagerLabelList
        },
        data() {
            return {
                username: "",
                pwd: "",
                showLogin: true
            }
        },
        methods:{
            login() {
                if (this.username === ""){
                    this.$message.error("用户名不能为空");
                    return;
                }
                if (this.pwd === ""){
                    alert("密码不能为空");
                    return;
                }
                let url = this.$store.state.baseUrl + "/security/randomSalt?username=" + this.username;
                let _this = this;
                this.$axios.get(url).then(function (res){
                    if (res.data.success){
                        _this.username = encodeURIComponent(encodeURIComponent(_this.username)); // 二次编码
                        let key = res.data.data
                        let loginUrl = _this.$store.state.baseUrl + "/security/login?username=" + _this.username + "&password=" + md5(key + md5(_this.pwd))
                        _this.$axios.get(loginUrl).then(function (loginRes) {
                            if (loginRes.data.success){
                                _this.$message.success("登录成功");
                                _this.$store.state.curUser.ExpireToken = loginRes.headers.expiretoken;
                                _this.$store.state.curUser.RefreshToken = loginRes.headers.refreshtoken;
                                // 关闭登录窗口
                                _this.showLogin = false;
                            }else {
                                _this.$message.error(loginRes.data.msg);
                            }
                        })
                    }else {
                        _this.$message.error(res.data.msg);
                    }

                })
            }
        }
    }
</script>

<style scoped>
    .loginCardRoot{
        width: 25vw;
        height: 50vh;
        margin-left: 15vw;
        margin-top: 7vh;
        background-color: #f7f7f7;
        border-radius: 20px
    }

    .el-button {
        display: inline-block;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #2277aa;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        width: 18vw;
        transition: 0.1s;
        font-weight: 500;
        font-size: 14px;
        border-radius: 4px;
    }
    .el-button:HOVER{
        cursor: pointer;
        transition: all 0.6s;
        background-color: #dcdfe6;
        transform: scale(1.05);
    }
</style>