<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Plus, Clock, InfoFilled, DeleteFilled } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

import { PhotoList, Companion, CompanionList, DeleteCompanion } from '../../../api';
import PanelHead from '../../../components/panelHead.vue'


const route = useRoute()
onMounted(() => {
  PhotoList().then(({ data }) => {
    // console.log(data);
    fileList.value = data.data

  }).catch((err) => {
    console.log(err);

  });
  getListData()
})

// 弹窗功能部分
const dialogVisible = ref(false)
const beforeClose = () => {
  dialogVisible.value = false
  formRef.value.resetFields()
}

// 打开弹窗
const open = (rouwData = {}) => {
  dialogVisible.value = true
  nextTick(() => {
    if (rouwData) {
      Object.assign(form, rouwData)
      // treeRef.value.setCheckedKeys(rouwData.permission)
    }
  })
}

// 头像弹窗
const dialogImgVisible = ref(false)
const fileList = ref([])
const selectIndex = ref(0)

const ConfirmImage = () => [
  form.avatar = fileList.value[selectIndex.value].url,
  dialogImgVisible.value = false
]

// 表单部分
const formRef = ref()
const form = reactive({
  id: '',
  mobile: '',
  active: 1,
  age: 28,
  avatar: '',
  name: '',
  sex: ''
})
const rules = reactive({
  name: [{ required: true, trigger: 'blur', message: '请填写昵称' }],
  avatar: [{ required: true, message: '请选择头像' }],
  sex: [{ required: true, trigger: 'change', message: '请选择性别' }],
  mobile: [{ required: true, trigger: 'change', message: '请填写手机号' }],
})

const Confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      Companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success('创建成功')
          beforeClose()
          getListData()
        } else {
          ElMessage.error(data.message)
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 陪护师列表数据
const pagination = reactive({
  pageNum: 1,
  pageSize: 10
})
// 列表数据
const tableData = reactive({
  list: [],
  total: 0
})
// 请求列表数据
const getListData = () => {
  CompanionList(pagination).then(({ data }) => {
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
const selectTableData = ref([])
const handleSelectionChange = (val) => {
  selectTableData.value = val.map(item => ({ id: item.id }))
}

// 气泡弹窗
const clicked = ref(false)
const ConfirmEvent = () => {
  // clicked.value = true
  if (!selectTableData.value.length) {
    return ElMessage.warning('请选择至少一个删除项！')
  }
  DeleteCompanion({ id: selectTableData.value }).then(({ data }) => {
    if (data.code === 10000) {
      getListData()
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
      <el-popconfirm width="220" :icon="InfoFilled" icon-color="#626AEF" title="是否确认删除？" @confirm="ConfirmEvent">
        <template #reference>
          <el-button type="danger" size="small" :icon="DeleteFilled">删除</el-button>
        </template>
        <template #actions="{ confirm, cancel }">
          <el-button size="small" @click="cancel">否</el-button>
          <el-button type="danger" size="small" @click="confirm">
            是
          </el-button>
        </template>
      </el-popconfirm>
    </div>
    <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" :selectable="selectable" width="55" />
      <el-table-column prop="id" label="id" />

      <el-table-column prop="name" label="昵称" />

      <el-table-column prop="avatar" label="头像">
        <template #default="scope">
          <el-image style="width: 50px; height:50px;" :src="scope.row.avatar" />
        </template>
      </el-table-column>

      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          {{ scope.row.sex === '1' ? '男' : '女' }}
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

    <el-dialog v-model="dialogVisible" title="添加陪护师" width="500" :before-close="beforeClose">
      <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">

        <el-form-item v-show="false" prop="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name" placeholder="请填写昵称" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisible = true">点击上传</el-button>
          <el-image v-else :src="form.avatar" style="width:100px; height:100px;" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="form.age" :min="18" :max="50" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="是否生效" prop="active">
          <el-radio-group v-model="form.active">
            <el-radio :value="0">失效</el-radio>
            <el-radio :value="1">生效</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="Confirm(formRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 头像选择弹窗 -->
    <el-dialog v-model="dialogImgVisible" title="选择头像" width="680" :before-close="beforeClose">
      <div class="image-list">
        <div v-for="(item, index) in fileList" :key="item.name" class="img-box" @click="selectIndex = index">
          <div v-if="selectIndex === index" class="select">
            <el-icon color="#fff">
              <Check />
            </el-icon>
          </div>
          <el-image style="width: 148px; height:148px;" :src="item.url" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogImgVisible = false">取消</el-button>
          <el-button type="primary" @click="ConfirmImage()">确认</el-button>
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

.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .img-box {
    position: relative;

    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.flex-box {
  display: flex;
  align-items: center;

  .timestyle {
    margin-left: 10px;
  }
}
</style>