<template>
<div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置" name="login">

            <!-- 放置表单 -->
            <el-form label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:">
                <el-input 
                v-model="formData.username" 
                style="width:300px" 
                type="username"/>
              </el-form-item>
              <el-form-item label="密码:">
                <el-input 
                v-model="formData.password"
                style="width:300px" 
                type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="peoples">
            <UserInfo></UserInfo>
          </el-tab-pane>
          <el-tab-pane label="岗位信息" name="action"/>
          <JobInfo></JobInfo>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetail, saveUserDetailById } from '@/api/user'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
import Cookies from 'js-cookie'
export default {
  components: {
  UserInfo,
  JobInfo
  },
  data () {
    return {
    formData: {
    username: '',
    password: '',
    },
    activeName: Cookies.get('employeesDetailTab') || 'account'
    }
  },

  created () {
  this.loadUserDetail()
  },

  methods: {
  async loadUserDetail() {
  const res = await getUserDetail(this.$route.params.id)
  this.formData = res
  },
  async onSave() {
  await saveUserDetailById(this.formData)
  this.$message.success('更新成功')
  }
  }
}
</script>

<style scoped lang='less'>

</style>
