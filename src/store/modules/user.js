import {
  login,
  msgLogin,
  logout,
  register,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'
import { Message } from 'element-ui'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  regUrl:'',
  mobile:'',
  balance:'',
  roles: [],
  store:''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_MOBILE: (state, mobile) => {
    state.mobile = mobile
  },
  SET_BALANCE: (state, balance) => {
    state.balance = balance
  },
  SET_REGURL: (state, regUrl) => {
    state.regUrl = regUrl
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_STORE: (state, store) => {
    state.store = store
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        // console.log("sdresponse：",response)
        const {
          data,code,message
        } = response.data
        if(code == 10000){
          commit('SET_TOKEN', data)
          setToken(data)
        }else{
          console.log(message)
          // Message.error({ message })
        }
        resolve(response.data)
      }).catch(error => {
        console.log("登录失败：",error)
        reject(error)
      })
    })
  },
  // user msgLogin
  msgLogin({ commit }, userInfo) {
    const {
      mobile,
      captcha
    } = userInfo
    return new Promise((resolve, reject) => {
      msgLogin({
        mobile: mobile.trim(),
        captcha: captcha.trim()
      }).then(response => {
        console.log("store中sdresponse：",response)
        const {
          data,code,message
        } = response.data
        if(code == 10000){
          commit('SET_TOKEN', data)
          setToken(data)
        }else{
          console.log(message)
          // Message.error({ message })
        }
        resolve(response.data)
      }).catch(error => {
        console.log("登录失败：",error)
        reject(error)
      })
    })
  },

  register({ commit }, registerInfo) {
    const {
      mobile,
      captcha,
      activation
    } = registerInfo
    console.log("store中注册")
    console.log("activation:",activation)
    return new Promise((resolve, reject) => {
      register({
        mobile: mobile.trim(),
        captcha: captcha.trim(),
        activation: activation!=null?activation.trim():''
      }).then(response => {
        console.log("注册接口返回：",response)
        console.log("将返回的token保存到store中")
        const {
          data
        } = response.data
        if(data != null){
          console.log("setToken:",data)
          commit('SET_TOKEN', data)
          setToken(data)
        }

        resolve(response.data)
      }).catch(error => {
        console.log("注册接口返回失败：",error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {  data } = response.data
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // const { roles, name, avatar, introduction } = data
        const {
          store,
          user
        } = data
        const roles = ["admin"]
        // roles.push(store.stype)
        // roles = ["admin"]

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', user.username)
        commit('SET_AVATAR', "")
        commit('SET_INTRODUCTION', "固定无")
        commit('SET_REGURL', user.regUrl)
        commit('SET_MOBILE',user.mobile)
        commit('SET_BALANCE',user.balance)
        commit('SET_STORE',store)
        // commit('SET_ROLES', roles)
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, {
        root: true
      })
      resolve()
      
      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   commit('SET_ROLES', [])
      //   removeToken()
      //   resetRouter()

      //   // reset visited views and cached views
      //   // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      //   dispatch('tagsView/delAllViews', null, {
      //     root: true
      //   })

      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({
    commit,
    dispatch
  }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const {
      roles
    } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {
      root: true
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
