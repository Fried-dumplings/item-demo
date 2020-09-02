<template>
    <div class="menubox">
        <el-container class="menubox">
            <el-aside width="150px">
                <side-bar></side-bar>
            </el-aside>
            <el-container>
                <el-header class="state">
                    <span>{{user}}</span>
                    <a href="javascript:;" @click="leave">退出</a>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>

        <!-- <div class="sidebar">
            <side-bar></side-bar>
        </div>
        <div class="content">
            <div class="state">
                <div class="title">
                    <span>{{user}}</span>
                    <a href="javascript:;" @click="leave">退出</a>
                </div>
            </div>
            <router-view class="main"></router-view>
        </div>-->
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import SideBar from "@/components/SideBar";
export default {
    components: {
        SideBar,
    },

    computed: {
        // ...mapState(["from"]),

        user() {
            // return this.from.user;
            // console.log(Object.keys(this.from));

            return JSON.parse(sessionStorage.getItem("user")).username;

            // if (JSON.stringify(this.from) === "{}") {
            //     return JSON.parse(sessionStorage.getItem("user")).user;
            // } else {
            //     return this.from.user;
            // }
        },
    },

    methods: {
        leave() {
            let flag = confirm("确认退出吗");
            if (flag) {
                //清除session登录信息
                sessionStorage.clear();
                //清除store登录信息
                this.$store.commit("remove");
                //路由跳到登录页
                this.$router.replace("/login");
            }
        },
    },
};
</script>

<style lang="stylus" scoped>
.state
    background #b3c0d1
.menubox
    width 100%
    height 100%
</style>

