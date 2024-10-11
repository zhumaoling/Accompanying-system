<script setup>

import TreeMenu from './TreeMenu.vue'
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()

const store = useStore()
const isCollapse = computed(() => store.state.menu.isCollapse)
const active = computed(() => store.state.menu.menuActive)

// const MenuData = reactive(router.options.routes[0].children)
const MenuData = computed(() => store.state.menu.routerList)


import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>



<template>
  <div>
    <el-menu :style="{ width: !isCollapse ? '230px' : '64px' }" active-text-color="#ffd04b" background-color="#545c64"
      class="aside-container" :collapse="isCollapse" text-color="#fff" @open="handleOpen" :default-active="active"
      @close="handleClose">
      <p class="logo-name">{{ isCollapse ? 'CARE' : 'CARE陪诊' }}</p>
      <TreeMenu :index="1" :MenuData=MenuData></TreeMenu>
    </el-menu>
  </div>
</template>



<style lang="less" scoped>
.aside-container {
  height: 100%;

  .logo-name {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>