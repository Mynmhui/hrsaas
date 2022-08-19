<template>
  <div>
    <el-upload
      action="#"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :http-request="onRequest"
      list-type="picture-card"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :file-list="fileList"
      :limit="1"
      :class="fileList.length ? 'hide' : ''"
      :before-upload="beforeUpload"
      class="custom-upload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="previewImgDialog">
      <img :src="imgUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// id: AKIDqimu8NYtHk8b7e1CJW0YBkJuVG2iKoCT
//key: EMPK8xneht5JVcaSNCwiXTalwCb5obVU
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDqimu8NYtHk8b7e1CJW0YBkJuVG2iKoCT',
  SecretKey: 'EMPK8xneht5JVcaSNCwiXTalwCb5obVU',
})
console.log(cos)
export default {
  name: 'UploadImg',
  data() {
    return {
      fileList: [],

      previewImgDialog: false,
      imgUrl: '',
      loading: false,
    }
  },

  created() {},

  methods: {
    onRequest({ file }) {
      this.loading = true
      cos.putObject(
        {
          Bucket: 'hm-31-1313341645' /* 必须 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          },
        },
        (err, data) => {
          //成功或失败都会进入该函数
          this.loading = false
          console.log(err || data)
          if (err || data.statusCode !== 200) {
            return this.$message.error('亲！上传失败，请重试')
          }
          this.$emit('onSuccess', {
            url: 'https://' + data.Location,
          })
        },
      )
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    onPreview(file) {
      console.log(file)
      this.previewImgDialog = true
      this.imgUrl = file.url
    },
    beforeUpload(file) {
      const type = ['image/jpeg', 'image/png']
      if (!type.includes(file.type)) {
        this.$message.error('请选择' + type.join('·') + '图片')
        return false
      }
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('选择的图片不能超出2MB')
        return false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.hide .el-upload--picture-card {
  display: none;
}

.custom-upload {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
