<template>
    <div class="createUserRoot">
        <div style="text-align: center;margin-left: 1vw">
            <div style="padding-top: 2vh">
                <p style="font-family: 微软雅黑; font-size: 30px;">注册</p>
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
                <h5 style="margin-left: 24px">密码:</h5>
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

            <div style="display: flex;">
                <h5 style="margin-left: 3px">邮箱地址:</h5>
                <div style="margin-left: 10px">
                    <el-input
                            type="text"
                            placeholder="EmailAddress"
                            v-model="emailAddress"
                            size="medium"
                            style="width: 200px"
                            prefix-icon="el-icon-s-home">
                    </el-input>
                </div>
            </div>
            <div style="display: flex;">
                <h5 style="margin-left: 30px">头像:</h5>
                <div style="border-radius:100%;margin: 10px;overflow: hidden;width: 50px;height: 50px;background-color: #dcdfe6;display:flex;justify-content:center;align-items:center;">
                    <el-upload
                            v-loading="loading"
                            class="avatar-uploader"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" style="width:100%;height:auto;" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            <div style="height: 50px">
                <el-button @click="createUser" type="info" style="width: 250px"><span style="  letter-spacing: 1vw;">注册</span></el-button>
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
        name: "CreateUser",
        data() {
            return {
                loading: false,
                imgUrl: "",
                username: null,
                pwd: null,
                emailAddress: null,
                types: ["image/jpeg", "image/png"],
                fileList: [],
                imgFile: null,
            };
        },
        methods: {
            goBack(){
                let showList = ["showLoginCard"]
                this.$store.commit("alterView", showList);
            },
            handleAvatarSuccess(res, file){
                this.imageUrl = URL.createObjectURL(file.raw);
                this.fileList.push({name: file.name, url: ''})
                this.loading = false
            },
            beforeAvatarUpload(file){
                // 判断文件是否合法
                let imgType = file.type;
                let isOk = false;
                for (let curType of this.types){
                    if (imgType === curType){
                        isOk = true;
                    }
                }
                let isLt2M = file.size / 1024 / 1024 < 2;
                if (!isOk) {
                    this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                    return false
                }
                this.loading = true;
                this.imgFile = file;
                return true;
            },
            createUser(){
                if (this.username === "" || this.pwd === ""){
                    this.$message.error("用户名密码不能为空");
                    return;
                }
                if (this.fileList.length === 0){
                    this.$message.error("请上传头像");
                    return;
                }
                let reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
                // 验证邮箱
                if (!reg.test(this.emailAddress)){
                    this.$message.error("邮箱格式错误");
                    return;
                }
                let ua = this.$store.state.baseUrl + "/file/createAvatar";
                let p = new FormData();
                let _this = this;
                p.append("avatar", this.imgFile);
                p.append("fileExtension", ".png");
                this.$axios.post(ua, p).then(res => {
                  if (res.data.code === 200) {
                    _this.imgUrl = res.data.msg;
                    let url = _this.$store.state.baseUrl + "/user/saveUser";
                    let params = new FormData()
                    params.append('username', _this.username);
                    params.append('password', _this.pwd);
                    params.append('email', _this.emailAddress);
                    params.append("avatar", _this.imgUrl)
                    _this.$axios.post(url, params).then(res => {
                      if (res.data.code == 200){
                        _this.$message.success("创建成功");
                      }
                      let showList = ["showLoginCard"]
                      _this.$store.commit("alterView", showList)
                    }).catch(error => {
                      _this.$message.error("创建失败" + error);
                    })
                  }
                }).catch(error => {
                  _this.$message.error("上传头像失败");
                });
            }
        }
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
    .createUserRoot{
        width: 350px;
        height: 450px;
        margin-left: 15vw;
        margin-top: 7vh;
        background-color: #f7f7f7;
        border-radius: 20px
    }
</style>