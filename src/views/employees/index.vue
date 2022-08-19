<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <span slot="left-tag">共166条记录</span>
        <template slot="right">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportExcel"
            >导出</el-button
          >
          <el-button size="small" type="primary" @click="showAdd"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="employees">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="员工">
            <template slot-scope="{ row }">
              <img
                v-imgError="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                alt=""
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                @click="showErCodeDialog(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatFormOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="departmentName">
            <!-- 为什么要在这个位置使用过滤器，因为格式化时间不止局限于表格，此时就要注册一个全局过滤器 -->
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push('/employees/detail/' + row.id)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="showAssignDialog(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="onRemove(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :page-size="pages.size"
            :total="total"
            @current-change="currentChange"
          />
        </el-row>
      </el-card>
    </div>
    <AddEmployees
      @add-success="getEmployeesList"
      :visible.sync="showAddEmployees"
    ></AddEmployees>
    <!-- 头像二维码 -->
    <el-dialog title="头像二维码" :visible.sync="ercodeDialog">
      <canvas id="canvas"></canvas>
    </el-dialog>

    <!-- 角色弹层 -->
    <AssignRole :employeesId="currentEmployeesId" :visible.sync="showAssignRole"></AssignRole>
  </div>
</template>

<script>
import { getEmployeesInfoApi, delEmployee } from '@/api/employees'
import employees from '@/constant/employees.js'
import AddEmployees from './components/add-employees.vue'
import AssignRole from './components/assign-role.vue'
import QRcode from 'qrcode'
const { hireType, exportExcelMapPath } = employees
export default {
  name: 'Employees',
  components: {
    AddEmployees,
    AssignRole
  },
  data() {
    return {
      employees: [],
      total: 0,
      pages: {
        page: 1,
        size: 5,
      },
      showAddEmployees: false,
      ercodeDialog: false,
      showAssignRole: false,
      currentEmployeesId: ''
    }
  },

  created() {
    this.getEmployeesList()
  },

  methods: {
    async getEmployeesList() {
      const { rows, total } = await getEmployeesInfoApi(this.pages)
      this.employees = rows
      // console.log(this.employees)
      this.total = total
    },
    currentChange(val) {
      this.pages.page = val
      this.getEmployeesList()
    },
    formatFormOfEmployment(row, column, cellValue, index) {
      const findItem = employees.hireType.find((item) => item.id === cellValue)
      return findItem ? findItem.value : '未知'
    },
    async onRemove(id) {
      await this.$confirm('是否删除该员工')
      await delEmployee(id)
      this.$message.success('删除成功')
      this.getEmployeesList()
    },
    showAdd() {
      this.showAddEmployees = true
    },
    async exportExcel() {
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      const { rows } = await getEmployeesInfoApi({
        page: 1,
        size: this.total,
      })
      //表头数据['手机号'，‘姓名’，...]
      const header = Object.keys(exportExcelMapPath)
      // data数据
      const data = rows.map((item) => {
        return header.map((h) => {
        if (h === '聘用形式') {
        const findItem = hireType.find((hire) => {
          return hire.id === item[exportExcelMapPath[h]]
        })
        return findItem ? findItem.value : '未知'
        } else {
        return item[exportExcelMapPath[h]]
        }
        })
      })
      console.log(data)
      export_json_to_excel({
        header, // 表头
        data, //具体数据
        filename: '员工列表',
        autoWidth: true,
        bookType: 'xlsx',
        //复杂表头
        // multiHeader: [[]],  表头
        // merges: []， 合并
      })
    },
    showErCodeDialog(staffPhoto) {
    if (!staffPhoto) return this.$message.error('该用户还没有设置头像')
    this.ercodeDialog = true
    this.$nextTick(() => {
    const canvas = document.getElementById('canvas')
    QRcode.toCanvas(canvas, staffPhoto)
    })
    },
    //点击橘色显示角色弹层
    showAssignDialog(id) {
    this.showAssignRole = true
    this.currentEmployeesId = id
    }
  },
}
</script>

<style scoped lang="less"></style>
