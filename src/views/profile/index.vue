<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24" style="height: 100%;">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="账号信息" name="account">
                <account :user="user" />
              </el-tab-pane>
             <!-- <el-tab-pane label="信息通知" name="timeline">
                <timeline />
              </el-tab-pane> -->
              <el-tab-pane label="修改密码" name="activity">
                <activity :user="user"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import UserCard from './components/UserCard'
  import Activity from './components/Activity'
  import Timeline from './components/Timeline'
  import Account from './components/Account'

  export default {
    name: 'Profile',
    components: {
      UserCard,
      Activity,
      Timeline,
      Account
    },
    data() {
      return {
        user: {},
        activeTab: 'account'
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'roles',
        'mobile',
        'email'
      ])
    },
    created() {
      this.getUser()
    },
    methods: {
      getUser() {
        this.user = {
          name: this.name,
          role: this.roles.join(' | '),
          email: this.email,
          avatar: this.avatar,
          mobile: this.mobile
        }
      }
    }
  }
</script>
<style>
  .app-container{
    height: 500px;
  }
</style>
