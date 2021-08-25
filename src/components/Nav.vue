<template>
    <div class="nav">
        <el-row :gutter="10">
            <el-col :span="5">
<!--                <img style="float: left;height: 8vh; width: 14vw" src="../assets/logo.png"/>-->
                <h2 class="logo" style="margin-top: 1vh; font-family: 华文仿宋,serif; color: skyblue">NEVER GIVE UP</h2>
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
                    <span style="color: #909399; margin-top: 1.8vh">|</span>
                    <div class="userInfo">
                        <div class="userAvatar">
                            <img id="avatar" @click="displayUserDetail" style="margin-top: 0.7vh; margin-left: 2vw" v-if="$store.state.curUser.isLogin" class="userImg" :src="$store.state.curUser.avatar"/>
                        </div>
                        <h4 class="username">{{$store.state.curUser.username}}</h4>
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
            displayUserDetail(){
                let showList = ["showUserDetail"];
                this.$store.commit("alterView", showList)
            },
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
            },
            leaveSomething(){
                alert("正在完善中");
            },
            logout(){
                this.$store.state.curUser.username = "";
                this.$store.state.curUser.userId = "";
                this.$store.state.curUser.isLogin = false;
                this.$store.state.curUser.avatar = "";
                this.$store.state.curUser.token = "";
            },
            login(){
                let showList = ["showLoginCard"]
                this.$store.commit("alterView", showList)
            },
            recovery(){
                let showList = ["showCards", "showQuickSer"]
                this.$store.commit("alterView", showList);
                this.$store.state.nav.locationStr = "";
                this.$store.commit('clearArticleList');
                this.$store.commit('recovery');
            }
        }
    }
</script>

<style scoped>
    #avatar:HOVER {
        cursor: pointer;
        transition: all 0.6s;
        transform: scale(1.1);
    }
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
        margin-top: 2%;
        display:flex;
        justify-content:center;
        align-items:center;
    }
    .userImg{
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }
    .username{
        margin-top: 2vh;
        width: 10vw;
    }
</style>