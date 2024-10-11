<script setup>
import AsideBar from '../components/AsideBar.vue'
import NavHeader from '../components/NavHeader.vue';
</script>



<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-aside width="200px">Aside</el-aside> -->
      <AsideBar></AsideBar>
      <el-container>
        <el-header>
          <NavHeader></NavHeader>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>



<style lang="less" scoped>
.common-layout {
  height: 100%;

  .el-container {
    height: 100%;
  }
}
</style>