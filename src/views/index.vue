<template>
    <div class="index">
        <div>
            <el-row>
                <el-col :span="24">
                    <Nav/>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="30">
            <el-col :xs="7" :sm="7" :md="6" :lg="6" :xl="6">
                <MusicView/>
            </el-col>
            <el-col :xs="10" :sm="10" :md="11" :lg="11" :xl="11">
                <LoginCard v-if="this.$store.state.showViews.showLoginCard" />
                <CreateUser v-if="this.$store.state.showViews.showCreateCard"/>
                <SlidingCard style="overflow: hidden" v-show="this.$store.state.showViews.showCards" />
                <ArticleDetail v-show="this.$store.state.showViews.showMD" />
            </el-col>
            <el-col  :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
                <QuickSer v-if="this.$store.state.showViews.showQuickSer"/>
                <CommentDetail v-if="this.$store.state.showViews.showCommentPage"/>
            </el-col>
        </el-row>
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

    export default {
        name: "index.vue",
        components: {
            Nav,
            SlidingCard,
            MusicView,
            QuickSer,
            CommentDetail,
            ArticleDetail,
            LoginCard,
            CreateUser
        }
    }
</script>

<style scoped>
    .index{
        overflow: hidden;
        text-align: center;
    }
</style>