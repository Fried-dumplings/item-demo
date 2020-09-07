<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-table :data="goodslist" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
            <el-table-column prop="firstcatename" label="一级分类" width="150"></el-table-column>
            <el-table-column prop="secondcatename" label="二级分类" width="150"></el-table-column>
            <el-table-column prop="goodsname" label="商品名称" width="150"></el-table-column>
            <el-table-column prop="price" label="销售价" width="150"></el-table-column>
            <el-table-column prop="market_price" label="市场价" width="150"></el-table-column>
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
        <!-- <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="currentChange"
        ></el-pagination>-->

        <!-- 弹窗 -->
        <el-dialog
            title="角色"
            :visible.sync="dialogFormVisible"
            width="50%"
            @close="close"
            @opened="handleOpen"
        >
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="一级分类">
                    <el-select
                        v-model="ruleForm.first_cateid"
                        placeholder="请选择分类"
                        @change="handleCateChange"
                    >
                        <el-option
                            v-for="item in firstarr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="二级分类">
                    <el-select v-model="ruleForm.second_cateid">
                        <el-option
                            v-for="item in secondarr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品名称">
                    <el-input v-model="ruleForm.goodsname"></el-input>
                </el-form-item>

                <!-- 文件上传 -->
                <el-form-item label="商品图片">
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

                <el-form-item label="商品规格名">
                    <el-select v-model="ruleForm.specsid" @change="handleSpecsChange">
                        <el-option
                            v-for="item in specsarr"
                            :key="item.id"
                            :label="item.specsname"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品规格值">
                    <el-select v-model="ruleForm.specsattr" multiple placeholder="请选择">
                        <el-option
                            v-for="item in specsattrs"
                            :key="item"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="销售价">
                    <el-input v-model="ruleForm.price"></el-input>
                </el-form-item>

                <el-form-item label="市场价">
                    <el-input v-model="ruleForm.market_price"></el-input>
                </el-form-item>

                <el-form-item label="是否新品">
                    <el-radio v-model="ruleForm.isnew" :label="1">是</el-radio>
                    <el-radio v-model="ruleForm.isnew" :label="2">否</el-radio>
                </el-form-item>

                <el-form-item label="是否热卖">
                    <el-radio v-model="ruleForm.ishot" :label="1">是</el-radio>
                    <el-radio v-model="ruleForm.ishot" :label="2">否</el-radio>
                </el-form-item>

                <el-form-item label="商品描述">
                    <div id="editor" ref="editorElem"></div>
                    <!-- <el-radio v-model="ruleForm.ishot" :label="1">是</el-radio>
                    <el-radio v-model="ruleForm.ishot" :label="2">否</el-radio>-->
                </el-form-item>

                <el-form-item label="状态">
                    <el-radio v-model="ruleForm.status" :label="1">上架</el-radio>
                    <el-radio v-model="ruleForm.status" :label="2">下架</el-radio>
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
import axios from "axios";
import E from "wangeditor";

