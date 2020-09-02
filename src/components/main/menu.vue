<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            :tree-props="{children: 'children'}"
        >
            <el-table-column prop="title" label="名称" width="150"></el-table-column>
            <el-table-column prop="icon" label="图标" width="150">
                <template slot-scope="scope">
                    <i :class="scope.row.icon"></i>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="150">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.type == 1 ? 'primary':'success'"
                    >{{scope.row.type == 1 ?"目录":"菜单"}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="url" label="菜单URL" width="150"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog :title="'菜单'+tip" :visible.sync="dialogFormVisible" width="50%">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="菜单类型">
                    <el-select v-model="ruleForm.pid" @change="changeMenu">
                        <el-option :key="0" label="顶层菜单" value="0"></el-option>
                        <el-option
                            v-for="item in tableData"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id.toString()"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="菜单名称"
                    prop="title"
                    :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' }]"
                >
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-radio-group v-model="ruleForm.type">
                        <el-radio label="1" :disabled="ruleForm.type == '2'">目录</el-radio>
                        <el-radio label="2" :disabled="ruleForm.type == '1'">菜单</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="菜单地址">
                    <el-input v-model="ruleForm.url"></el-input>
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
            //切换状态
            status: true,
            //树状结构 渲染
            tableData: [],
            ruleForm: {
                // 图标
                icon: "",
                // 选择上级分类
                pid: "0",
                // 状态
                status: "1",
                //文本
                title: "",
                // 类型
                type: "1",
                // 菜单路径
                url: "",
            },
        };
    },

    mounted() {
        //   获取菜单数据 istree =1 返回树状结构数据渲染表格
        this.$http.get("/api/menulist?istree=1").then((res) => {
            // console.log(res);

            if (res.code == 200) {
                this.tableData = res.list;
            } else {
                this.$message({
                    type: "warn",
                    message: res.msg,
                });
            }
        });
    },

    watch: {
        dialogFormVisible() {
            // 重置表单
            this.ruleForm = {
                icon: "",
                pid: "0",
                status: "1",
                title: "",
                type: "1",
                url: "",
            };
        },
    },

    methods: {
        // 点击切换 目录或者菜单
        changeMenu(val) {
            // 根据 切换的 option 的value 决定类型
            this.ruleForm.type = val == 0 ? "1" : "2";
        },

        // 切换状态
        changeStatus(val) {
            // 根据 切换的 boolean 决定状态
            this.ruleForm.status = val ? "1" : "2";
        },

        // 添加函数
        handleAdd() {
            this.tip = "添加";
            // 显示对话框
            this.dialogFormVisible = true;
        },

        // 修改函数
        handleEdit(row) {
            this.tip = "修改";
            // 显示对话框
            this.dialogFormVisible = true;
            // get 请求以对象的形式传入参数，必须是在params 属性中
            this.$http
                .get("/api/menuinfo", {
                    params: {
                        id: row.id,
                    },
                })
                .then((res) => {
                    let info = res.list;
                    // 点击修改弹出对话框，向 ruleform 添加 id 属性
                    info.id = row.id;
                    info.pid = info.pid.toString();
                    info.type = info.type.toString();
                    this.ruleForm = info;
                });
        },

        // 删除函数
        handleDelete(row) {
            //根据id 删除数据

            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$http
                        .post("/api/menudelete", { id: row.id })
                        .then((res) => {
                            if (res.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功",
                                });
                                this.tableData = res.list ? res.list : [];
                            } else {
                                this.$message({
                                    type: "warn",
                                    message: res.msg,
                                });
                            }
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },

        // 提交操作
        handleSubmit() {
            this.dialogFormVisible = false;
            // 通过是否具有id 来判断 修改还是新增

            let url = this.ruleForm.id ? "/api/menuedit" : "/api/menuadd";

            this.$http.post(url, this.ruleForm).then((res) => {
                // 向后台提交数据
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    // 添加成功 获取最新的菜单列表来渲染
                    this.$http.get("/api/menulist?istree=1").then((res) => {
                        console.log(res);
                        if (res.code == 200) {
                            this.tableData = res.list || [];
                        } else {
                            this.$message({
                                type: "warn",
                                message: res.msg,
                            });
                        }
                    });
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
                // 重置表单
                this.ruleForm = {
                    pid: "0",
                    title: "",
                    icon: "",
                    type: "1",
                    url: "",
                    status: "1",
                };
            });
        },

        addlist() {
            this.dialogFormVisible = true;
        },
    },
};
</script>