import request from '@/utils/request'

/**
 * 获取组织架构的数据
 * @returns promise
 */
export function getDeptsApi() {
    return request({
    url: '/company/department'
    })
}

/**
 * 删除部门
 * @param {*} id 要删除的id
 * @returns promise
 */
export function delDeptsApi(id) {
    return request({
    url: '/company/department/' + id,
    method: 'DELETE'
    })

}

/**
 * 添加部门
 * @returns promise
 */
export function addDeptApi(data) {
    return request({
    url: '/company/department',
    method: 'POST',
    data
    })
}

/**
 * 根据id获取部门详情
 * @param {String} id 
 * @returns promise
 */
export function getDeptByIdApi(id) {
    return request({
    url: '/company/department/' + id
    })
}

/**
 * 根据id获取部门详情
 * @param {String} id 
 * @returns promise
 */
export function getEditDeptsApi(data) {
    return request({
    url: '/company/department/' + data.id,
    method: 'PUT',
    data
    })
}