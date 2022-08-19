<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <el-button type="primary" @click="adddialogVisible = true"
            >新增角色</el-button
          >
          <!-- 表格 -->
          <el-table border :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="角色" width="180">
            </el-table-column>
            <el-table-column prop="description" label="描述" width="180">
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="{ row }">
                <el-button size="small" type="success" @click="showRigthsDialog">分配权限</el-button>
                <el-button size="small" type="primary">编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteRole(row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            layout="sizes, prev, pager, next"
            :page-sizes="[3, 5, 10, 20]"
            :total="total"
            :page-size="pageSize"
            @current-change="currentChange"
            @size-change="handleSizeChange"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top: 50px">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="formData.companyAddress"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="formData.mailbox"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="formData.remarks"
                type="textarea"
                :rows="3"
                disabled
                style="width: 400px"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加角色对话框 -->
    <el-dialog title="新增角色" :visible.sync="adddialogVisible" width="50%">
      <el-form
        ref="form"
        :model="addRouleForm"
        :rules="addRouleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRouleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRouleForm.region"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClonse">取 消</el-button>
        <el-button type="primary" @click="onAddRule">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 给角色分配权限 -->
    <el-dialog
      title="给角色分配权限"
      :visible.sync="setRightsDialog"
      width="50%"
    >
      <el-tree 
      default-expand-all
      show-checkbox
      node-key
      :data="permissions"
      :default-checked-keys="defaultCheckKeys"
      :props="{ label: 'name' }"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesApi, addRoleApi, deleteRoleApi } from '@/api/role'
import { getCompanyInfoApi } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { transListToTree } from '@/utils'
export default {
  data() {
    return {
      activeName: 'first',
      tableData: [],
      total: 0,
      pageSize: 3,
      page: 1,
      adddialogVisible: false,
      addRouleForm: {
        name: '',  // 部门名称
        region: '',
      },
      addRouleFormRules: {
        name: [{ required: true, message: '请输角色名称', trigget: 'blur' }],
      },
      formData: {},
      setRightsDialog: false,
      permissions: [],  // 权限树形数据
      defaultCheckKeys: ['1', '1063315016368918528'] ,  //分配权限选中项
    }
  },

  created() {
    this.getRoles(), 
    this.getCompanyInfo(),
    this.getPermissionList()
  },

  methods: {
    async getRoles() {
      const { rows, total } = await getRolesApi({
        page: this.page,
        pagesize: this.pageSize,
      })
      ;(this.tableData = rows), (this.total = total)
    },
    currentChange(val) {
      this.page = val
      this.getRoles()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getRoles()
    },
    onClonse() {
      this.adddialogVisible = false
    },
    async onAddRule() {
      await this.$refs.form.validate()
      await addRoleApi(this.addRouleForm)
      this.$message.success('添加成功')
      this.adddialogVisible = false
      this.getRoles()
      this.addRouleForm.name = ''
      this.addRouleForm.region = ''
    },
    async deleteRole(id) {
      //  提示
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定 才能进入到下方
        await deleteRoleApi(id) // 调用删除接口
        this.getRoles() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfoApi(
        this.$store.state.user.userInfo.companyId,
      )
    },
    //点击分配权限显示对话框
    showRigthsDialog() {
    this.setRightsDialog = true
    },
    //获取权限列表
    async getPermissionList() {
    const res = await getPermissionList()
    const treePermission = transListToTree(res, '0')
    console.log(treePermission);
    this.permissions = treePermission
    }
  },
}
</script>

<style scoped lang="less"></style>
