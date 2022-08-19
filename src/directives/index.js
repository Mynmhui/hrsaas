// 定义自定义指令
export const imgError = {
    // 会在当前指令作用的dom元素 插入之后执行 ，只会执行一次
    //指令绑定的元素插入到dom的时候，图片数据还没有请求回来
    inserted: function (el, { value }) {
    //监听dom img 图片加载失败的事件
    if (!el.src) {
    el.src = value
    } else {
        el.onerror = function () {
        el.src = value
        }
    }
},
//指令绑定的元素更新时触发
    update(el, { value }) {
    if (!el.src) {
    el.src = value
    }
    }
}