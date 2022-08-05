<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部 -->
        <TreeTools :isRoot="true" :treeNode="company"/>
        <!-- 树形 -->
        <el-tree
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        >
        <template v-slot="{ data }">
          <TreeTools :treeNode="data"/>
        </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDeptsApi } from '@/api/departments'
import { transListToTree } from '@/utils'
export default {
data() {
return {
    defaultProps: { label: 'name' },
    company:{
    name:'传智教育', manager:'负责人' 
    },
    treeData: [
      { name: '总裁办', children: [{ name: '董事会' }] },
    { name: '行政部' },
      { name: '人事部' },
    ],
}
  },

  components: {
    TreeTools
  },

  created() {
  this.loadDepts()
  },

  methods: {
  async loadDepts() {
  const res = await getDeptsApi()
  this.treeData = transListToTree(res.depts, '') 
  }
  }
}
</script>

<style scoped lang="less"></style>
