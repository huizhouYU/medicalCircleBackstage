<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <a v-if="collapse" key="collapse" class="sidebar-logo-link" href="http://www.yijiequan.cn" target="_blank">
        <img v-if="logo" src="../../../assets/login_images/logo_img.png" class="sidebar-logo-collapse">
      </a>
      <a v-else key="expand" class="sidebar-logo-link" href="http://www.yijiequan.cn" target="_blank">
        <img v-if="logo" src="../../../assets/login_images/logo.png" class="sidebar-logo">
      </a>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'SidebarLogo',
    props: {
      collapse: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        title: '医界圈',
        // logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
        // logo:'../../../../public/imgs/logo.png',
        logo: '../../../assets/login_images/logo.png'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
  }

  .sidebarLogoFade-enter,
  .sidebarLogoFade-leave-to {
    opacity: 0;
  }

  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 100px;
    line-height: 50px;
    // background: #2b2f3a;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
      height: 100%;
      width: 100%;
      display: flex !important;
      justify-content: center;
      align-items: center;

      & .sidebar-logo {
        width: 125px;
        height: 42px;
        vertical-align: middle;
        margin-right: 12px;
      }

      & .sidebar-logo-collapse {
        width: 50px;
        height: 42px;
        vertical-align: middle;
        margin-right: 12px;
      }

      & .sidebar-title {
        display: inline-block;
        margin: 0;
        color: #fff;
        font-weight: 600;
        line-height: 50px;
        font-size: 14px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }
    }

    &.collapse {
      .sidebar-logo {
        margin-right: 0px;
      }
    }
  }
</style>
