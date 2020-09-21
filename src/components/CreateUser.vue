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
                <div style="margin-left: 10px ;width: 200px;height: 40px;background-color: #dcdfe6;">
                    <el-upload
                            class="avatar-uploader"
                            :before-upload="uploadAvatar"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            style="padding-top: 10px">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            <div style="height: 50px">
                <el-button @click="createUser" type="info" style="width: 250px"><span style="letter-spacing: 1vw;">注册</span></el-button>
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
                this.$store.state.showViews.showCreateCard = false;
                this.$store.state.showViews.showLoginCard = true;
            },
            createUser(){
                if (this.username === null && this.pwd === null){
                    this.$message.error("用户名密码不能为空");
                    return;
                }
                // 如果没有上传图片就使用默认图片
                if (this.fileList.length === 0){
                    this.fileList.push({name: 'defaultImg', url: 'https://tse3-mm.cn.bing.net/th/id/OIP.SPgi8xOde1kjnDteneAVeAAAAA?w=173&h=180&c=7&o=5&pid=1.7'})
                }
                let url = this.$store.state.baseUrl + "/user/saveUser";
                let _this = this;
                let params = new FormData()
                params.append('username', this.username);
                // 对密码进行md5加密
                params.append('password', md5(this.pwd));
                params.append('avatarImg', this.imgFile);
                params.append('email', this.emailAddress);
                this.$axios.post(url, params).then(res => {
                    if (res.data.success){
                        this.$message.success("创建成功");
                    }
                    _this.$store.state.showViews.showCreateCard = false;
                    _this.$store.state.showViews.showLoginCard = true;
                }).catch(error => {
                    this.$message.error("创建失败" + error);
                })
            },
            handleRemove(){
                this.fileList.length = 0;
            },
            uploadAvatar(file) {
                // 判断上传的数量是否超过限制
                if (this.fileList.length >= 1){
                    this.$message.error('只能上传一张哦');
                    return false;
                }
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
                this.fileList.push({name: file.name, url: ''});
                this.imgFile = file;
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