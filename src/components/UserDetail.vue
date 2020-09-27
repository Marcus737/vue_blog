<template>
    <div style="background: #f7f7f7; height: 85vh">
        <div style="height:30%; background-size: 100% 100%;background-image: url('https://img.zcool.cn/community/011d7e5d22b575a801213763a8a61a.jpg@1280w_1l_2o_100sh.jpg' )">
            <el-avatar style="width: 5vw; height: 10vh; margin-top: 5vh; border-radius: 100%":src="$store.state.curUser.avatar"/>
            <p style="color: honeydew; font-size: 3vh">{{$store.state.curUser.username}}</p>
        </div>
        <div style="float: left; margin-top: 8vh">
            <div style="display: flex">
                <h6 style="margin-left: 1vw; width: 20vw">用户名:</h6>
                <el-input style="margin-top: 2vh" v-model="username" placeholder="请输入内容" :disabled="disabled"></el-input>
            </div>
            <div style="display: flex">
                <h6 style="margin-left: 1vw; width: 20vw">密码:</h6>
                <el-input style="margin-top: 2vh" v-model="password" placeholder="*****" show-password :disabled="disabled"></el-input>
            </div>
            <div style="display: flex">
                <h6 style="margin-left: 1vw; width: 20vw">电子邮箱:</h6>
                <el-input style="margin-top: 2vh" v-model="email" placeholder="请输入内容" :disabled="disabled"></el-input>
            </div>
            <div style="display: flex;">
                <h6 style="margin-left: -3vw;width: 20vw">头像:</h6>
                <div style="width: 200px;height: 40px;background-color: #dcdfe6;">
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
            <div style="display: flex; margin-left: 17vw; margin-top: 3vh">
                <el-button @click="edit">编辑</el-button>
                <el-button @click="updateUser">保存</el-button>
            </div>
        </div>

    </div>
</template>

<script>
    import md5 from 'js-md5';
    export default {
        name: "UserDetail",
        data() {
            return {
                disabled: true,
                username: this.$store.state.curUser.username,
                password: "",
                email: this.$store.state.curUser.email,
                types: ["image/jpeg", "image/png"],
                fileList: [],
                imgFile: null,
            };
        },
        methods: {
            edit(){
                this.disabled = false;
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
            },
            updateUser(){
                if (this.username === "" || this.password === ""){
                    this.$message.error("用户名密码不能为空");
                    return;
                }
                let url = this.$store.state.baseUrl + "/user/updateUser";
                let _this = this;
                let params = new FormData()
                params.append('userId', this.$store.state.curUser.userId);
                params.append('username', this.username);
                // 对密码进行md5加密
                params.append('password', md5(this.password));
                params.append('avatarImg', this.imgFile);
                params.append('email', this.email);
                this.$axios.post(url, params).then(res => {
                    if (res.data.success){
                        this.$message.success("修改成功");
                    }
                }).catch(error => {
                    this.$message.error("修改失败");
                })
            }
        }
    }
</script>

<style scoped>

</style>