import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration
//白名单
// const whiteList = ['/login', '/register','/auth-redirect'] // no redirect whitelist
const whiteList = ['/login', '/register'] // no redirect whitelist


router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  //从Cookies中获取token
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login' || to.path === '/register') {
      // if is logged in, redirect to the home page
      next({
        path: '/'
      })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // next()
        //如果是店铺未认证，选择其他功能菜单时默认跳转到店铺认证页面让其进行认证
        // console.log(store.getters.store)
        if (store.getters.store) {
          
          if (to.path !== '/shop/storeAuthentication' && store.getters.store.state !== 1) {
            var str = "请先等待店铺认证审核！"
            if(store.getters.store.state ===3){
              str = "审核认证失败，请重新提交认证信息！"
            }
            Message.warning(str)
            next({
              path: '/shop/storeAuthentication'
            })
            NProgress.done()
          }else{
            next()
          }
        } else {
          Message.warning('请先进行店铺认证！')
          // console.log("应该跳转到店铺认证页面")
          // console.log("to.path:", to.path)
          // this.$router.push('/shop/storeAuthentication')
          next({
            path: '/shop/storeAuthentication'
          })
          NProgress.done()
        }

      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const {
            roles
          } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({
            ...to,
            replace: true
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          Message.error({
            message: error || 'Has Error'
          })
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
