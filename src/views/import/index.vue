<template>
  <div class="dashboard-container">
    <div class="app-container">
      <UploadExcle
        :beforeUpload="excelSuccess"
        :onSuccess="onSuccess"
      ></UploadExcle>
    </div>
  </div>
</template>

<script>
import employees from '@/constant/employees'
import { formatTime } from '@/filter/index.js'
import { importEmployees } from '@/api/employees'
const { importmapKeyPath } = employees
export default {
  data() {
    return {}
  },

  created() {},

  methods: {
    excelSuccess({ name }) {
      if (!name.endsWith('.xlsx')) {
        this.$message.error('请选择xlse文件')
        return false
      }
      return true
    },
    async onSuccess({ header, results }) {
      const newArr = results.map((item) => {
        const obj = {}
        for (let key in importmapKeyPath) {
          if (key === '入职日期' || key === '转正日期') {
          //excel 时间戳
          const timestamp = item[key]
          // 转换
          const date = new Date((timestamp - 1) * 24 * 3600000)
          date.setFullYear(date.getFullYear() - 70)
          obj[importmapKeyPath[key]] = formatTime(date)
          } else {
          obj[importmapKeyPath[key]] = item[key]
          }
        }
        return obj
      })
      await importEmployees(newArr)
      this.$message.success('导入成功')
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped lang="less"></style>
