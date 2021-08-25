<template>
    <div class="sc">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item  :to="{ path: '' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$store.state.nav.locationStr}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-scrollbar style="height: 80vh;" class="scrollbar">
            <div class="list" v-infinite-scroll="load" style="overflow: auto" infinite-scroll-disabled="disabled">
                <div v-for="article in this.$store.state.article.articleList" @click="displayMDAndComment(article.markdownUrl, article.articleId)" class="list-item" style="margin: 40px;">
                    <!--   这里开始是卡片的代码             -->
                    <div class="card box animated bounceInDown" id="card">
                        <div class="tags">
                            <el-tag class="animate__animated animate__fadeInDown animate__slow subTag" v-for="label in article.labels" type="info" effect="light">{{label.labelName}}</el-tag>
                        </div>
                        <div  class="articleSimpleInfo">
                            <span class="commentText">
                                {{article.comments.length}}条评论
                                <el-divider direction="vertical"></el-divider>
                                {{article.updateTime}}
                                <el-divider direction="vertical"></el-divider>
                                {{article.author}}
                            </span>
                        </div>
                        <br>
                        <br>
                        <div style="display: flex; margin-top: 3vh">
                            <div class="articleCover">
                                <img style="" class="animate__animated animate__slideInRight animate__fast cover" :src="article.cover"/>
                            </div>
                            <div style="width: 18vw" class="animate__animated animate__backInLeft animate__fast ">
                                <h4 class="articleTitleText">{{article.title}}</h4>
                                <p class="articleBriefDescriptionText">
                                    {{article.briefDescription}}
                                </p>
                            </div>
                        </div>
                        <!--      结束代码          -->
                    </div>
                </div>
                <p v-loading="loading" v-if="loading"></p>

                <!--                <p v-if="noMore">没有更多了</p>-->
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
    export default {
        name: "SlidingCard",
        data() {
            return {
                totalArticleNum: 0,
                pageIndex: 0,
                count: 4,
                loading: false,
            }
        },
        computed: {
            noMore() {
                return this.pageIndex*this.count > this.totalArticleNum;
            },
            disabled() {
                return this.loading || this.noMore;
            }
        },
        methods: {
            displayMDAndComment(MDUrl, articleId){
                let showList = ["showMD", "showCommentPage"]
                this.$store.commit("alterView", showList)
                this.$store.state.article.curArticleId = articleId;
                let url = this.$store.state.baseUrl + "/file/download?path=" + MDUrl;
                let _this = this;
                this.$axios.get(url).then((res) => {
                    _this.$store.state.article.MDValue = res.data;
                });
                // 显示评论
                let commentUrl = this.$store.state.baseUrl + "/comment/listCommentsByArticleId?articleId=" + this.$store.state.article.curArticleId;
                this.$axios.get(commentUrl).then(function (res){
                    let comments = res.data.data;
                    for(let comment of comments){

                        comment.commentTime = comment.commentTime.substr(0, 10);
                        if(comment.displayUser == null){
                            comment.displayUser = {userId: null, username: "账户已注销", avatar: "https://img.zcool.cn/community/015a465698b54432f87574be965625.png@1280w_1l_2o_100sh.png"}
                            continue;
                        }
                        comment.displayUser.avatar = _this.$store.state.baseDownloadUrl + comment.displayUser.avatar;
                    }
                    _this.$store.state.article.comments = comments;
                })
            },
            load() {
                this.loading = true;
                let _this = this;
              this.pageIndex += 1;
                let url = this.$store.state.baseUrl + "/article/listArticles?" + "begin=" + this.pageIndex + "&count=" + this.count;

                setTimeout(() => {
                    this.$axios.get(url).then(function (res){
                        let tempArticleList = res.data.data.articles;
                        _this.totalArticleNum = res.data.data.totalArticleNum;
                        _this.$store.commit('parseArticleList', tempArticleList);
                    })
                    this.loading = false
                }, 2000)
            }
        }
    }
</script>

<style scoped>

    #card:HOVER {
        cursor: pointer;
        transition: all 0.6s;
        transform: scale(1.1);
    }
    .sc{
        overflow: auto;
        margin-top: 2%;
        opacity: 90%
    }
    .card{
        border-radius: 20px;
        width:38vw;
        height: 100%;
        background-color: #f7f7f7;
        text-align: center;
        background-color: #fbfbfb
    }
    .tags{
        float: left;
        margin-left: 20px;
        display: flex;
    }
    .subTag{
        margin-top: 15px;
        margin-left: 10px;
    }
    .articleSimpleInfo{
        float: right;
        margin-top: 20px;
        margin-right: 15px
    }
    .commentText{
        font-size: 14px;
        margin-left: 10px;
        color: #606266;
    }
    .articleCover{
        margin-left: 15px;
        margin-bottom: 20px;
        width: 17vw;
        height: 25vh;
    }
    .cover{
        width: 100%;
        height: 100%;
        object-fit:cover;
        border-radius: 20px
    }
    .articleTitleText{
        color: #303133;
        padding-top: 10px;
        margin-left: 2vw;
        letter-spacing: 3px;
    }
    .articleBriefDescriptionText{
        color: #606266;
        font-size: 1vw;
        padding-top: 1vh;
        padding-left: 3vw;
        padding-right: 2px;
        letter-spacing: 2px;
        text-indent: 2em;
        text-align: left;
    }
</style>