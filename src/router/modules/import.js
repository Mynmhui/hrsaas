import Layout from '@/layout'
export default {
  path: '/import',
  component: Layout,
  hidden: true,
    meta: {
  id: 'import'//用来和后端做约定的
  },
  children: [
    {
      path: '',
      component: () => import('@/views/import'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}