<template>
  <el-dialog @close="onClose" :title="babeq" :visible="visible" width="50%">
    <el-form ref="form" :model="form" :rules="Rules" label-width="100px">
      <el-form-item label="部门名称" prop="name">
        <el-input placeholder="请输入部门名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input placeholder="请输入部门编码" v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          placeholder="请选择活动区域"
          v-model="form.manager"
          style="width: 100%"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          type="textarea"
          placeholder="输入部门介绍"
          v-model="form.introduce"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button @click="onSave" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDeptsApi, addDeptApi, getDeptByIdApi, getEditDeptsApi } from '@/api/departments'
import { getEmployeesApi } from '@/api/employees'
export default {
  data() {
    const checkDeptName = async (rule, value, callback) => {
      if (this.form.id) {
        const { depts } = await getDeptsApi()
        const filtersDepts = depts.filter(
          (item) => item.pid === this.form.pid && item.id !== this.form.id,
        )
        const isRepeat = filtersDepts.some((item) => item.name === value)
        isRepeat ? callback(new Error('部门重复')) : callback
      } else {
        if (!this.currentNode.children) return callback()
        const isRepeat = this.currentNode.children.some(
          (item) => item.name === value,
        )
        isRepeat ? callback(new Error('部门重复')) : callback
      }
    }
    const checkDeptCode = async (rule, value, callback) => {
      const { depts } = await getDeptsApi()
      let isRepeat
      if (this.form.id) {
        isRepeat = depts
          .filter((item) => item.id !== this.form.id)
          .some((item) => item.code === value)
      } else {
        isRepeat = depts.some((item) => item.code === value)
      }
      isRepeat ? callback(new Error('部门编码重复')) : callback
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: '',
        pid: '',
      },
      Rules: {
        name: [
          { required: true, message: '请输入部门名称', trigget: 'blur' },
          { validator: checkDeptName, trigget: 'blur' },
        ],
        code: [
          { required: true, message: '请输入部门编码', trigget: 'blur' },
          { validator: checkDeptCode, trigget: 'blur' },
        ],
        manager: [
          { required: true, message: '请输入部门负责人', trigget: 'change' },
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigget: 'blur' },
        ],
      },
      peoples: [],
    }
  },

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    currentNode: {
      type: Object,
      required: true,
    },
  },

  created() {
    this.getEmployeeSimple()
  },

  computed: {
    babeq() {
      return this.form.id ? '编辑部门' : '添加部门'
    },
  },

  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeesApi()
    },
    onClose() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: '',
      }
    },
    //点击确定
    async onSave() {
      await this.$refs.form.validate()
      try {
        if (this.form.id) {
        //发送编辑的请求
          await getEditDeptsApi(this.form)
          this.$message.success('编辑成功')
          this.onClose()
          this.$emit('add-success')
        } else {
        //发送添加的请求
          this.form.pid = this.currentNode.id
          await addDeptApi(this.form)
          this.$message.success('新增部门成功')
          this.onClose()
          this.$emit('add-success')
        }
      } catch (error) {
        this.$message.error('新增部门失败')
      }
    },
    async getDeptById(id) {
      this.form = await getDeptByIdApi(id)
    },
  },
}
</script>

<style scoped lang="less"></style>
