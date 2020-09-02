<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            :tree-props="{children: 'children'}"
        >
            <el-table-column prop="catename" label="分类名称" width="150"></el-table-column>
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
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog :title="'分类'+tip" :visible.sync="dialogFormVisible" width="50%">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="上级分类">
                    <el-select v-model="ruleForm.pid" @change="changeMenu">
                        <el-option :key="0" label="顶层菜单" value="0"></el-option>
                        <el-option
                            v-for="item in cate"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id.toString()"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label="分类名称"
                    prop="title"
                    :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]"
                >
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>

                <!-- 文件上传 -->
                <el-form-item>
                    <el-upload
                        action="#"
                        list-type="picture-card"
                        :auto-upload="false"
                        :on-change="handleChange"
                    >
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                            <span class="el-upload-list__item-actions">
                                <span
                                    class="el-upload-list__item-preview"
                                    @click="handlePictureCardPreview(file)"
                                >
                                    <i class="el-icon-zoom-in"></i>
                                </span>
                                <span
                                    v-if="!disabled"
                                    class="el-upload-list__item-delete"
                                    @click="handleDownload(file)"
                                >
                                    <i class="el-icon-download"></i>
                                </span>
                                <span
                                    v-if="!disabled"
                                    class="el-upload-list__item-delete"
                                    @click="handleRemove(file)"
                                >
                                    <i class="el-icon-delete"></i>
                                </span>
                            </span>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
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
import axios from "axios";

export default {
    data() {
        return {
            dialogFormVisible: false,
            tip: "",
            //切换状态
            status: true,
            //商品分类 渲染
            tableData: [],
            //一级目录/弹窗
            cate: [],
            //提交对象
            ruleForm: {
                // pid上级分类编号
                pid: "",
                // catename商品分类名称
                catename: "",
                // img图片(文件，一般用于二级分类)
                img: "",
                // status状态1正常2禁用
                status: "1",
            },
            dialogImageUrl: "",
            dialogVisible: false,
        };
    },
    mounted() {
        this.getCatelist();
    },

    methods: {
        // 重置表单
        // this.ruleForm = {
        //     pid: "0",
        //     img: "",
        //     catename: "",
        //     status: "1",
        // };
        // document.querySelector(
        //     ".el-upload-list--picture-card"
        // ).innerHTML = "";
        // this.fileList = [];
        // this.state = true;
        //获取一级分类

        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        handleChange(file) {
            console.log(file);
            this.ruleForm.img = file.raw;
        },

        getCate() {
            this.$http.get("/api/catelist?pid=0").then((res) => {
                this.cate = res.list;
            });
        },

        //获取菜单数据 istree =1 返回树状结构数据渲染表格
        getCatelist() {
            this.$http.get("/api/catelist?istree=1").then((res) => {
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

        //添加
        handleAdd() {
            this.getCate();
            this.dialogFormVisible = true;
        },

        //编辑
        handleEdit(row) {
            this.getCate();
            this.dialogFormVisible = true;
            // // get 请求以对象的形式传入参数，必须是在params 属性中
            // this.$http
            //     .get("/api/userinfo", {
            //         params: {
            //             uid: row.uid,
            //         },
            //     })
            //     .then((res) => {
            //         let info = res.list;
            //         //点击修改弹出对话框，向 ruleform 添加 id 属性
            //         info.roleid = info.roleid.toString();
            //         info.id = row.id;
            //         this.ruleForm = info;
            //     });
        },

        //删除
        handleDelete(row) {
            // this.$http.post("/api/userdelete", { id: row.id }).then((res) => {
            //     if (res.code == 200) {
            //         this.$message({
            //             type: "success",
            //             message: "删除成功",
            //         });
            //     } else {
            //         this.$message({
            //             type: "warn",
            //             message: res.msg,
            //         });
            //     }
            // });
            // this.getUsercount();
            // this.getUserlist();
        },

        // 提交操作
        handleSubmit() {
            this.dialogFormVisible = false;

            console.log(this.ruleForm);

            // //1.新建表单数据对象
            // let formDate = new FormData();

            // // 2.需要上传的数据添加到容器中
            // for (var key in this.ruleForm) {
            //     // @params1: 推入的属性名
            //     // @params2: 推入的属性值
            //     formDate.append(key, this.ruleForm[key]);
            // }

            // // 原生上传添加
            // // formDate.append("img",this.$refs.upload.files[0])

            // // 3.由于需要上传图片文件，需要改写header
            // axios({
            //     method: "post",
            //     url: "/api/cateadd",
            //     data: formDate,
            //     headers: {
            //         Authorization: sessionStorage.getItem("token"),
            //         // 文件上传是选择该类型
            //         "Content-Type": "multipart/form-data ",
            //     },
            // }).then((res) => {
            //     if (res.code == 200) {
            //         this.$message({
            //             type: "success",
            //             message: "上传成功",
            //         });
            //         this.$http.get("/api/catelist?istree=1").then((res) => {
            //             console.log(res);
            //             if (res.code == 200) {
            //                 this.data = res.list;
            //             } else {
            //                 this.$message({
            //                     type: "warn",
            //                     message: res.msg,
            //                 });
            //             }
            //         });
            //     }
            // });
        },
    },
};
</script>