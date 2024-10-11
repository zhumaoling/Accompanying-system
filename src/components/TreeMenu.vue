<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps(['MenuData', 'index'])
const store = useStore()

const router = useRouter()
const handleClick = (item, active) => {
  store.commit('addMenu', item.meta)
  store.commit('updateMenuActive', active)
  router.push(item.meta.path)
}

</script>



<template>

  <template v-for="(item, index) in props.MenuData">
    <el-menu-item @click="handleClick(item, `${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length == 0" :index="`${props.index}-${item.meta.id}`"
      :key="`${props.index}-${item.meta.id}`">
      <el-icon size="20">
        <!-- <setting /> -->
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item>

    <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>

      <TreeMenu :index="`${props.index}-${item.meta.id}`" :MenuData="item.children"></TreeMenu>

    </el-sub-menu>
  </template>

</template>



<style></style>