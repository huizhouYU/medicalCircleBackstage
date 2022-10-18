<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link v-for="tag in visitedViews" ref="tag" :key="tag.path" :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" tag="span" class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        {{ tag.title }}
        <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
  import ScrollPane from './ScrollPane'
  import path from 'path'

  export default {
    components: {
      ScrollPane
    },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        affixTags: []
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      },
      routes() {
        return this.$store.state.permission.routes
      }
    },
    watch: {
      $route() {
        this.addTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.initTags()
      this.addTags()
    },
    methods: {
      isActive(route) {
        let path = this.$route.path
        // console.log("呼呼：",this.$route)
        if(this.$route.meta.showZj != undefined){
          if(!this.$route.meta.showZj){
            console.log("sdffsd")
            console.log(route.path)
            path = '/invitationList'
          }
        }
        return route.path === path
      },
      isAffix(tag) {
        return tag.meta && tag.meta.affix
      },
      filterAffixTags(routes, basePath = '/') {
        let tags = []
        routes.forEach(route => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path)
            tags.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: {
                ...route.meta
              }
            })
          }
          if (route.children) {
            const tempTags = this.filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags]
            }
          }
        })
        return tags
      },
      initTags() {
        const affixTags = this.affixTags = this.filterAffixTags(this.routes)
        for (const tag of affixTags) {
          // Must have tag name
          if (tag.name) {
            this.$store.dispatch('tagsView/addVisitedView', tag)
          }
        }
      },
      addTags() {
        const {
          name,meta
        } = this.$route
        if(meta.showZj != undefined){
          if(!meta.showZj) return
        }
        if (name) {
          this.$store.dispatch('tagsView/addView', this.$route)
        }
        return false
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag)
              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('tagsView/updateVisitedView', this.$route)
              }
              break
            }
          }
        })
      },
      refreshSelectedTag(view) {
        this.$store.dispatch('tagsView/delCachedView', view).then(() => {
          const {
            fullPath
          } = view
          this.$nextTick(() => {
            this.$router.replace({
              // path: '/redirect' + fullPath
              path: fullPath
            })
          })
        })
      },
      closeSelectedTag(view) {
        this.$store.dispatch('tagsView/delView', view).then(({
          visitedViews
        }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view)
          }
        })
      },
      closeOthersTags() {
        this.$router.push(this.selectedTag)
        this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags(view) {
        this.$store.dispatch('tagsView/delAllViews').then(({
          visitedViews
        }) => {
     //      if (this.affixTags.some(tag => tag.path === view.path)) {
     //        return
     //      }
          this.toLastView(visitedViews, view)
        })
      },
      toLastView(visitedViews, view) {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView) {
          this.$router.push(latestView.fullPath)
        } else {
          // now the default is to redirect to the home page if there is no tags-view,
          // you can adjust it according to your needs.
          if (view.name === 'Dashboard') {
            // to reload home page
            this.$router.replace({
              path: '/redirect' + view.fullPath
            })
          } else {
            this.$router.push('/')
          }
        }
      },
      openMenu(tag, e) {
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 15 // 15: margin right

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }

        this.top = e.clientY
        this.visible = true
        this.selectedTag = tag
      },
      closeMenu() {
        this.visible = false
      },
      handleScroll() {
        this.closeMenu()
      }
    }
  }
</script>

<style lang="scss" scoped>
  //更改每个模块滚动条样式
  // .tags-view-wrapper::-webkit-scrollbar {
  //   width: 2px;
  // }

  // .tags-view-wrapper::-webkit-scrollbar-thumb {
  //   border-radius: 10px;
  //   box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
  //   background: rgba(0, 0, 0, 0.2);
  // }

  // .tags-view-wrapper::-webkit-scrollbar-track {
  //   box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
  //   border-radius: 0;
  //   background: rgba(0, 0, 0, 0);
  // }
  .scroll-container {
    height: 50px;
  }

  // .scroll-container[data-v-be6b7bae] .el-scrollbar__wrap

  .tags-view-container {
    height: 49px;
    width: 100%;
    background: #fff;
    // border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 34px;
        line-height: 36px;
        // border-radius: 4px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        // border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0px 10px 0 10px;
        font-size: 12px;
        margin: 15px 0px 5px 5px;

        &:first-of-type {
          margin-left: 15px;
        }

        &:last-of-type {
          margin-right: 15px;
        }

        &:hover {
          background-color: #bbb;
          color: #fff;
        }

        &.active {
          // -webkit-transition: padding 1.2s linear;
          // transition: all .3s cubic-bezier(.645,.045,.355,1),border 0s,color .1s,font-size 0s;
          // transition: padding .3s cubic-bezier(.645,.045,.355,1)  0s;
          transition: padding 0.3s linear  0s;
          // animation: move 1s linear 0s forwards;
          background-color: #e8f4ff;
          color: #1890ff;
          padding: 0px 30px 0 30px;
          border-bottom: 1px solid #e8f4ff;
          // z-index: 1px;

          // border-color: #42b983;
          &::before {
            content: '';
            background: transparent;
            position: absolute;
            left: -10px;
            bottom: 0px;
            width: 10px;
            height: 10px;
             /* border-radius: 50%; */
             /* border-bottom-left-radius: 50%; */
             /* border-top-left-radius: 50%; */
             /* border-top-right-radius: 50%; */
             border-bottom-right-radius: 50%;
             box-shadow: 10px 10px 0 10px #e8f4ff;
          }

          &::after {
            content: '';
            background: transparent;
            position: absolute;
            right: -10px;
            bottom: 0px;
            width: 10px;
            height: 10px;
             /* border-radius: 50%; */
             /* border-bottom-left-radius: 50%; */
             /* border-top-left-radius: 50%; */
              border-bottom-left-radius: 50%;
             // border-bottom-right-radius: 50%;
             box-shadow: -10px 10px 0 10px #e8f4ff;
          }
        }
      }
    }

    @-webkit-keyframes move {
      0% {
        border-width: 0px;
      }
      100% {
        border-bottom: 1px solid #1890ff;
      }
      // 100% {
      //   border-width: 100%;
      // }
    }

    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        transform-origin: 100% 50%;

        &:before {
          transform: scale(.6);
          display: inline-block;
          vertical-align: -3px;
        }

        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
</style>
