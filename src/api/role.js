import request from '@/utils/request'

export function getRolesApi(params) {
    return request({
    url: '/sys/role',
    params
    })
}

export function addRoleApi(data) {
    return request({
    
    url: '/sys/role',
    method: 'POST',
    data
})
}

/** **
 *  删除角色
 *
 * ****/
export function deleteRoleApi(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}