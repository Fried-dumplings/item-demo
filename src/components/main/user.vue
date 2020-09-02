<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-table :data="userlist" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
            <el-table-column prop="uid" label="用户编号" width="150"></el-table-column>
            <el-table-column prop="rolename" label="角色" width="150"></el-table-column>
            <el-table-column prop="username" label="用户名" width="150"></el-table-column>
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
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="currentChange"
        ></el-pagination>

        <!-- 弹窗 -->
        <el-dialog title="角色" :visible.sync="dialogFormVisible" width="50%" @close="close">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色">
                    <el-select v-model="ruleForm.roleid">
                        <el-option
                            v-for="item in rolelist"
                            :key="item.id"
                            :label="item.rolename"
                            :value="item.id.toString()"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用户名">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>

                <el-form-item label="状态">
                    <el-switch v-model="status" @change="changeStatus"></el-switch>
                </el-form-item>

                <el-form-item>
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //每页显示条目个数
            pageSize: 2, //可配置项

            dialogFormVisible: false,
            //总条目数
            total: 0,
            // 管理员列表/渲染
            userlist: [],
            //角色列表/弹窗
            rolelist: [],

            ruleForm: {
                //角色编号
                roleid: "",
                //管理员名称
                username: "",
                //密码
                password: "",
                //状态
                status: "1",
            },
            status: true,
        };
    },
    mounted() {
        this.getUsercount();
        this.getUserlist();
    },
    methods: {
        //获取管理员总页数/渲染
        getUsercount() {
            this.$http.get("/api/usercount").then((res) => {
                if (res.code == 200) {
                    this.total = res.list[0].total || 0;
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
        },
        // 管理员列表/渲染
        getUserlist() {
            this.$http
                .get("/api/userlist", {
                    params: {
                        size: this.pageSize,
                        page: 1,
                    },
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.userlist = res.list || [];
                    } else {
                        this.$message({
                            type: "warn",
                            message: res.msg,
                        });
                    }
                });
        },
        //角色列表/弹窗
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
        //改变页码时触发的组件函数 page:当前页码
        currentChange(page) {
            this.$http
                .get("/api/userlist", {
                    params: {
                        size: this.pageSize,
                        page,
                    },
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.userlist = res.list || [];
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
                //角色编号
                roleid: "",
                //管理员名称
                username: "",
                //密码
                password: "",
                //状态
                status: "1",
            };
        },

        // 切换状态
        changeStatus(val) {
            this.ruleForm.status = val ? "1" : "2";
        },

        //添加
        handleAdd() {
            this.getRolelist();
            this.dialogFormVisible = true;
        },

        //编辑
        handleEdit(row) {
            this.getRolelist();
            // this.tip = "修改";
            // 显示对话框
            this.dialogFormVisible = true;
            // get 请求以对象的形式传入参数，必须是在params 属性中
            this.$http
                .get("/api/userinfo", {
                    params: {
                        uid: row.uid,
                    },
                })
                .then((res) => {
                    let info = res.list;
                    //点击修改弹出对话框，向 ruleform 添加 id 属性
                    info.roleid = info.roleid.toString();
                    info.id = row.id;
                    this.ruleForm = info;
                });
        },

        //删除
        handleDelete(row) {
            this.$http.post("/api/userdelete", { id: row.id }).then((res) => {
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: "删除成功",
                    });
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
            this.getUsercount();
            this.getUserlist();
        },

        // 提交操作
        handleSubmit() {
            this.dialogFormVisible = false;

            let url = this.ruleForm.id ? "/api/useredit" : "/api/useradd";

            this.$http.post(url, this.ruleForm).then((res) => {
                // 向后台提交数据
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
            this.getUsercount();
            this.getUserlist();
        },
    },
};
</script>