<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="2">
                <div class="grid-content bg-purple"></div>
            </el-col>
            <el-col :span="10">
                <div class="grid-content bg-purple bjcolor">
                    <el-container>
                        <el-header class="HeaderM">商品总览</el-header>
                        <el-main class="flexS">
                            <div class="fl">
                                <p>100</p>
                                <p>已下架</p>
                            </div>
                            <div class="fl">
                                <p>100</p>
                                <p>已下架</p>
                            </div>
                            <div class="fl">
                                <p>100</p>
                                <p>已下架</p>
                            </div>
                            <div class="fl">
                                <p>100</p>
                                <p>已下架</p>
                            </div>
                        </el-main>
                    </el-container>
                </div>
            </el-col>
            <el-col :span="10">
                <div class="grid-content bg-purple bjcolor">
                    <el-container>
                        <el-header class="HeaderM">用户总览</el-header>
                        <el-main class="flexS">
                            <div class="fl">
                                <p>100</p>
                                <p>已下架</p>
                            </div>
                            <div class="fl">
                                <p>100</p>
                                <p>已下架</p>
                            </div>
                            <div class="fl">
                                <p>100</p>
                                <p>已下架</p>
                            </div>
                            <div class="fl">
                                <p>100</p>
                                <p>已下架</p>
                            </div>
                        </el-main>
                    </el-container>
                </div>
            </el-col>
            <el-col :span="2">
                <div class="grid-content bg-purple"></div>
            </el-col>
        </el-row>

        <div class="box-main">
            <div id="main" style="width: 1000px;height:400px;"></div>
        </div>
    </div>
</template>


<script>
import echarts from "echarts";
export default {
    data() {
        return {};
    },
    mounted() {
        let myChart = echarts.init(document.querySelector("#main"));
        let option = {
            tooltip: {
                trigger: "axis",
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                },
            },
            xAxis: {
                boundaryGap: false,
                data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            },
            yAxis: {},
            legend: {
                data: ["近一周订单数量", "近二周订单数量"],
            },
            series: [
                {
                    name: "近一周订单数量",
                    type: "line",
                    data: [23, 20, 36, 15, 10, 20, 24],
                },
                {
                    name: "近二周订单数量",
                    type: "line",
                    data: [19, 34, 25, 34, 22, 12, 18],
                },
            ],
        };
        myChart.setOption(option);
    },
    methods: {},
};
</script>

<style>
.box-main {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
.HeaderM {
    line-height: 60px;
    background: #f2f6fc;
}
.flexS {
    display: flex;
}
.fl {
    flex: 1;
    height: auto;
    text-align: center;
    /* border: 1px solid red; */
}

.bg-purple {
    border: 1px solid transparent;
}
.bjcolor {
    height: 200px;
    border: 1px solid #000;
}
/* .home-bj {
    margin: 0;
    background: #e5e5e5;
} */
</style>