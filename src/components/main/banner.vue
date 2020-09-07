<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-table :data="bannerlist" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
            <el-table-column prop="title" label="轮播图名称" width="150"></el-table-column>

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
        <el-dialog :title="'分类'+tip" :visible.sync="dialogFormVisible" width="50%" @close="close">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item
                    label="轮播图标题"
                    prop="title"
                    :rules="[{ required: true, message: '请输入轮播图标题', trigger: 'blur' }]"
                >
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>

                <!-- 文件上传 -->
                <el-form-item label="轮播图图片">
                    <el-upload
                        action="#"
                        list-type="picture-card"
                        :auto-upload="false"
                        :multiple="false"
                        :on-change="handleChangeFile"
                        :file-list="fileList"
                        ref="prodimg"
                    >
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                            <!-- <span class="el-upload-list__item-actions">
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
                            </span>-->
                        </div>
                    </el-upload>
                    <!-- <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>-->
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
import axios from "axios";
export default {
    data() {
        return {
            tip: "",
            dialogFormVisible: false,
            pageSize: 5, //可配置项 //每页显示条目个数
            //总条目数
            total: 0,

            // 规格列表/渲染
            bannerlist: [],

            //提交的表单
            ruleForm: {
                title: "", // attrs 轮播图名称
                img: "", //img 图片(文件)
                status: "1", // status 状态1正常2禁用
            },
            status: true,
            fileList: [],
        };
    },
    mounted() {
        this.getBannerlist();
    },
    methods: {
        close() {
            //提交的表单
            this.ruleForm = {
                title: "", // attrs 轮播图名称
                img: "", //img 图片(文件)
                status: "1", // status 状态1正常2禁用
            };
            //清除照片墙
            this.fileList = [];
        },
        //获取渲染数据
        getBannerlist() {
            this.$http.get("/api/bannerlist").then((res) => {
                if (res.code == 200) {
                    console.log(res);
                    this.bannerlist = res.list || [];
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
        },

        //切换状态
        changeStatus(val) {
            // 根据 切换的 boolean 决定状态
            this.ruleForm.status = val ? "1" : "2";
        },
        //更改图片墙触发的函数 file:当前图片墙信息
        handleChangeFile(file) {
            // console.log(file.raw);
            this.ruleForm.img = file.raw;
        },

        //添加
        handleAdd() {
            // this.tip = "添加";
            this.dialogFormVisible = true;
        },

        //删除
        handleDelete(row) {
            this.$http.post("/api/bannerdelete", { id: row.id }).then((res) => {
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    //重新渲染
                    this.getBannerlist();
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
            // get 请求以对象的形式传入参数，必须是在params 属性中
            this.$http
                .get("/api/bannerinfo", {
                    params: {
                        id: row.id,
                    },
                })
                .then((res) => {
                    let info = res.list;
                    info.id = row.id;
                    // info.specsattr = info.specsattr.split(",");

                    // console.log(info);
                    // this.getCategory();
                    // this.getSpecs();
                    // this.getCategory(this.ruleForm.first_cateid);
                    if (info.img !== "") {
                        this.fileList = [
                            {
                                name: "",
                                url: "http://localhost:3000" + info.img,
                            },
                        ];
                    }
                    this.ruleForm = info;
                });

            this.dialogFormVisible = true;
        },

        //提交
        handleSubmit() {
            this.dialogFormVisible = false;

            //1 修改 2添加
            let url = this.ruleForm.id ? "/api/banneredit" : "/api/banneradd";

            let data = new FormData();

            for (let i in this.ruleForm) {
                data.append(i, this.ruleForm[i]);
            }

            axios({
                method: "post",
                url,
                data,
                headers: {
                    Authorization: sessionStorage.getItem("token"),
                    // 文件上传是选择该类型
                    "Content-Type": "multipart/form-data",
                },
            }).then((res) => {
                this.$message({
                    type: "success",
                    message: "提交成功",
                });
                this.getBannerlist();
            });
        },
    },
};
</script>