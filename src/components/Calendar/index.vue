<template>
  <div class="calender">
    <el-row type="flex" justify="end">
      <el-col :span="5">
        <el-select @change="updateCalendar" v-model="currentYear">
          <el-option
            v-for="item in years"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select @change="updateCalendar" v-model="currentMonth">
          <el-option v-for="item in 12" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date }">
        <div class="cell-box">
          {{ date.getDate() }}
          <span v-if="isWeek(date)">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      currentYear: '',
      currentMonth: '',
      currentDate: '',
      years: [], //当前年份 + 前5年 + 后5年
    }
  },

  created() {
    this.initCaldndar()
  },

  methods: {
    //渲染数据
    initCaldndar() {
      const date = new Date()
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1
      this.currentDate = date
      this.years = Array(11)
        .fill(this.currentYear - 5)
        .map((item, i) => item + i)
    },
    //判断是否是休息日
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    },
    //用于切换日历
    updateCalendar() {
      this.currentDate = this.currentYear + '-' + this.currentMonth
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-calendar {
  .el-calendar__header {
    display: none;
  }
  .el-calendar-table td {
    border: none !important;
  }
  .cell-box {
    color: #d0273e;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
