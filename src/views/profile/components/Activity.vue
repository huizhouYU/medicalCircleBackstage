<template>
  <el-form label-position="right" label-width="80px">

    <el-form-item label="修改密码:">
      <el-input v-model.trim="editForm.newPassword" />
    </el-form-item>
    <el-form-item label="确认密码:">
      <el-input v-model.trim="editForm.againPassword" />
    </el-form-item>
	<el-form-item label="验证码:">
		<div class="code-input">
			<el-input v-model.trim="editForm.code" />
			<el-button @click="getCode">获取短信验证码</el-button>
		</div>

	</el-form-item>
    <el-form-item>
      <el-button type="primary" class="public-el-submit-btn" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          mobile:''
        }
      }
    }
  },
  data(){
    return{
      editForm:{
        newPassword: '',
        againPassword: '',
        code:''
      }
    }
  },
  methods: {
    getCode(){
      alert("获取手机号"+this.user.mobile+"，请求接口")
    },
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>

<style lang="less" >
  .code-input{
    width: 300px;
    display: flex;
    justify-content: flex-start;
     .el-input__inner{
      width: 120px;
    }
  }
</style>
