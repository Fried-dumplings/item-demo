<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>角色列 表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-table :data="rolelist" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
            <el-table-column prop="rolename" label="名称" width="150"></el-table-column>
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
        <el-dialog :title="'角色'+tip" :visible.sync="dialogFormVisible" width="50%" @close="close">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item
                    label="菜单名称"
                    prop="rolename"
                    :rules="[{ required: true, message: '请输入菜单名称', trigger: 'blur' }]"
                >
                    <el-input v-model="ruleForm.rolename"></el-input>
                </el-form-item>

                <el-form-item label="菜单权限">
                    <el-tree
                        ref="tree"
                        :data="menulist"
                        show-checkbox
                        node-key="id"
                        :props="{label:'title',children:'children'}"
                    ></el-tree>
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
        //权限以数组保存 提交再转为字符串
        return {
            tip: "",
            //角色列表/渲染
            rolelist: [],
            //菜单列表/弹窗
            menulist: [],
            ruleForm: {
                rolename: "", //角色名称
                menus: [], //角色权限
                status: "1", //状态1正常2禁用,
            },
            status: true,
            dialogFormVisible: false,
        };
    },

    mounted() {
        //获取角色列表/渲染
        this.getRolelist();
    },

    methods: {
        //获取角色列表/渲染
        getRolelist() {
            this.$http.get("/api/rolelist").then((res) => {
                if (res.code == 200) {
                    this.rolelist = res.list || [];
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
        },
        //获取菜单列表/弹窗
        getMenulist() {
            this.$http.get("/api/menulist?istree=1").then((res) => {
                if (res.code == 200) {
                    this.menulist = res.list || [];
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
        },
        //弹窗关闭的调用
        close() {
            this.ruleForm = {
                rolename: "", //角色名称
                menus: [], //角色权限
                status: "1", //状态1正常2禁用,
            };
            this.$refs.tree.setCheckedKeys([]);
        },

        //切换状态
        changeStatus(val) {
            // 根据 切换的 boolean 决定状态
            console.log(val);
            this.ruleForm.status = val ? "1" : "2";
        },
        //添加
        handleAdd() {
            this.getMenulist();
            this.tip = "添加";
            this.dialogFormVisible = true;
            console.log(this.ruleForm);
        },

        //编辑
        handleEdit(row) {
            this.getMenulist();
            this.tip = "修改";
            // 显示对话框
            this.dialogFormVisible = true;
            // get 请求以对象的形式传入参数，必须是在params 属性中
            this.$http
                .get("/api/roleinfo", {
                    params: {
                        id: row.id,
                    },
                })
                .then((res) => {
                    // console.log(res);
                    let info = res.list;
                    // // 点击修改弹出对话框，向 ruleform 添加 id 属性
                    info.id = row.id;
                    info.menus = info.menus.split(",");
                    info.rolename = info.rolename.toString();
                    this.ruleForm = info;
                    //更改权限选择
                    this.$refs.tree.setCheckedKeys(info.menus);
                    console.log(this.ruleForm);
                });
        },

        //删除
        handleDelete(row) {
            this.$http.post("/api/roledelete", { id: row.id }).then((res) => {
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    //获取角色列表/渲染
                    this.getRolelist();
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
        },

        //提交
        handleSubmit() {
            this.dialogFormVisible = false;
            //获取选中的权限/数组
            this.ruleForm.menus = this.$refs.tree.getCheckedKeys().join(",");

            let url = this.ruleForm.id ? "/api/roleedit" : "/api/roleadd";

            this.$http.post(url, this.ruleForm).then((res) => {
                // 向后台提交数据
                // console.log(res);
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    //获取角色列表/渲染
                    this.getRolelist();
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