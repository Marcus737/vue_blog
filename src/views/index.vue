<template>
    <div class="index">
        <particles-bg type="polygon" :bg="true" />
        <div>
            <el-row>
                <el-col :span="24">
                    <Nav/>
                </el-col>
            </el-row>
        </div>

        <div style="opacity: 95%">
            <el-row :gutter="30">
                <el-col :xs="7" :sm="7" :md="6" :lg="6" :xl="6">
                    <MusicView/>
                </el-col>
                <el-col :xs="10" :sm="10" :md="11" :lg="11" :xl="11">
                    <LoginCard  v-if="this.$store.state.showViews.showLoginCard" />
                    <CreateUser v-if="this.$store.state.showViews.showCreateCard"/>
                    <SlidingCard style="overflow: hidden" v-show="this.$store.state.showViews.showCards" />
                    <ArticleDetail v-show="this.$store.state.showViews.showMD" />
                    <UserDetail v-if="this.$store.state.showViews.showUserDetail"/>
                </el-col>
                <el-col  :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
                    <QuickSer v-if="this.$store.state.showViews.showQuickSer"/>
                    <CommentDetail v-if="this.$store.state.showViews.showCommentPage"/>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
    import Nav from "../components/Nav";
    import SlidingCard from "../components/SlidingCard";
    import MusicView from "../components/MusicView";
    import QuickSer from "../components/QuickSer";
    import CommentDetail from "../components/CommentDetail";
    import ArticleDetail from "../components/ArticleDetail";
    import LoginCard from "../components/LoginCard";
    import CreateUser from "../components/CreateUser";
    import UserDetail from "../components/UserDetail";
    import { ParticlesBg } from "particles-bg-vue";

    export default {
        name: "index.vue",
        components: {
            UserDetail,
            Nav,
            SlidingCard,
            MusicView,
            QuickSer,
            CommentDetail,
            ArticleDetail,
            LoginCard,
            CreateUser
        },
        data(){
            return {
                config: {
                    num: [9, 17],
                    rps: 0.1,
                    radius: [5, 40],
                    life: [1.5, 3],
                    v: [2, 3],
                    tha: [-40, 40],
                    // body: "./img/icon.png", // Whether to render pictures
                    rotate: [0, 20],
                    alpha: [0.6, 0],
                    scale: [1, 0.1],
                    position: "center", // all or center or {x:1,y:1,width:100,height:100}
                    color: ["random", "#ff0000"],
                    cross: "dead", // cross or bround
                    random: 80,  // or null,
                    g: 5,    // gravity
                    // f: [2, -1], // force
                    onParticleUpdate: (ctx, particle) => {
                        ctx.beginPath();
                        ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
                        ctx.fillStyle = particle.color;
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .index{
        overflow: hidden;
        text-align: center;
    }
</style>