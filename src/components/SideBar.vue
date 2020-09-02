<template>
    <div class="menu">
        <el-menu
            class="el-menu-vertical-demo"
            background-color="#20222a"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
        >
            <el-menu-item>后台管理系统</el-menu-item>
            <el-menu-item>
                <router-link to="/home">
                    <i class="el-icon-s-home"></i>
                    <span>首页</span>
                </router-link>
            </el-menu-item>

            <el-submenu v-for="(item,index) in menus" :key="index" :index="index.toString()">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    {{item.title}}
                </template>

                <el-menu-item-group>
                    <el-menu-item
                        v-for="(it, index) in item.children"
                        :key="index"
                        :index="index.toString()"
                    >
                        <router-link :to="it.url">{{it.title}}</router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    computed: {
        menus() {
            // console.log(this.$store.state.user.menus);
            return this.$store.state.user.menus;
        },
    },

};
</script>


<style scoped>
.menu {
    height: 100%;
    background: #20222a;
}
/* 左侧宽带 */
.el-menu {
    width: 150px;
    border: none;
}
/*  */
.el-submenu .el-menu-item {
    min-width: 150px;
}
/* 导航栏的颜色 */
a {
    display: inline-block;
    width: 100%;
    text-decoration: none;
    color: #fff;
}
/* 活跃样式 */
.el-menu .is-active a.router-link-active,
.is-opened .is-active a.router-link-active {
    color: #ffd04b;
}
</style>