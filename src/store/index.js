

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
            showUserDetail: false,
        },
        curUser: {
            isLogin: false,
            username: "",
            userId: "",
            email: "",
            avatar: "",
            token: ""
        },
        baseUrl: "http://159.75.38.125:8283/myblog",
        baseDownloadUrl: "http://159.75.38.125:8283/myblog/file/download?path="
        // baseUrl: "http://192.168.199.207:4567/myblog",
        // baseDownloadUrl: "http://192.168.199.207:4567/myblog/file/download?path="
    },
    mutations: {
        alterView(state, showList){
            if(showList.length === 0){
                return;
            }
            for (let view of Object.keys(state.showViews)) {
                // 默认都不显示
                state.showViews[view] = false
                for (let showViewIndex in showList){
                    if (showList[showViewIndex] === view){
                        // 显示该组件
                        state.showViews[view] = true;
                        showList.splice(showViewIndex, 1);
                        break;
                    }
                }
            }

        },
        parseArticleList(state, tempArticleList) {
            for (let article of tempArticleList) {
                article.cover = state.baseDownloadUrl + article.cover;
                if (article.updateTime){
                    article.updateTime = article.updateTime.substr(0, 11).replace('T', '').replace(/-/g, '/');
                }
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
