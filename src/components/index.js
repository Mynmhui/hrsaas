import PageTools from '@/components/PageTools'
import UploadExcle from '@/components/upload-excle'
import UploadImg from '@/components/UploadImg'
const components = [PageTools, UploadExcle, UploadImg]
export default {
    install(Vue) {
    components.forEach((component)=> {
    Vue.component(component.name,component)
    })
    }
}