<script setup>
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { InfoFilled } from '@element-plus/icons-vue'

import { AdminOrder, UpdateOrder } from '../../../api';
import PanelHead from '../../../components/panelHead.vue'

const route = useRoute()
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
const getListData = (params = {}) => {
  AdminOrder({ ...pagination, ...params }).then(({ data }) => {
    const { list, total } = data.data
    // list.forEach(item => {
    //   item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    // })
    tableData.list = list
    tableData.total = total
  }).catch((err) => {
    console.log(err);
  });
}

onMounted(() => {
  getListData()
})

const statusMap = (key) => {
  const obj = {
    '已取消': 'info',
    '待支付': 'warning',
    '已完成': 'success'
  }
  return obj[key]
}

const ConfirmEvent = (id) => {
  UpdateOrder({ id }).then(({ data }) => {
    if (data.code === 10000) {
      getListData()
    }
  })
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
// 搜索功能
const searchForm = reactive({
  out_trade_no: ''
})

const onSubmit = () => {
  getListData(searchForm)
}
</script>



<template>
  <div>
    <PanelHead :route="route"></PanelHead>
    <div class="form">
      <el-form :inline="true" :model="searchForm">
        <el-form-item prop="out_trade_no">
          <el-input v-model="searchForm.out_trade_no" placeholder="订单号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData.list">
      <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
      <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
      <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
      <el-table-column label="陪护师">
        <template #default="scope">
          <el-image style="width: 40px; height:40px;" :src="scope.row.companion.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="陪护师手机号" width="120">
        <template #default="scope">
          {{ scope.row.companion.mobile }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="总价"></el-table-column>
      <el-table-column prop="paidPrice" label="已付"></el-table-column>
      <el-table-column label="下单时间" width="120">
        <template #default="scope">
          {{ dayjs(scope.row.order_start_time).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template #default="scope">
          <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="service_state" label="接单状态"></el-table-column>
      <el-table-column prop="tel" label="联系人手机号" width="120"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-popconfirm v-if="scope.row.trade_state === '待服务'" :icon="InfoFilled" icon-color="#626AEF" title="是否确认完成？"
            @confirm="ConfirmEvent(scope.row.out_trade_no)">
            <template #reference>
              <el-button type="primary" link>服务完成</el-button>
            </template>
            <template #actions="{ confirm, cancel }">
              <el-button size="small" @click="cancel">否</el-button>
              <el-button type="danger" size="small" @click="confirm">
                是
              </el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" disabled link>暂无服务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-info">
      <!-- 分页计数 -->
      <el-pagination v-model:current-page="pagination.pageNum" :page-size="pagination.pageSize" :background="false"
        size="small" layout="total, prev, pager, next" :total="tableData.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>



<style lang="less" scoped>
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>