<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>会员列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            :tree-props="{children: 'children'}"
        >
            <el-table-column prop="nickname" label="昵称" width="150"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
            <el-table-column prop="addtime" label="注册日期" width="250"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog :title="'规格'+tip" :visible.sync="dialogFormVisible" width="50%" @close="close">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="昵称">
                    <el-input v-model="ruleForm.nickname" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="手机号">
                    <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>

                <el-form-item label="状态">
                    <el-switch v-model="status" @change="changeStatus"></el-switch>
                </el-form-item>

                <el-form-item>
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogFormVisible: false,
            tip: "",

            pageSize: 10, //可配置项 //每页显示条目个数
            //总条目数
            total: 0,

            //切换状态
            status: true,
            //商品分类 渲染
            tableData: [],
            //一级目录/弹窗
            cate: [],

            //提交对象
            ruleForm: {
                // 会员编号，必填项
                uid: "",
                // 昵称
                nickname: "",
                // 手机号
                phone: "",
                //密码
                password: "",
                // 状态1正常2禁用
                status: "1",
            },
        };
    },
    mounted() {
        this.getMemberlist();
    },

    methods: {
        close() {
            //提交对象
            this.ruleForm = {
                // 会员编号，必填项
                uid: "",
                // 昵称
                nickname: "",
                // 手机号
                phone: "",
                //密码
                password: "",
                // 状态1正常2禁用
                status: "1",
            };
        },
        //time:number类型 /时间戳转 2020-03-28 21:43:56 格式
        setTime(time = +new Date()) {
            // toJSON转换的是格林尼治时间 中国区要+8
            var date = new Date(Number(time) + 8 * 3600 * 1000);
            return date.toJSON().substr(0, 19).replace("T", " ");
        },

        //获取数据
        getMemberlist() {
            this.$http
                .get("/api/memberlist", {
                    params: { size: this.pageSize, page: 1 },
                })
                .then((res) => {
                    console.log(res);
                    let info = res.list;
                    info.map((item) => {
                        item.addtime = this.setTime(item.addtime);
                    });
                    this.tableData = res.list;
                });
        },

        //切换状态
        changeStatus(val) {
            // 根据 切换的 boolean 决定状态
            this.ruleForm.status = val ? "1" : "2";
        },

        //编辑
        handleEdit(row) {
            // this.tip = "修改";
            this.dialogFormVisible = true;
            // get 请求以对象的形式传入参数，必须是在params 属性中
            this.$http
                .get("/api/memberinfo", {
                    params: {
                        uid: row.uid,
                    },
                })
                .then((res) => {
                    console.log(res);
                    let info = res.list;
                    info.password = "";
                    this.ruleForm = info;
                });
        },
        //提交
        handleSubmit() {
            this.dialogFormVisible = false;
            //获取选中的权限/数组

            this.$http.post("/api/memberedit", this.ruleForm).then((res) => {
                // 向后台提交数据
                // console.log(res);
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    //获取角色列表/渲染
                    this.getMemberlist();
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
        },
    },
};
</script>