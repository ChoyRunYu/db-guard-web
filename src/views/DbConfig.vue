<template>
    <div class="dbconfig">
        <div class="table-btn">
            <el-button :icon="Refresh" :onclick="refreshTable">刷新</el-button>
            <el-button :icon="Plus" type="primary" @click="addFormVisible = true">添加数据源</el-button>
        </div>
        <div class="table">
            <el-table :data="tableData" border style="width: 100%" empty-text="暂无数据">
                <el-table-column prop="id" label="id" width="180">
                    <template #default="scope">
                        <el-link :underline="false" @click="copy(scope.row.id)">{{ scope.row.id }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="dataSourceName" label="数据源名称" width="180" />
                <el-table-column prop="dbType" label="数据库类型" />
                <el-table-column prop="dbUrl" label="数据库URL" />
                <el-table-column prop="username" label="用户名" witdh="80" />
                <el-table-column prop="dataSourceDesc" label="备注" />
                <el-table-column width="140" label="操作">
                    <template #default="scope">
                        <el-button :icon="Edit" type="primary" plain size="small"
                            @click="edit(scope.row.id)"></el-button>
                        <el-popconfirm title="确认删除吗?" @confirm="delDatasource(scope.row.id)" confirm-button-text="确认"
                            cancel-button-text="取消">
                            <template #reference>
                                <el-button :icon="Delete" type="danger" size="small"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>

    <DatasourceDialog v-model:visible="addFormVisible" @confirm="refreshTable" title="添加数据源" />
    <DatasourceDialog ref="dialogRef" v-model:visible="modifyFormVisible" @confirm="refreshTable" title="修改数据源" />
</template>
<style scoped>
.table-btn {
    padding: 20px 10px 30px 20px;
}

.table {
    height: 100%;
}
</style>

<script setup>
import { reactive, ref } from 'vue'
import { Delete, Edit, Search, Plus, Refresh } from '@element-plus/icons-vue'
import { getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import DatasourceDialog from '@/components/DatasourceDialog.vue'


const instance = getCurrentInstance();
const axios = instance.proxy.$axios;
const tableData = ref([])
const addFormVisible = ref(false)
const modifyFormVisible = ref(false)
const dbType = ref([])
const dialogRef = ref()


onMounted(() => {
    refreshTable();
    getDbType();
})

const getDbType = () => {
    axios.get("/datasource/list_type").then(res => {
        dbType.value = res.data.map(element => {
            return {
                label: element,
                value: element
            }
        });
    })
}

const refreshTable = () => {
    axios.get('/datasource/list').then(res => {
        tableData.value = res.data;
    })
}

const delDatasource = (id) => {
    axios.post("/datasource/delete?id=" + id).then(res => {
        ElMessage.success(res.message);
        refreshTable()
    })
}

const edit = (id) => {
    modifyFormVisible.value = true
    dialogRef.value.loadData(id);
}

const copy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
        ElMessage.success('复制成功')
    })
}

</script>