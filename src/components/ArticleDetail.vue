<template>
    <div id="articleDetailRootId" class="articleDetailRoot animate__animated animate__fadeIn">
        <div class="articleDetailHeader">
            <div id="pageHeader" class="articleDetailPageHeader">
                <el-page-header @back="goBack" content="详情页面"/>
            </div>
            <div id="optionIcons" class="articleDetailOptionIcons">
            </div>
        </div>
        <el-scrollbar style="height:80vh">
            <div class="articleDetailEditor" id="main">
                    <mavon-editor
                            ref=md
                            toolbarsBackground="#fbfbfb"
                            :shortCut="true"
                            :toolbars="MDToolBar"
                            :subfield="false"
                            :editable="false"
                            :defaultOpen="'preview'"
                            :scrollStyle="true"
                            :ishljs="true"
                            v-html="this.$store.state.article.markdownIt.render(this.$store.state.article.MDValue)"
                    />
            </div>
        </el-scrollbar>
        <div style="width: 45vw; height:1vh; background-color: #fbfbfb; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px"></div>
    </div>
</template>

<script>
    export default {
        name: "ArticleDetail",
        data() {
            return {
                MDValue: this.$store.state.article.MDValue,
                MDToolBar: {
                    fullscreen: true,
                    navigation: true
                }
            }
        },
        methods: {
            goBack() {
                this.$store.state.showViews.showMD = false;
                this.$store.state.showViews.showCards = true;
                this.$store.state.showViews.showQuickSer = true;
                this.$store.state.showViews.showCommentPage = false;
            }
        }
    }
</script>

<style scoped>
    .articleDetailRoot{
        border-radius: 20px;
        margin-top: 1%;
        width: 45vw;
        height: 100%;
    }
    .articleDetailHeader{
        display: flex;
        background-color: #fbfbfb;
        padding-top: 1%;
        padding-bottom: 1%;
        padding-left: 2%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    .articleDetailEditor{
        width: 45vw;
        height: 80%;
    }
    .articleDetailOptionIcons{
        margin-left: 40%;
    }
    #pageHeader:Hover{
        color: #909399;
    }
    #optionIcons:Hover{
        color: #909399;
    }
</style>