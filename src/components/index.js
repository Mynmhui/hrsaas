import PageTools from '@/components/PageTools'
import UploadExcle from '@/components/upload-excle'
const components = [PageTools, UploadExcle]
export default {
    install(Vue) {
    components.forEach((component)=> {
    Vue.component(component.name,component)
    })
    }
}