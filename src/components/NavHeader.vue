<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()

// 当前路由对象，拿到路由信息
const route = useRoute()

const SelectMenu = computed(() => store.state.menu.SelectMenu)

const closeTab = (item, index) => {
  store.commit('closeMenu', item)
  // 进行逻辑判断
  // 删除非当前页面
  if (route.path !== item.path) {
    return
  }
  const selectMenuData = SelectMenu.value
  // 删除的是最后一页
  if (index === selectMenuData.length) {
    // tag标签只有一个
    if (!selectMenuData.length) {
      router.push('/')
    } else {
      router.push({
        path: selectMenuData[index - 1].path
      })
    }
  } else {
    router.push({
      path: selectMenuData[index].path
    })
  }
}

// 退出功能
const handleClick = (command) => {
  if (command === 'cancel') {
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz-userInfo')
    localStorage.removeItem('pz-v3pz')
    window.location.href = window.location.origin
  }
}
// 用户数据
const useInfo = JSON.parse(localStorage.getItem('pz-userInfo'))
console.log(useInfo);

</script>



<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapsemenu')">
        <Fold />
      </el-icon>

      <ul class="flex-box">
        <li v-for="(item, index) in SelectMenu" :key="item.path" :class="{ selected: route.path === item.path }"
          class="tab flex-box">
          <el-icon size="12">
            <component :is="item.icon"></component>
          </el-icon>

          <router-link class="text flex-box" :to="{ path: item.path }">{{ item.name }}</router-link>

          <el-icon class="close" size="12" @click="closeTab(item, index)">

            <Close />

          </el-icon>
        </li>
      </ul>

    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar :src="useInfo.avatar" />
          <p class="user-name">{{ useInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>

          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>



<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;

  .header-left {
    height: 100%;

    .icon {
      width: 45px;
      height: 100%;
    }

    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }

    .tab {
      padding: 0 10px;
      height: 100%;

      .text {
        margin: 0 5px;
      }

      .close {
        visibility: hidden;
      }

      &.selected {
        a {
          color: #409eff;
        }

        i {
          color: #409eff;
        }

        background-color: #f5f5f5;
      }
    }

    .tab:hover {
      background-color: #f5f5f5;
      cursor: pointer;

      .close {
        visibility: inherit;
        color: #000;

      }
    }
  }

  .header-right {
    .user-name {
      margin-left: 10px;
    }
  }

  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>