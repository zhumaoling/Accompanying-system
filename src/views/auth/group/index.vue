<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { UserGetmenu, UserSetmenu, MenuList } from '../../../api';
import PanelHead from '../../../components/PanelHead.vue';
import { Plus, } from '@element-plus/icons-vue'

const route = useRoute()

// 控制弹窗
const dialogVisible = ref(false)
const beforeClose = () => {
  dialogVisible.value = false
  // 重置表单
  formRef.value.resetFields()
  // tree选择重置
  treeRef.value.setCheckedKeys(defaultKeys)
}

// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})

// 打开弹窗
const open = (rouwData = {}) => {
  dialogVisible.value = true
  nextTick(() => {
    if (rouwData) {
      Object.assign(form, { id: rouwData.id, name: rouwData.name })
      treeRef.value.setCheckedKeys(rouwData.permission)
    }
  })
}

const form = reactive({
  name: '',
  permissions: '',
  id: ''
})

// 树形菜单权限数据
const permissionsData = ref([])

onMounted(() => {
  UserGetmenu().then(({ data }) => {
    console.log('hahaha');

    console.log(data);
    permissionsData.value = data.data
  })
  getListData()
})

const pagination = reactive({
  pageNum: 1,
  pageSize: 10
})

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

// 请求列表数据
const getListData = () => {
  MenuList(pagination).then(({ data }) => {
    console.log(data);
    const { list, total } = data.data
    tableData.list = list
    tableData.total = total
  })
}

// 默认选中
const defaultKeys = [4, 5]

const treeRef = ref()
const formRef = ref()

const rules = reactive({
  name: [{ required: true, trigger: 'blur', message: '请输入权限名称' }]
})
// 表单提交
const Confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      UserSetmenu({ name: form.name, permissions, id: form.id }).then(({ data }) => {
        console.log(data);
        beforeClose()
        getListData()
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>



<template>
  <div>
    <PanelHead :route="route"></PanelHead>
    <div class="btns">
      <el-button :icon="Plus" type="primary" @click="open(null)" size="small">
        新增
      </el-button>
    </div>


    <el-table :data="tableData.list" style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="permissionName" label="菜单权限" width="500" />
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



    <el-dialog v-model="dialogVisible" title="添加权限" width="500" :before-close="beforeClose">
      <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">

        <el-form-item v-show="false" prop="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请填写权限名称" />
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-tree ref="treeRef" style="max-width: 600px" :data="permissionsData" show-checkbox node-key="id"
            :default-checked-keys="defaultKeys" :default-expanded-keys="[2]" />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="Confirm(formRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>

  </div>

</template>



<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>