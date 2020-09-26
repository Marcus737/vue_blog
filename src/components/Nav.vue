<template>
    <div class="nav">
        <el-row :gutter="10">
            <el-col :span="5">
                <img style="float: left;height: 8vh; width: 14vw" src="../assets/logo.png"/>
<!--                <h2 class="logo" style="margin-top: 1vh; font-family: 华文仿宋,serif; color: skyblue">NEVER GIVE UP</h2>-->
            </el-col>
            <el-col :span="19">
                <div class="componentsOfNav">
                    <div>
                        <el-menu style="height: 7vh" :default-active="activeIndex" class="selectItem" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="1" @click="recovery">首页</el-menu-item>
                            <el-menu-item @click="leaveSomething" v-if="false" index="2" >留言板</el-menu-item>
                            <el-menu-item index="3" v-if="!this.$store.state.curUser.isLogin" @click="login">登录</el-menu-item>
                            <el-menu-item index="4" v-if="this.$store.state.curUser.isLogin" @click="logout">退出</el-menu-item>
                        </el-menu>
                    </div>
                    <div class="userInfo">
                        <div class="userAvatar">
                            <img  class="userImg" :src="$store.state.curUser.avatar"/>
                        </div>
                        <h3 class="username">{{$store.state.curUser.username}}</h3>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Nav",
        data() {
            return {
                activeIndex: '1',
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
            },
            leaveSomething(){
                alert("正在完善中");
            },
            logout(){
                this.$store.state.curUser.username = "";
                this.$store.state.curUser.userId = "";
                this.$store.state.curUser.avatar = "";
                let url = this.$store.state.baseUrl + "/security/logout";
                let _this = this;
                _this.$axios.get(url).then(res=>{
                    _this.$store.state.curUser.isLogin = false;
                    _this.$store.state.curUser.refreshToken = "";
                    _this.$store.state.curUser.expireToken = "";
                })
            },
            login(){
                let showList = ["showLoginCard"]
                this.$store.commit("alterView", showList)
                // this.$store.state.showViews.showLoginCard = true;
                // this.$store.state.showViews.showCards = false;
            },
            recovery(){
                let showList = ["showCards", "showQuickSer"]
                this.$store.commit("alterView", showList)
                // this.$store.state.showViews.showCards = true;
                this.$store.state.nav.locationStr = "";
                this.$store.commit('clearArticleList');
                this.$store.commit('recovery');
            }
        }
    }
</script>

<style scoped>
    .nav{
        height: 7vh;
        opacity: 80%;
        background-color: #fbfbfb;
    }
    .logo{
        margin-left: 10%;
    }
    .componentsOfNav{
        display: flex;
        float: right;
        margin-right: 4%;
    }
    .selectItem{
        background-color: #fbfbfb;
    }
    .userInfo{
        display: flex;
    }
    .userAvatar{
        width: 2.5vw;
        height: 5vh;
        margin-top: 2%
    }
    .userImg{
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }
    .username{
        margin-top: 2vh;
        margin-left: 2%;
        width: 10vw;
    }
</style>