export default {
    data() {
        return {
            dialogFormVisible: false,
            pageSize: 10, //可配置项 //每页显示条目个数
            //总条目数
            total: 0,

            // 商品列表/渲染
            goodslist: [],

            //提交的表单
            ruleForm: {
                first_cateid: "", // first_cateid 一级分类编号
                second_cateid: "", // second_cateid 二级分类编号
                goodsname: "", // goodsname 商品名称
                img: "", //  // img 商品图片（文件）
                price: "", //  price 商品价格
                market_price: "", //market_price 市场价格
                description: "", // description 商品描述
                specsid: "", // specsid 商品规格名称
                specsattr: "", // specsattr 商品规格属性
                isnew: 1, // isnew 是否新品 1正常2禁用
                ishot: 1, // ishot 是否热卖推荐 1正常2禁用
                status: 1, // status 状态1正常2禁用
            },

            //一级分类列表
            firstarr: [],
            // 二级分类列表
            secondarr: [],
            // 属性类名表
            specsarr: [],
            // 属性值列表
            specsattrs: [],
            // 照片墙列表
            fileList: [],

            // 放大显示图片
            dialogImageUrl: "",
            dialogVisible: false,
            disabled: false,

            // //状态
            // status: true,

            editor: null,
            description: "",
        };
    },
    mounted() {
        this.getUserlist();
    },
    methods: {
        //弹窗关闭的调用
        close() {
            this.ruleForm = {
                first_cateid: "", // first_cateid 一级分类编号
                second_cateid: "", // second_cateid 二级分类编号
                goodsname: "", // goodsname 商品名称
                img: "", //  // img 商品图片（文件）
                price: "", //  price 商品价格
                market_price: "", //market_price 市场价格
                description: "", // description 商品描述
                specsid: "", // sepcsid 商品规格编号
                specsattr: "", // sepcsattr 商品规格属性
                isnew: 1, // isnew 是否新品 1正常2禁用
                ishot: 1, // ishot 是否热卖推荐 1正常2禁用
                status: 1, // status 状态1正常2禁用
            };

            //一级分类列表
            this.firstarr = [];
            // 二级分类列表
            this.secondarr = [];
            // 属性类表
            this.specsarr = [];
            // 属性值列表
            this.specsattrs = [];
            //清除照片墙
            this.fileList = [];
        },

        // 打开对话框， 富文本编辑
        handleOpen() {
            //!!!一定要在弹窗打开后才能绑定  否则找不到弹窗内的html节点 弹窗是懒渲染

            //绑定富文本编辑框
            this.editor = new E("#editor");
            // 2.绑定用户的输入操作事件：  html 用户输入的内容
            this.editor.customConfig.onchange = (html) => {
                // 将用户输入的内容和 表单描述绑定
                this.ruleForm.description = html;
            };
            //3. 创建富文本编辑器
            this.editor.create();
            // 富文本编辑框预设文字
            this.editor.txt.html(this.ruleForm.description);
        },

        // 商品列表/渲染
        getUserlist() {
            this.$http
                .get("/api/goodslist", {
                    params: {
                        size: this.pageSize,
                        page: 1,
                    },
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.goodslist = res.list || [];
                    } else {
                        this.$message({
                            type: "warn",
                            message: res.msg,
                        });
                    }
                });
        },

        //获取商品总页数/渲染
        getUsercount() {
            this.$http.get("/api/goodscount").then((res) => {
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

        // 获取分类 /弹窗 1，2级分类
        getCategory(pid = 0) {
            this.$http.get("/api/catelist", { params: { pid } }).then((res) => {
                // console.log(res);
                // pid 为0，获取一级分类
                if (pid === 0) {
                    this.firstarr = res.list;
                } else {
                    // 获取二级分类
                    this.secondarr = res.list;
                }
            });
        },

        //获取属性值 /弹窗
        getSpecs() {
            // 属性列表,如果 this.form.specsid 为空字符串,
            // 通过添加来获取属性值,由于没有属性名,获取的属性值列表为空

            // 通过添加打开,this.form.specsid 设为当前的商品 属性值
            // 获取属性值
            this.$http.get("/api/specslist").then((res) => {
                // console.log(res,this.form.specsid)
                // 获取规格
                this.specsarr = res.list;
                this.specsarr.map((item) => {
                    if (item.id === this.ruleForm.specsid) {
                        // 规格属性
                        this.specsattrs = item.attrs;
                    }
                });
                //
                // console.log(this.specsattrs)
            });
        },
        // 属性切换 /事件函数
        handleSpecsChange() {
            var nowselect = this.specsarr.find((d, i) => {
                return d.id === this.ruleForm.specsid;
            });
            // 获取属性值
            // console.log(nowselect.attrs)
            this.specsattrs = nowselect.attrs;
        },

        // 切换分类,传入一级分类的id ,一级的id就是二级的pid /事件函数
        handleCateChange(pid) {
            this.secondarr = [];
            this.ruleForm.second_cateid = "";
            this.getCategory(pid);
        },

        //更改图片墙触发的函数 file:当前图片墙信息
        handleChangeFile(file) {
            // console.log(file.raw);
            this.ruleForm.img = file.raw;
        },

        //改变页码时触发的组件函数 page:当前页码
        currentChange(page) {
            // this.$http
            //     .get("/api/userlist", {
            //         params: {
            //             size: this.pageSize,
            //             page,
            //         },
            //     })
            //     .then((res) => {
            //         if (res.code == 200) {
            //             this.userlist = res.list || [];
            //         } else {
            //             this.$message({
            //                 type: "warn",
            //                 message: res.msg,
            //             });
            //         }
            //     });
        },

        //添加
        handleAdd() {
            this.getCategory();
            this.getSpecs();
            this.dialogFormVisible = true;
        },

        //编辑
        handleEdit(row) {
            // get 请求以对象的形式传入参数，必须是在params 属性中
            this.$http
                .get("/api/goodsinfo", {
                    params: {
                        id: row.id,
                    },
                })
                .then((res) => {
                    let info = res.list;
                    info.id = row.id;
                    info.specsattr = info.specsattr.split(",");

                    this.getCategory();
                    this.getSpecs();
                    this.getCategory(this.ruleForm.first_cateid);
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

        //删除
        handleDelete(row) {
            this.$http.post("/api/goodsdelete", { id: row.id }).then((res) => {
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
            this.getUserlist();
            // this.getUsercount();
        },

        // 提交操作
        handleSubmit() {
            this.dialogFormVisible = false;

            let url = this.ruleForm.id ? "/api/goodsedit" : "/api/goodsadd";

            this.ruleForm.specsattr = this.ruleForm.specsattr.join(",");

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
                this.getUserlist();
            });
        },
    },
};
</script>