import { createStore } from 'vuex'
import menu from './menu'
import createPersistedstate from 'vuex-persistedstate'

const store = createStore({
  plugins: [new createPersistedstate({
    key: 'pz-v3pz'
  })],
  modules: {
    menu
  }
})

export default store