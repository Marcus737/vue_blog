import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        managerData: {
            show: {
                showUserList: false,
                showRoleList: true,
                showPermissionList: false,
                showCommentList: false,
                showArticleList: false,
                showLabelList: false,
            }
        },
        nav: {
            locationStr: "", // 当前定位的位置
        },
        article: {
            markdownIt: null,
            tempArticleList: [],
            articleList: [],
            curArticleId: "",
            MDValue: "",
            comments: [],
            isClear: false
        },
        showViews: {
            showLogin: false,
            showLoginCard: false,
            showCards: true,
            showMD: false,
            showQuickSer: true,
            showCommentPage: false,
            showCreateCard: false,
        },
        curUser: {
            isLogin: false,
            username: "",
            userId: "",
            avatar: "https://tse3-mm.cn.bing.net/th/id/OIP.SPgi8xOde1kjnDteneAVeAAAAA?w=173&h=180&c=7&o=5&pid=1.7",
            token: ""

        },
        baseUrl: "http://8.129.19.186:4567/myblog",
        baseDownloadUrl: "http://8.129.19.186:4567/myblog/file/download?path="
    },
    mutations: {
        parseArticleList(state, tempArticleList) {
            for (let article of tempArticleList) {
                article.cover = state.baseDownloadUrl + article.cover;
                article.updateTime = new Date(8 * 60 * 60 * 1000 + article.updateTime).toJSON().substr(0, 11).replace('T', '').replace(/-/g, '/');
                state.article.articleList.push(article);
            }
        },
        clearArticleList: (state) => {
            if (state.article.isClear) {
                return;
            }
            state.article.isClear = true;
            for (let article of state.article.articleList) {
                state.article.tempArticleList.push(article);
            }
            state.article.articleList.length = 0;
        },
        recovery(state) {
            state.article.articleList.length = 0;
            state.article.isClear = false;
            for (let article of state.article.tempArticleList) {
                state.article.articleList.push(article);
            }
            state.article.tempArticleList.length = 0;
        }
    },
    actions: {},
    modules: {}
})
