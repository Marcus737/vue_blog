<template>
    <div class="musicView">
        <el-divider content-position="left">音乐</el-divider>
        <el-collapse-transition>
            <div class="firstDiv" v-show="isDisplaySerRes" v-loading="loading">
                <el-button size="small" style="margin: 10px" @click="clearList" circle><i class="el-icon-close"></i></el-button>
                <div class="infinite-list-wrapper" style="overflow:auto;">
                    <!--                    滚动条，隐藏横向的-->
                    <el-scrollbar class="scrollbar" wrap="default-scrollbar__wrap">
                        <div  class="animate__animated animate__fadeInDown" v-for="song in displayMusicInfoList">
                            <div class="songCard" id="songCard">
                                <div class="picWarp">
                                    <img class="pic" :src="song.pic"/>
                                </div>
                                <div style="margin-left: 20%">
                                    <h5 style="min-width: max-content;">{{song.title}}</h5>
                                    <h6 style="display: inline-block; color: #909399">{{song.artist}}</h6>
                                    <el-switch
                                            @change="addToList(song)"
                                            v-model=song.touchAble
                                            active-color="#13ce66"
                                            inactive-color="#DCDCDC"
                                            style="position: relative; padding-left: 20px">
                                    </el-switch>
                                    <el-divider></el-divider>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </el-collapse-transition>
        <el-input style="margin: 10px 0" placeholder="回车即可搜索" @keydown.enter.native="serSongs"
                  v-model="songInfo" clearable></el-input>

        <aplayer
                :show-lrc="true"
                :list-folded="false"
                :list-max-height="listMaxHeight"
                :list="musicList"
                :music="music"
                :volume="volumeSize"
        />
    </div>
</template>

<script>
    import Aplayer from 'vue-aplayer';
    export default {
        name: "MusicView",
        components: {
            Aplayer
        },
        methods: {
            clearList() {
                this.isDisplaySerRes = false;     //不显示搜索结果页面
                this.displayMusicInfoList.length = 0;  //清空搜索结果数组
            },
            addToList(song) {
                let _this = this;
                if (song.touchAble === true) {
                    if (_this.musicList.length !== 0) {
                        for (let songIndex in _this.musicList) {
                            let curSong = _this.musicList[songIndex];
                            if (curSong["src"] === song["src"]) { // 如果当前的src与目标的src相同
                                return;
                            }
                        }
                    }
                    _this.musicList.push(song);
                } else {
                    // 删除元素
                    for (let songIndex in _this.musicList) {
                        let curSong = _this.musicList[songIndex];
                        if (curSong["src"] === song["src"]) {
                            _this.musicList.splice(songIndex, 1);
                            return;
                        }
                    }
                }
            },
            serSongs() {
                this.$axios.get()
                if (this.songInfo === ""){
                    this.$message('请输入有效内容');
                    return;
                }
                let _this = this;
                let url = this.$store.state.baseUrl + '/music/serSong?songName=' + encodeURI(this.songInfo);
                _this.isDisplaySerRes = true; //显示搜索结果
                _this.displayMusicInfoList.length = 0; //清空搜索结果
                _this.loading = true;  //开启加载动画
                this.$axios.get(url).then(function (res) {
                    for (let song of res.data.data) {
                        song["touchAble"] = false; // 新增touchAble属性
                        song["lrc"] = ""; // 服务器没有歌词地址，设为""
                        _this.displayMusicInfoList.push(song);
                    }
                });
                setTimeout(function(){_this.loading = false;},4000); // 动画持续4秒
            },
        },
        data() {
            return {
                volumeSize: 0.5,
                isDisplaySerRes: false,
                songInfo: "",
                loading: false,
                listMaxHeight: '500px',
                displayMusicInfoList: [],
                musicList: [],
                music: {
                    title: '谪仙',
                    artist: '伊格赛听&叶里',
                    src: 'http://ef.sycdn.kuwo.cn/96ec08e967f73abeeec70961d506607d/5f492bef/resource/n2/82/69/1433435136.mp3',
                    pic: 'http://topmusic.kuwo.cn/today_recommend/images/202001/20200107_7201280/3568970/1.jpg',
                    lrc: '',
                }
            }
        }
    }
</script>

<style scoped>
    .musicView{
        margin-top: 7%;  opacity: 80%
    }
    .firstDiv{
        background-color: whitesmoke;
        border-radius: 20px;
    }
    .songCard{
        display:flex;
        text-align: center;
    }
    .picWarp{
        overflow: hidden;
        margin-left: 5%;
    }
    .pic{
        border-radius: 100%;
        width: 6vw;
        height: 12vh
    }
    .scrollbar {
        height: 40vh;
    }

    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    #songCard:HOVER {
        cursor: pointer;
        transition: all 0.6s;
        transform: scale(1.1);
    }
</style>