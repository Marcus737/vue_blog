<template>
    <div>
        <div v-show="!showEditPage">
            <div style="float: left; margin-top: 3vh">
                <h1 style="color: #2277aa">ARTICLE OPTIONS</h1>
            </div>
            <div style="margin-top: 3vh;">
                <el-table
                        :data="articleList"
                        style="width: 100%">
                    <el-table-column
                            label="ARTICLE_ID"
                            width="80">
                        <template slot-scope="scope">
                        <span style="margin-left: 10px">
                            <el-input
                                    v-model="scope.row.articleId"
                                    disabled="true">
                            </el-input>
                        </span>
                        </template>
                    </el-table-column>

                    <el-table-column
                            label="标题"
                            width="180">
                        <template slot-scope="scope">
                            <el-input
                                    v-model="scope.row.title"
                                    :disabled="scope.row.disable">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="简述"
                            width="180">
                        <template slot-scope="scope">
                            <el-input
                                    type="textarea"
                                    :rows="1"
                                    v-model="scope.row.briefDescription"
                                    :disabled="true">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="作者"
                            width="180">
                        <template slot-scope="scope">
                            <el-input
                                    :rows="1"
                                    v-model="scope.row.author"
                                    :disabled="true">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="封面"
                            width="180">
                        <template slot-scope="scope">
                            <el-input
                                    :rows="1"
                                    v-model="scope.row.cover"
                                    :disabled="true">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="标签"
                            width="100">
                        <template slot-scope="scope">
                            <el-dropdown>
                              <span class="el-dropdown-link">
                                所有标签<i class="el-icon-arrow-down el-icon--right"></i>
                              </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="label in scope.row.labels">{{label.labelName}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="更新时间"
                            width="180">
                        <template slot-scope="scope">
                            <el-input
                                    :rows="1"
                                    v-model="scope.row.updateTime"
                                    :disabled="true">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="MarkDownUrl"
                            width="180">
                        <template slot-scope="scope">
                            <el-input
                                    :rows="1"
                                    v-model="scope.row.markdownUrl"
                                    :disabled="true">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="info"
                                       size="mini"
                                       @click="updateArticle(scope.$index, scope.row)">修改文章</el-button>
                            <div></div>
                            <el-button type="info"
                                       size="mini"
                                       @click="saveArticle(scope.$index, scope.row)">添加文章</el-button>
                            <div></div>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="removeArticle(scope.$index, scope.row)">删除文章
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="float: bottom; margin-top: 3vh; margin-left: 25vw;display: flex">
                <el-button icon="el-icon-refresh-right" @click="refreshData" circle></el-button>
                <el-pagination
                        style="margin-left: 3vw"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage1"
                        :page-sizes="[5, 10, 20]"
                        :page-size="count"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalNum">
                </el-pagination>

            </div>
        </div>
        <div v-show="showEditPage">
            <div>
                <h1>|-0-|</h1>
            </div>
            <el-scrollbar style="height: 85vh; width: 80vw; " class="scrollbar">
                <div>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="标题">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label="简述">
                            <el-input type="textarea" v-model="form.desc"></el-input>
                        </el-form-item>
                        <el-form-item label="作者">
                            <el-input v-model="form.author"></el-input>
                        </el-form-item>
                        <el-form-item label="封面">
                            <el-upload
                                    :before-upload="uploadCover"
                                    :on-remove="handleRemove"
                                    :file-list="tempFileList">
                                <img v-if="imageUrl" :src="imageUrl">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="标签">
                            <el-select v-model="form.selectedLabels" multiple placeholder="可选标签">
                                <el-option
                                        v-for="item in form.selectAbleLabels"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">保存修改</el-button>
                            <el-button @click="showEditPage = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div id="main">
                    <mavon-editor class="md"
                                  ref=md
                                  :toolbarsFlag="true"
                                  :editable="true"
                                  :scrollStyle="true"
                                  :ishljs="true"
                                  :boxShadow="true"
                                  @imgAdd="handleImgAdd"
                                  @imgDel="$imgDel"
                                  v-model="form.MDValue"/>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ManagerArticleList",
        data(){
            return {
                imageUrl: "",
                currentPage1: 1,
                begin: 0,
                totalNum: 0,
                count: 5,
                articleList: [],
                showEditPage: false,
                isSaveArticle: false,
                imgFile: null,
                tempFileList: [],
                types: ["image/jpeg", "image/png"],
                form: {
                    MDUrl: "",
                    cover: "",
                    articleId: "",
                    MDValue: "",
                    title: "",
                    desc: "",
                    author: "",
                    selectedLabels: [],
                    selectAbleLabels: [],
                }
            }
        },
        methods:{
            $imgDel(){

            },
            clearEditPage(){
                this.form.MDUrl = "";
                this.form.cover = "";
                this.form.articleId = "";
                this.form.MDValue = "";
                this.form.title = "";
                this.form.desc = "";
                this.form.author = "";
                this.form.selectedLabels.length = 0;
                this.form.selectAbleLabels.length = 0;
                this.tempFileList.length = 0;
            },
            setAbleLabels(){
                let _this= this;
                let url = this.$store.state.baseUrl + "/label/listLabels";
                this.$axios.get(url).then(res =>{
                        if (res.data.success){
                            for (let label of res.data.data){
                                _this.form.selectAbleLabels.push({value: label.labelId, label: label.labelName});
                            }
                        }else {
                            _this.$message.error(res.data.msg);
                        }
                })
            },
            setMDValue(MDUrl){
                let _this= this;
                let url = this.$store.state.baseDownloadUrl + MDUrl;
                this.$axios.get(url).then(res =>{
                        _this.form.MDValue = res.data;
                })
            },
            refreshData(){
                this.articleList.length = 0;
                this.getArticles(this.begin, this.count);
            },
            getArticles(begin, count){
                let _this= this;
                let url = this.$store.state.baseUrl + "/article/listArticles?" + "begin=" +  begin + "&count=" + count;
                this.$axios.get(url).then(res =>{
                    if (res.data.success){
                        _this.totalNum = parseInt(res.data.data.totalArticleNum) ;
                        for (let article of res.data.data.articles){
                            article.updateTime = new Date(8 * 60 * 60 * 1000 + article.updateTime).toJSON().substr(0, 19).replace('T', '').replace(/-/g, '/');
                            article.updateTime = article.updateTime.substr(0, 10) + " " + article.updateTime.substr(10, 19);
                            article["disable"] = true;
                            _this.articleList.push(article)
                        }
                    }else {
                        _this.$message.error(res.data.msg)
                    }
                })
            },
            handleSizeChange(val) {
                this.begin = 0;
                this.count = val
                this.articleList.length = 0;
                this.getArticles(this.begin, this.count)
            },
            handleCurrentChange(val) {
                this.begin = this.count * (val - 1);
                this.articleList.length = 0;
                this.getArticles(this.begin, this.count)
            },
            saveArticle(index, row){
                this.showEditPage = true;
                this.isSaveArticle = true;
                this.clearEditPage();
                this.setAbleLabels();
            },
            removeArticle(index, row){
                this.$confirm('此操将该角色取消授权于选中用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _this= this;
                    let url = this.$store.state.baseUrl + "/article/removeArticle?articleId=" + row.articleId;
                    this.$axios.get(url).then(res =>{
                        if (res.data.success){
                            _this.$message.success("删除成功");
                            _this.refreshData();
                        }else{
                            _this.$message.success("删除失败" +　res.data.msg);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            updateArticle(index, row){
                this.showEditPage = true;
                this.isSaveArticle = false;
                this.clearEditPage();
                this.form.MDUrl = row.markdownUrl;
                this.form.cover = row.cover;
                this.form.articleId = row.articleId;
                this.form.title = row.title;
                this.form.author = row.author;
                this.form.desc = row.briefDescription;
                for (let label of row.labels){
                    this.form.selectedLabels.push(label.labelId)
                }
                this.setMDValue(row.markdownUrl)
                this.setAbleLabels();
            },
            onSubmit() {
                let _this= this;
                let url = this.$store.state.baseUrl + "/article/updateArticle";
                if (this.isSaveArticle){
                    url = this.$store.state.baseUrl + "/article/saveArticle";
                }
                let params = new FormData()
                params.append('articleId', this.form.articleId)
                params.append('title', this.form.title);
                params.append('author', this.form.author);
                params.append('cover', this.form.cover);
                params.append('briefDescription', this.form.desc);
                params.append('markdownUrl', this.form.MDUrl);
                params.append('articleLabelIds', this.form.selectedLabels);
                let articleFile = new Blob([this.form.MDValue]);
                params.append('articleFile', articleFile);
                params.append('articleCover', this.imgFile);
                this.$axios.post(url, params).then(res =>{
                    if (res.data.success){
                        _this.$message.success("修改成功");
                        _this.refreshData();
                        this.showEditPage = false;
                    }else{
                        _this.$message.success(res.data.msg);
                    }
                })
            },
            uploadCover(file){
                // 判断上传的数量是否超过限制
                if (this.tempFileList.length >= 1){
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
                    this.$message.error('上传图片只能是 JPG或PNG 格式!');
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                    return false
                }
                this.imgFile = file;
                this.tempFileList.push({name: file.name, url: ''});
            },
            handleRemove(){
                this.fileList.length = 0;
            },
            // 绑定@imgAdd event
            handleImgAdd(pos, $file){
                let _this = this;
                // 第一步.将图片上传到服务器.
                let formdata = new FormData();
                formdata.append('pictureImg', $file);
                formdata.append('articleId', this.form.articleId)
                this.$axios({
                    url: this.$store.state.baseUrl + "/picture/savePicture",
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data'},
                }).then((res) => {
                    console.log(res)
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    // $vm.$img2Url 详情见本页末尾
                    if (res.data.success){
                        _this.$refs.md.$img2Url(pos, _this.$store.state.baseDownloadUrl + res.data.data)
                    }else {
                        _this.$message.error("上传图片失败" + res.data.msg)
                    }

                })
            },
        },
    }
</script>

<style scoped>

</style>