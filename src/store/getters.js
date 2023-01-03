const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  regUrl: state => state.user.regUrl,
  balance: state => state.user.balance,
  mobile: state => state.user.mobile,
  realName: state => state.user.realName,
  roles: state => state.user.roles,
  store: state => state.user.store,
  email: state => state.user.email,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
