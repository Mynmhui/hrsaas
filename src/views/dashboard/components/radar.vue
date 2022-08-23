<template>
  <div class="radarCharts" ref="main">雷达图</div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {}
  },

  mounted() {
    this.initRadar()
  },

  created() {},

  methods: {
    initRadar() {
      var myChart = echarts.init(this.$refs.main)
      const radarOptions = {
        backgroundColor: '#bedeed',
        title: {
          text: '人员绩效表',
          textStyle: {
            color: '#355389',
            fontSize: '20px',
          },
        },
        legend: {
          data: ['张三', '李四'],
          textStyle: {
            color: '#3f689e',
            fontSize: '20px',
          },
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '工作效率', max: 100 },
            { name: '考勤', max: 100 },
            { name: '积极性', max: 100 },
            { name: '帮助同事', max: 100 },
            { name: '自主学习', max: 100 },
            { name: '正确率', max: 100 },
          ],
          splitLine: {
            lineStyle: {
              color: ['#529a82', '#a9d5c6'],
            },
          },
          splitArea: {
            areaStyle: {
              color: ['#507564', '#355389'],
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowBlur: 10,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#bcdceb',
            },
          },
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [20, 30, 20, 30, 50, 100],
                name: '张三',
              },
              {
                value: [50, 14, 28, 26, 42, 100],
                name: '李四',
              },
            ],
          },
        ],
      }
      //绘制图表
      myChart.setOption(radarOptions)
    },
  },
}
</script>

<style scoped lang="scss">
.radarCharts {
  width: 760px;
  height: 500px;
}
</style>
