<template>
    <div class="commentRoot animate__animated animate__fadeIn">
<!--        <el-button size="small" style="margin-top: 1vh" @click="unShowCommentPage" circle><i class="el-icon-close"></i></el-button>-->
        <div class="commentHeader">
            <h3 style="color: #303133">评论</h3>
        </div>
        <div class="commentArea">
            <el-input
                    type="textarea"
                    :rows="3"
                    :maxlength="300"
                    :resize="none"
                    :show-word-limit="true"
                    :clearable="true"
                    placeholder="期待你的抑言抑语 o(￣▽￣)ｄ"
                    v-model="commentContent">
            </el-input>
        </div>
        <div class="submitComment">
            <el-button @click="saveComment" size="mini" type="success" round>发送评论</el-button>
        </div>
        <div class="commentScrollbar" style="margin-top: 3%; margin-left: 5%; margin-right: 5%;">
            <el-scrollbar style="height:63vh;">
                <div class="commentCard" >
                    <div v-for="comment in this.$store.state.article.comments">
                        <el-divider/>
                        <div style="display: flex">
                            <img style="border-radius: 100%; width: 2.5vw; height: 5vh" :src="comment.displayUser.avatar"></img>
                            <h3 style="margin-left: 4%; padding-top: 1%;color: #606266">{{comment.displayUser.username}}</h3>
                            <p style="margin-left: 4%; padding-top: 2%;color: #909399">{{comment.commentTime}}</p>
                        </div>
                        <p style="color: #606266;letter-spacing: 2px; text-indent: 2em; text-align: left;">
                            {{comment.commentContent}}
                        </p>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CommentDetail",
        data() {
            return{
                commentContent: "",
            }
        },
        computed:{

        },
        methods: {
            refreshComment(){
                let _this = this;
                let commentUrl = this.$store.state.baseUrl + "/comment/listCommentsByArticleId?articleId=" + this.$store.state.article.curArticleId;
                this.$axios.get(commentUrl).then(function (commentRes){
                    let comments = commentRes.data.data;
                    for(let comment of comments){
                        comment.commentTime = new Date(8 * 60 * 60 * 1000 + comment.commentTime).toJSON().substr(0, 19).replace('T', '').replace(/-/g, '/');
                        comment.commentTime = comment.commentTime.substr(0, 10) + " " + comment.commentTime.substr(10, 19);
                        if(comment.displayUser == null){
                            comment.displayUser = {userId: null, username: "账户已注销", avatar: "https://img.zcool.cn/community/015a465698b54432f87574be965625.png@1280w_1l_2o_100sh.png"}
                            continue;
                        }
                        comment.displayUser.avatar = _this.$store.state.baseDownloadUrl + comment.displayUser.avatar;
                    }
                    _this.$store.state.article.comments = comments;
                })
            },
            unShowCommentPage(){
                this.$store.state.showViews.showCommentPage = false;
            },
            saveComment(){
                if (this.commentContent === ""){
                    this.$message.error("评论内容不能为空")
                    return;
                }
                if (this.$store.state.curUser.token === ""){
                    this.$message.error("请先登录后操作")
                    return;
                }
                let url = this.$store.state.baseUrl + "/comment/saveComment";
                let _this = this;
                let params = new FormData()
                params.append('commentContent', this.commentContent);
                params.append('userId', this.$store.state.curUser.userId);
                params.append('articleId', this.$store.state.article.curArticleId);
                this.$axios.post(url, params).then(res => {
                    if (res.data.success){
                        this.$message.success("评论保存成功");
                        _this.refreshComment();
                    }else{
                        this.$message.error("评论保存失败");
                    }
                }).catch(error => {
                    this.$message.error('评论保存失败');
                })
            }
        }
    }
</script>

<style scoped>
    .commentRoot{
        border-radius: 20px;
        margin-top: 5%;
        width: 27vw;
        height: 88vh;
        background-color: #fbfbfb;
    }
    .commentHeader{
        margin-top: 5%;
        margin-left: 5%;
        display: flex;
    }
    .commentArea{
        margin-left: 5%;
        margin-right: 5%;
    }
    .submitComment{
        margin-top: 2%;
        margin-right: 5%;
        text-align: right;
    }
</style>
