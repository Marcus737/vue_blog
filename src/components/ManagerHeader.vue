<template>
    <div class="ManagerHeaderRoot">
        <el-menu
                style="margin-top: 25vh"
                background-color="#FFFAFA"
                default-active="1-4-1"
                class="el-menu-vertical-demo"
                @open=""
                @close=""
                :collapse="true">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-document"></i>
                    <span slot="title">博客</span>
                </template>
                <el-menu-item-group>
                    <span slot="title">Article</span>
                    <el-menu-item index="1-1" @click="handleClick('showArticleList')">文章</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <span slot="title">Comment</span>
                    <el-menu-item index="1-4" @click="handleClick('showCommentList')">评论</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <span slot="title">Label</span>
                    <el-menu-item index="1-4" @click="handleClick('showLabelList')">标签</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-user"></i>
                    <span  slot="title">用户</span>
                </template>
                <el-menu-item-group>
                    <span slot="title">User</span>
                    <el-menu-item index="2-2" @click="handleClick('showUserList')">用户</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-coffee"></i>
                    <span slot="title">角色</span>
                </template>
                <el-menu-item-group>
                    <span slot="title">Role</span>
                    <el-menu-item index="3-2" @click="handleClick('showRoleList')">角色</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-ice-drink"></i>
                    <span slot="title">权限</span>
                </template>
                <el-menu-item-group>
                    <span slot="title">Permission</span>
                    <el-menu-item index="4-2" @click="handleClick('showPermissionList')">权限</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "managerHeader",
        methods: {
            handleClick(showName) {
                for (let subName of Object.keys(this.$store.state.managerData.show)){
                    if (subName === showName){
                        this.$store.state.managerData.show[subName] = true;
                    }else {
                        this.$store.state.managerData.show[subName] = false;
                    }
                }
            }
        }
    }
</script>

<style scoped>
</style>