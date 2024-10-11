<script setup>
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import { Clock } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

import { AuthAdmin, MenuSelectlist, UpdateUser } from '../../../api';
import PanelHead from '../../../components/PanelHead.vue';

const pagination = reactive({
  pageNum: 1,
  pageSize: 10
})

const route = useRoute()

// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})

const options = ref([])

onMounted(() => {
  getListData()
  MenuSelectlist().then(({ data }) => {
    console.log(data);
    options.value = data.data
  })
})

// 请求列表数据
const getListData = () => {
  AuthAdmin(pagination).then(({ data }) => {
    const { list, total } = data.data
    list.forEach(item => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })
    tableData.list = list
    tableData.total = total
  }).catch((err) => {
    console.log(err);
  });
}

// 根据权限id匹配权限组别
const permissionName = (id) => {
  const data = options.value.find(el => el.id === id)
  return data ? data.name : '超级管理员'
}

// 分页器使用到的方法
const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  pagination.pageSize = val
  getListData()
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
  pagination.pageNum = val
  getListData()
}

// 弹窗功能
const dialogVisible = ref(false)

const form = reactive({
  name: '',
  permissions_id: '',
})


// 关闭弹窗
const beforeClose = () => {
  dialogVisible.value = false
}

// 点击编辑打开弹窗
const open = (rowData) => {
  dialogVisible.value = true
  Object.assign(form, { mobile: rowData.mobile, name: rowData.name, permissions_id: rowData.permissions_id })
}

const formRef = ref()
// 表单提交
const Confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form
      UpdateUser({ name, permissions_id }).then(({ data }) => {
        if (data.code === 10000) {
          dialogVisible.value = false
          getListData()
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const rules = reactive({
  name: [{ required: true, trigger: 'blur', message: '请输入昵称' }],
  permissions_id: [{ required: true, trigger: 'blur', message: '请选择菜单权限' }]
})


</script>



<template>
  <div>
    <!-- <PanelHead /> -->
    <!-- <PanelHead></PanelHead> -->
    <PanelHead :route="route"></PanelHead>
    <div>
      <!-- <PanelHead></PanelHead> -->
      <!-- <PanelHead /> -->
    </div>
    <div>
      <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="id" />

        <el-table-column prop="name" label="昵称" />

        <el-table-column prop="permissions_id" label="所属组别">
          <template #default="scope">
            {{ permissionName(scope.row.permissions_id) }}
          </template>
        </el-table-column>

        <el-table-column prop="mobile" label="手机号" />

        <el-table-column prop="active" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template #default="scope">
            <div class="flex-box">
              <el-icon>
                <Clock />
              </el-icon>
              <span class="timestyle">{{ scope.row.create_time }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="open(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-info">
        <!-- 分页计数 -->
        <el-pagination v-model:current-page="pagination.pageNum" :page-size="pagination.pageSize" :background="false"
          size="small" layout="total, prev, pager, next" :total="tableData.total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>

      <el-dialog v-model="dialogVisible" title="编辑用户" width="500" :before-close="beforeClose">
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" disabled />
          </el-form-item>

          <el-form-item label="昵称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item label="菜单权限" prop="permissions_id">
            <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px">
              <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>

        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="Confirm(formRef)">确认</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

  </div>
</template>



<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;

  .timestyle {
    margin-left: 10px;
  }
}
</style>