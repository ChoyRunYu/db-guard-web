<template>
    <div class="db-table">
        <div class="db-table-toolbar">
            <div class="toolbar-item">
                <el-input v-model="searchKey" clearable placeholder="搜索表名及表注释" size="large">
                    <template #prefix>
                        <el-icon class="el-input__icon">
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
                <el-button :icon="Search" :onclick="getTableData" size="large" type="primary">搜索</el-button>
            </div>
            <div class="toolbar-item">
                <el-select v-model="dataSourceSelect" placeholder="切换数据源" size="large" style="width: 240px"
                    @change="changeDataSource">
                    <el-option v-for="item in dataSourceOptions" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
                <!-- <el-button :icon="Download" :onclick="getTableData" size="large" type="success">导出Markdown</el-button> -->
            </div>
        </div>
        <div class="db-table-main">
            <el-table :data="tableData" v-loading="loading" :border="true" preserve-expanded-content="false"
                style="width: 100%" @expand-change="expandClick" row-key="tableName">
                <el-table-column type="expand">
                    <template #default="props">
                        <div class="db-table-field">
                            <el-table :data="props.row.fields" :border="true" v-loading="childTableLoading">
                                <el-table-column label="字段名" prop="fieldName" />
                                <el-table-column label="类型" prop="fieldType" />
                                <el-table-column label="长度" prop="length" />
                                <el-table-column label="数值精度" prop="dataPrecision" />
                                <el-table-column label="小数位数" prop="decimalScale" />
                                <el-table-column label="允许为空" prop="nullable" />
                                <el-table-column label="主键" prop="primaryKey" />
                                <el-table-column label="字段描述" prop="fieldComment">
                                    <template #default="scope">
                                        <div style="width: 100px; height: 30px;"
                                            v-show="scope.$index !== editFieldIndex && scope.row.tableName == props.row.tableName"
                                            @click="handleFieldEditComment(scope.$index, scope.row)">
                                            {{ scope.row.fieldComment }}</div>
                                        <el-input :autofocus="true" style="width: 100px;"
                                            v-show="scope.$index === editFieldIndex && scope.row.tableName == props.row.tableName"
                                            v-model="scope.row.fieldComment" size="small"
                                            @blur="handleFieldSaveComment(scope.$index, scope.row)"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="表名" prop="tableName" />
                <el-table-column label="描述" prop="tableComment">
                    <template #default="scope">
                        <div style="width: 480px; height: 40px;" v-show="scope.$index !== editIndex"
                            @click="handleEditComment(scope.$index, scope.row)">
                            {{ scope.row.tableComment }}</div>
                        <el-input :autofocus="true" style="width: 480px;" v-show="scope.$index === editIndex"
                            v-model="scope.row.tableComment" size="small"
                            @blur="handleSaveComment(scope.$index, scope.row)"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script setup>
import { Search, Refresh, Download } from '@element-plus/icons-vue';
import { onMounted, reactive, ref, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'


const instance = getCurrentInstance()
const axios = instance.proxy.$axios;

const tableData = ref([])
const dataSourceSelect = ref('')
const dataSourceOptions = ref([])
const loading = ref(false)
const childTableLoading = ref(false)
const editIndex = ref(-1)
const editFieldIndex = ref(-1)
const editTmp = ref('')
const editFieldTmp = ref('')
const searchKey = ref('')


onMounted(() => {
    getDataSourceList();
})

const changeDataSource = () => {
    getTableData();
}
const getDataSourceList = () => {
    axios.get('/datasource/options').then(res => {
        dataSourceOptions.value = res.data
        dataSourceSelect.value = res.data[0].value
        getTableData();
    })
}


const getTableData = () => {
    loading.value = true
    axios.get('/database/list_tables?dataSourceId=' + dataSourceSelect.value + "&searchKey=" + searchKey.value).then(res => {
        tableData.value = res.data
        loading.value = false
        editIndex.value = -1
    })
}

const getTableField = (tableName) => {
    childTableLoading.value = true
    axios.get('/database/table_fields?dataSourceId=' + dataSourceSelect.value + '&tableName=' + tableName).then(res => {
        tableData.value.filter(item => item.tableName === tableName).map(item => {
            item.fields = res.data
            childTableLoading.value = false
        })
    })
}

const expandClick = (row, expandedRows) => {
    getTableField(row.tableName)
}

const handleSaveComment = (index, row) => {
    if (row.tableComment == editTmp.value) {
        editIndex.value = -1
        return
    }

    let formData = new FormData();
    formData.append('dataSourceId', dataSourceSelect.value);
    formData.append('tableName', row.tableName);
    formData.append('tableComment', row.tableComment);
    axios.post('/database/modify_table_commit', formData).then(res => {
        ElMessage.success(res.data)
        editIndex.value = -1
    })

}

const handleEditComment = (index, row) => {
    editIndex.value = index
    editTmp.value = row.tableComment
}

const handleFieldEditComment = (index, row) => {
    editFieldIndex.value = index
    editFieldTmp.value = row.fieldComment
}

const handleFieldSaveComment = (index, row) => {
    if (row.fieldComment == editFieldTmp.value) {
        editFieldIndex.value = -1
        return
    }

    let formData = new FormData();
    formData.append('dataSourceId', dataSourceSelect.value);
    formData.append('tableName', row.tableName);
    formData.append('fieldName', row.fieldName);
    formData.append('fieldComment', row.fieldComment);
    axios.post('/database/modify_field_commit', formData).then(res => {
        ElMessage.success(res.data)
        getTableField(row.tableName)
        editFieldIndex.value = -1
    })

}

</script>
<style scoped>
.db-table-toolbar {
    padding-bottom: 15px;
    border-bottom: 1px solid var(--el-border-color);
}

.db-table-toolbar>.toolbar-item:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.db-table-toolbar>.toolbar-item>* {
    padding: 10px;
}

.db-table-main {
    padding-top: 25px;
}

.db-table-field {
    padding: 20px;
}
</style>