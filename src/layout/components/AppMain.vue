<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        // return this.$route.path
        return this.$route.activeMenuName
      }
    }
  }
</script>

<style lang="scss" scoped>
	//更改滚动条样式
	.app-main::-webkit-scrollbar {
	  width: 4px;
	}
	
	.app-main::-webkit-scrollbar-thumb {
	  border-radius: 10px;
	  box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
	  background: rgba(0, 0, 0, 0.2);
	}
	
	.app-main::-webkit-scrollbar-track {
	  box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
	  border-radius: 10px;
	  background: rgba(0, 0, 0, 0.1);
	}
  .app-main {
    /* 50= navbar  50  */
    // min-height: calc(100vh - 50px);
	height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    // overflow: hidden;
	overflow: auto;
  }
  

  .fixed-header+.app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      /* 84 = navbar + tags-view = 50 + 34 */
      // min-height: calc(100vh - 100px);
	  height: calc(100vh - 100px);
      padding: 20px;        
      background-color: #f5f7fa;
    }

    .fixed-header+.app-main {
      padding-top: 84px;
    }
  }
</style>

<style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
