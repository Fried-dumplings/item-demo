<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>规格列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-table :data="specslist" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
            <el-table-column prop="specsname" label="属性名称" width="150"></el-table-column>

            <el-table-column prop="attrs" label="属性值" width="200">
                <template slot-scope="scope">
                    <el-tag v-for="(item,index) in scope.row.attrs" :key="index">{{item}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="150">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.status == 1 ? 'success':'danger'"
                        effect="dark"
                    >{{scope.row.status == 1 ?"启用":"禁用"}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)" k>编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog :title="'规格'+tip" :visible.sync="dialogFormVisible" width="50%" @close="close">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item
                    label="属性名称"
                    prop="specsname"
                    :rules="[{ required: true, message: '请输入属性名称', trigger: 'blur' }]"
                >
                    <el-input v-model="ruleForm.specsname"></el-input>
                </el-form-item>

                <el-form-item label="属性值名称">
                    <div class="attr-box" v-for="(item, index) in ruleForm.attrs" :key="index">
                        <el-input v-model="item.value"></el-input>
                        <el-button v-if="index===0" @click="handleAddAttr">添加</el-button>
                        <el-button v-if="index>0" @click="handleRemoveAttr(index)">删除</el-button>
                    </div>
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
            tip: "",
            dialogFormVisible: false,
            pageSize: 5, //可配置项 //每页显示条目个数
            //总条目数
            total: 0,

            // 规格列表/渲染
            specslist: [],

            //提交的表单
            ruleForm: {
                specsname: "", // specsname 商品规格名称
                attrs: [{ value: "" }], // attrs 商品规格属性值
                status: "1", // status 状态1正常2禁用
            },
            status: true,
        };
    },
    mounted() {
        this.getSpecslist();
    },
    methods: {
        getSpecslist() {
            this.$http
                .get("/api/specslist", {
                    params: {
                        size: this.pageSize,
                        page: 1,
                    },
                })
                .then((res) => {
                    if (res.code == 200) {
                        // console.log(res);
                        this.specslist = res.list || [];
                    } else {
                        this.$message({
                            type: "warn",
                            message: res.msg,
                        });
                    }
                });
        },

        close() {
            //提交的表单
            this.ruleForm = {
                specsname: "", // specsname 商品规格名称
                attrs: [{ value: "" }], // attrs 商品规格属性值
                status: "1", // status 状态1正常2禁用
            };
        },
        //切换状态
        changeStatus(val) {
            // 根据 切换的 boolean 决定状态
            this.ruleForm.status = val ? "1" : "2";
        },

        //添加
        handleAdd() {
            this.tip = "修改";
            this.dialogFormVisible = true;
        },

        //删除
        handleDelete(row) {
            this.$http.post("/api/specsdelete", { id: row.id }).then((res) => {
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    //获取角色列表/渲染
                    this.getSpecslist();
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
        },
        //编辑
        handleEdit(row) {
            this.tip = "修改";
            this.dialogFormVisible = true;
            // get 请求以对象的形式传入参数，必须是在params 属性中
            this.$http
                .get("/api/specsinfo", {
                    params: {
                        id: row.id,
                    },
                })
                .then((res) => {
                    let info = res.list[0];
                    info.attrs = info.attrs.map((item) => {
                        return {
                            value: item,
                        };
                    });
                    info.id = row.id;
                    this.ruleForm = info;
                });
        },

        //提交
        handleSubmit() {
            this.dialogFormVisible = false;
            //获取选中的权限/数组

            let url = this.ruleForm.id ? "/api/specsedit" : "/api/specsadd";

            let attrs = this.ruleForm.attrs.map((item) => item.value);
            this.ruleForm.attrs = attrs.join(",");

            // console.log(this.ruleForm);

            this.$http.post(url, this.ruleForm).then((res) => {
                // 向后台提交数据
                // console.log(res);
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    //获取角色列表/渲染
                    this.getSpecslist();
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
        },

        // 属性删除
        handleRemoveAttr(index) {
            this.ruleForm.attrs.splice(index, 1);
        },
        // 添加属性
        handleAddAttr() {
            this.ruleForm.attrs.unshift({ value: "" });
        },
    },
};
</script>
<style lang="">
.attr-box .el-input {
    display: inline-block;
    width: 350px;
}
</style>