import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import PanelHead from './components/panelHead.vue'

// 刷新后的动态路由数据
const localData = localStorage.getItem('pz-v3pz')
if (localData) {
  store.commit('dynamicMenu', JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach(item => {
    router.addRoute('main', item)
  })
}

router.beforeEach((to, from) => {
  // to and from are both route objects. must call `next`.
  // 非登陆页面没有token跳转到登录页面
  const token = localStorage.getItem('pz_token')
  if (!token && to.path !== '/login') {
    return '/login'
  } else if (token && to.path === '/login') {
    return '/'
  } else {
    return true
  }
})



const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('PanelHead', PanelHead)

app.use(router)
app.use(store)
app.mount('#app')
