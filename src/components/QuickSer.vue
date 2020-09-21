<template>
    <div class="search animate__animated animate__fadeInDown">
        <!--        <h1 class="animate__animated animate__bounce">归档</h1>-->
        <div>
            <el-divider content-position="left" >标签查找</el-divider>
            <el-tag id="label" style="margin: 10px" v-for="label in labels" :type="label.type" @click="serArticleByLabelId(label.labelId, label.labelName)" effect="plain">
                {{ label.labelName }}
            </el-tag>
        </div>
        <div>
            <el-divider content-position="left">内容查找</el-divider>
        </div>
        <div>
            <el-input class="serInput" placeholder="请输入内容" v-model="keyword" clearable></el-input>
            <el-button class="serBtn" @click="serArticleByKeyword(keyword)" icon="el-icon-search" circle></el-button>
        </div>
        <div>
            <el-divider content-position="left">当前目录</el-divider>
        </div>
        <template>
            <el-scrollbar style="height: 40vh">
                <ul v-infinite-scroll="load" style="overflow:auto;">
                    <div  v-for="article, index in this.$store.state.article.articleList" >
                        <el-button @click="displaySelect(article)">{{index + 1}}.{{ article.title }} </el-button>
                        <el-divider></el-divider>
                    </div>
                </ul>
            </el-scrollbar>
        </template>
    </div>
</template>

<script>
    export default {
        name: "QuickSer",

        data() {
            return {
                labelTypes: ["success","info","warning","danger"],
                labels: [],
                keyword: ""
            };
        },
        mounted (){
            let _this = this;
            let url = this.$store.state.baseUrl + "/label/listLabels";
            this.$axios.get(url).then(function (res){
                let tempLabels = res.data.data;
                for (let label of tempLabels){
                    label = {"labelId": label.labelId, "labelName": label.labelName, "type": _this.labelTypes[Math.round(Math.random() * 3)]}
                    _this.labels.push(label);
                }
            })
        },
        methods: {
            displaySelect(article){
                this.$store.commit('clearArticleList');
                this.$store.state.article.articleList.length = 0;
                this.$store.state.article.articleList.push(article);
            },
            serArticleByLabelId(labelId, labelName){
                let _this = this;
                this.$store.state.nav.locationStr = "标签查找:" + labelName;
                let url = this.$store.state.baseUrl + "/article/listArticleByLabelId?" + "labelId=" + labelId;
                this.$store.commit('clearArticleList');
                this.$store.state.article.articleList.length = 0;
                this.$axios.get(url).then(function (res){
                    let tempArticleList = res.data.data.articles;
                    if (tempArticleList.length === 0){
                        _this.$message('抱歉，找不到相关内容');
                        return;
                    }
                    _this.$store.commit('parseArticleList', tempArticleList);
                })
            },
            serArticleByKeyword(keyword) {
                if (keyword === ""){
                    this.$message('请输入有效内容');
                    return;
                }
                this.$store.state.nav.locationStr = "内容查找:" + keyword;
                this.$store.commit('clearArticleList');
                this.$store.state.article.articleList.length = 0;
                let url = this.$store.state.baseUrl + "/article/serArticle?" + "keyword=" + keyword;
                let _this = this;
                this.$axios.get(url).then(function (res){
                    let tempArticleList = res.data.data.articles;
                    if (tempArticleList.length === 0){
                        _this.$message('抱歉，找不到相关内容');
                        return;
                    }
                    _this.$store.commit('parseArticleList', tempArticleList);
                })
            }
        }
    }
</script>

<style>
    .el-scrollbar__wrap{overflow-x: hidden;}
</style>
<style scoped>
    .search{
        opacity: 80%;
        margin-top: 7%
    }
    .serInput{
        width: 20vw;
        margin-right: 1vw;
    }
    .serBtn{
        display: inline;
        margin-right: 1vw;
    }
    #label:HOVER {
        cursor: pointer;
        transition: all 0.4s;
        transform: scale(1.16);
    }
</style>