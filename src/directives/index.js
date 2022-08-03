// 定义自定义指令
export const imgError = {
    // 会在当前指令作用的dom元素 插入之后执行
   inserted: function (el, { value }) {
    el.onerror = function () {
    el.src = value
    }
}
}