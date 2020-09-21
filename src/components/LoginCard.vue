<template>
    <div class="loginCardRoot" >
        <div style="text-align: center; margin-left: 1vw">
            <div style="padding-top: 2vh">
                <p style="font-family: 微软雅黑; font-size: 30px;">登录</p>
            </div>
            <div style="display: flex;">
                <h5 style="margin-left: 10px">用户名:</h5>
                <div style="margin-left: 10px;">
                    <el-input
                            type="text"
                            placeholder="Username"
                            v-model="username"
                            maxlength="10"
                            size="medium"
                            style="width: 200px"
                            prefix-icon="el-icon-user"
                            show-word-limit>
                    </el-input>
                </div>
            </div>
            <div style="display: flex;">
                <h5 style="margin-left: 22px">密码:</h5>
                <div style="margin-left: 10px;">
                    <el-input
                            type="text"
                            placeholder="Password"
                            v-model="pwd"
                            size="medium"
                            show-password
                            style="width: 200px"
                            prefix-icon="el-icon-lock">
                    </el-input>
                </div>
            </div>
            <div style="height: 60px">
                <el-button @click="login" type="info" style="width: 250px" ><span style="letter-spacing: 1vw;">登录</span></el-button>
            </div>
            <div style="float: left; margin-left: 1vw">
                <el-link @click="createUser" type="primary">现在注册</el-link>
            </div>
            <div style="float: right; margin-right: 1vw">
                <el-link @click="resetPwd" type="primary">忘记密码？</el-link>
            </div>
            <div>
                <el-link @click="goBack" type="primary">返回</el-link>
            </div>
        </div>
    </div>
</template>

<script>
    import md5 from 'js-md5';
    export default {
        name: "LoginCard",
        data() {
            return {
                username: "",
                pwd: ""
            };
        },
        methods: {
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
                        let key = res.data.data
                        let loginUrl = _this.$store.state.baseUrl + "/security/login?username=" + _this.username + "&password=" + md5(key + md5(_this.pwd))
                        _this.$axios.get(loginUrl).then(function (loginRes) {
                            if (loginRes.data.success){
                                _this.$store.state.curUser.isLogin = true;
                                _this.$message.success("登录成功");
                                _this.$store.state.curUser.token = loginRes.headers.token;
                                console.log(loginRes.headers);
                                _this.$store.state.showViews.showLoginCard = false; // 关闭显示页面
                                _this.$store.state.showViews.showCards = true; // 打开文章列表页面
                                // 请求user信息
                                let displayUserUrl = _this.$store.state.baseUrl + "/user/getUser?username=" + _this.username;
                                _this.$axios.get(displayUserUrl).then(function (userRes) {
                                    _this.$store.state.curUser.username = userRes.data.data.username;
                                    _this.$store.state.curUser.userId = userRes.data.data.userId;
                                    _this.$store.state.curUser.avatar = _this.$store.state.baseDownloadUrl +  userRes.data.data.avatar;
                                })
                            }else {
                                _this.$message.error(loginRes.data.msg);
                            }
                        })
                    }else {
                        _this.$message.error(res.data.msg);
                    }

                })
            },
            createUser(){
                this.$store.state.showViews.showLoginCard = false;
                this.$store.state.showViews.showCreateCard = true;
            },
            resetPwd(){
                alert("重置密码")
            },
            goBack(){
                this.$store.state.showViews.showLoginCard = false;
                this.$store.state.showViews.showCards = true;
            }
        },
    }
</script>

<style scoped>
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
    .loginCardRoot{
        width: 350px;
        height: 350px;
        margin-left: 15vw;
        margin-top: 7vh;
        background-color: #f7f7f7;
        border-radius: 20px
    }
</style>