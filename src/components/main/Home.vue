<template>
    <div>
        <h1>首页</h1>

        <div id="main" style="width: 880px;height:520px;"></div>
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