import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});


//axios开始
import axios from 'axios';
Vue.prototype.$axios = axios;
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 携带默认请求头
  config.headers['token'] = store.state.curUser.token;
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  let newToken = response.headers.token;
  if (newToken){
    store.state.curUser.token = newToken;
  }
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

//axios结束

//mavon-editor开始
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
Vue.use(mavonEditor);
store.state.article.markdownIt = mavonEditor.markdownIt;
//mavon-editor结束

import animated from 'animate.css' // npm install animate.css --save安装，在引入
Vue.use(animated)

import 'babel-polyfill';
