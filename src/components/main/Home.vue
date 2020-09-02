<template>
    <div>
        <h1>首页</h1>
        <el-button type="primary" @click="fn">主要按钮</el-button>
    </div>
</template>


<script>
export default {
    
    methods:{
        fn(){
            this.$message.error('错了哦，这是一条错误消息');
        }
    }
}
</script>