// const localData = localStorage.getItem('pz-v3pz')

const state = {
  isCollapse: false,
  SelectMenu: [],
  routerList: [],
  menuActive: '1-1'
}

const mutations = {
  collapsemenu(state) {
    state.isCollapse = !state.isCollapse
  },
  addMenu(state, payload) {
    if (state.SelectMenu.findIndex(item => item.path === payload.path) === -1) {
      state.SelectMenu.push(payload)
    }
  },
  closeMenu(state, payload) {
    // 找到点击的索引值
    const index = state.SelectMenu.findIndex(val => val.name === payload.name)
    // 删除指定数据
    state.SelectMenu.splice(index, 1)
  },
  dynamicMenu(state, payload) {

    // 通过Glob导入文件
    const modules = import.meta.glob('../views/**/**/*.vue')
    function routerSet(router) {
      // 判断没有子菜单，拼接路由数据
      router.forEach(route => {
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`

          // 拿到获取的vue组件
          route.component = modules[url]
        } else {
          routerSet(route.children)
        }
      });

    }
    routerSet(payload)
    state.routerList = payload
  },
  updateMenuActive(state, payload) {

    state.menuActive = payload
  }
}

export default {
  state,
  mutations
}