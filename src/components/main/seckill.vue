<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">
                <a href="/">首页</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>秒杀活动列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-table :data="secklist" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
            <el-table-column prop="title" label="秒杀活动名称" width="150"></el-table-column>

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
                    label="活动名称"
                    prop="title"
                    :rules="[{ required: true, message: '请输入活动名称', trigger: 'blur' }]"
                >
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>

                <el-form-item label="状态">
                    <el-date-picker
                        v-model="timeValue"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="timestamp"
                        @change="timeEv"
                    ></el-date-picker>
                </el-form-item>

                <el-form-item label="一级分类">
                    <el-select
                        v-model="ruleForm.first_cateid"
                        placeholder="请选择分类"
                        @change="getCateid(ruleForm.first_cateid)"
                    >
                        <el-option
                            v-for="item in firstCateid"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="二级分类">
                    <el-select
                        v-model="ruleForm.second_cateid"
                        placeholder="请选择分类"
                        @change="getGoodslist"
                    >
                        <el-option
                            v-for="item in secondCateid"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品">
                    <el-select v-model="ruleForm.goodsid" placeholder="请选择分类">
                        <el-option
                            v-for="item in goodslist"
                            :key="item.id"
                            :label="item.goodsname"
                            :value="item.id"
                        ></el-option>
                    </el-select>
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

            // 渲染
            secklist: [],

            //一级分类
            firstCateid: [],
            //二级分类
            secondCateid: [],
            //商品分类
            goodslist: [],

            //提交的表单
            ruleForm: {
                title: "", // 限时秒杀名称
                begintime: "", //开始时间
                endtime: "", //结束时间
                first_cateid: "", //商品一级分类编号
                second_cateid: "", //商品二级分类编号
                goodsid: "", //商品编号
                status: 1, //状态1正常2禁用
            },
            status: true,
            timeValue: [],
        };
    },
    mounted() {
        this.getSecklist();
        this.getCateid(0);
    },

    methods: {
        //获取渲染数据
        getSecklist() {
            this.$http.get("/api/secklist").then((res) => {
                if (res.code == 200) {
                    this.secklist = res.list || [];
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
                title: "", // 限时秒杀名称
                begintime: "", //开始时间
                endtime: "", //结束时间
                first_cateid: "", //商品一级分类编号
                second_cateid: "", //商品二级分类编号
                goodsid: "", //商品编号
                status: 1, //状态1正常2禁用
            };
            this.timeValue = [];
        },

        timeEv(e) {
            this.ruleForm.begintime = e[0].toString();
            this.ruleForm.endtime = e[1].toString();
        },

        //所有分类 树状结构
        // pid 上级菜单pid
        getCateid(pid) {
            ///api/catelist?istree=1 树状结构
            ///api/catelist?pid=0 一级分类
            // this.ruleForm.second_cateid = ""; //清除二级分类的input框
            this.$http.get("/api/catelist?pid=" + pid).then((res) => {
                if (res.code == 200) {
                    if (pid == 0) {
                        //当是0就是一级分类
                        // console.log(res, 11);
                        this.firstCateid = res.list || [];
                        // this.getCateid()
                    } else {
                        // 否则是二级分类
                        // console.log(1111);
                        this.secondCateid = res.list || [];
                        // this.getGoodslist();
                    }
                } else {
                    this.$message({
                        type: "warn",
                        message: res.msg,
                    });
                }
            });
        },

        // 商品列表/渲染
        getGoodslist() {
            this.$http
                .get("/api/goodslist", {
                    params: {
                        fid: this.ruleForm.first_cateid,
                        sid: this.ruleForm.second_cateid,
                    },
                })
                .then((res) => {
                    if (res.code == 200) {
                        // console.log(res);
                        this.goodslist = res.list || [];
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

        //添加
        handleAdd() {
            // this.tip = "添加";
            this.dialogFormVisible = true;
        },

        //删除
        handleDelete(row) {
            this.$http.post("/api/seckdelete", { id: row.id }).then((res) => {
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    //获取活动列表/渲染
                    this.getSecklist();
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
            this.$http
                .get("/api/seckinfo", {
                    params: {
                        id: row.id,
                    },
                })
                .then((res) => {
                    let info = res.list;
                    info.id = row.id;
                    this.ruleForm = info;

                    this.getCateid(info.first_cateid);
                    this.getGoodslist();

                    this.timeValue.push(info.begintime);
                    this.timeValue.push(info.endtime);
                });

            this.dialogFormVisible = true;
        },

        //提交
        handleSubmit() {
            this.dialogFormVisible = false;
            let url = this.ruleForm.id ? "/api/seckedit" : "/api/seckadd";

            console.log(this.ruleForm);
            this.$http.post(url, this.ruleForm).then((res) => {
                // 向后台提交数据
                console.log(res);
                if (res.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    //获取活动列表/渲染
                    this.getSecklist();
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