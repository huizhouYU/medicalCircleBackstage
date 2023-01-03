<template>
  <el-card style="margin-bottom:20px;height:100%;">
    <div slot="header" class="clearfix">
      <span>个人中心</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <!-- <div>Hello</div> -->
          <template v-if="user.role == 'personal'">个人工程师</template>
          <template v-else-if="user.role == 'company'">企业</template>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">
          <template v-if="user.role == 'personal'">个人工程师</template>
          <template v-else-if="user.role == 'company'">企业</template>
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education" /><span>信息</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            手机号：{{user.mobile}}
          </div>
          <div class="text-muted">
            邮箱：{{user.email}}
          </div>
        </div>
      </div>

      <!-- <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Skills</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div> -->
    </div>
  </el-card>
</template>

<script>
  import PanThumb from '@/components/PanThumb'

  export default {
    components: {
      PanThumb
    },
    props: {
      user: {
        type: Object,
        default: () => {
          return {
            name: '',
            email: '',
            avatar: '',
            role: '',
            mobile: ''
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  span {
    font-size: 14px;
  }

  .box-center {
    margin: 0 auto;
    display: table;
  }

  .text-muted {
    color: #777;
    font-size: 12px;
    margin: 10px 0;
  }

  .user-profile {
    .user-name {
      font-weight: bold;
    }

    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .user-follow {
      padding-top: 20px;
    }
  }

  .user-bio {
    margin-top: 20px;
    color: #606266;

    span {
      padding-left: 4px;
    }

    .user-bio-section {
      font-size: 14px;
      padding: 15px 0;

      .user-bio-section-header {
        border-bottom: 1px solid #dfe6ec;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: bold;
      }
    }
  }
</style>
