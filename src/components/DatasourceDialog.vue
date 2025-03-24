<template>
    <el-dialog v-model="dialogVisible" :title="title" width="800">
        <el-form ref="formRef" :model="form" :rules="formRules">
            <el-form-item label="数据库名称" prop="dataSourceName" required :label-width="formLabelWidth">
                <el-input v-model="form.dataSourceName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="数据库描述" prop="dataSourceDesc" :label-width="formLabelWidth">
                <el-input v-model="form.dataSourceDesc" autocomplete="off" />
            </el-form-item>
            <el-form-item label="数据库类型" required prop="dbType" :label-width="formLabelWidth">
                <el-select v-model="form.dbType" placeholder="请选择数据库类型" size="large">
                    <el-option v-for="item in dbType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="数据库URL" prop="dbUrl" required :label-width="formLabelWidth">
                <el-input v-model="form.dbUrl" autocomplete="off" />
            </el-form-item>
            <el-form-item label="数据库账号" prop="username" required :label-width="formLabelWidth">
                <el-input v-model="form.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="数据库密码" prop="password" required :label-width="formLabelWidth">
                <el-input v-model="form.password" type="password" show-password autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="closeForm">取消</el-button>
                <el-button type="primary" @click="addDataSource">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import { getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus'


const instance = getCurrentInstance();
const axios = instance.proxy.$axios;

const props = defineProps(['visible', 'confirm', 'title'])
const emit = defineEmits(['update:visible']);
const dialogVisible = ref(props.visible);
const title = ref(props.title)


const dbType = ref([])
const formRef = ref()
const formLabelWidth = '140px'


watch(() => props.visible, (newValue) => {
    dialogVisible.value = newValue;
})
watch(dialogVisible, (newValue) => {
    emit('update:visible', newValue);
})

onMounted(() => {
    console.log('AddDatasourceDialog mounted');
    getDbType();
})

const formRules = reactive({
    dataSourceName: [{ required: true, message: '数据库名称不能为空', trigger: 'blur' }],
    dbType: [{ required: true, message: '数据库类型不能为空', trigger: 'change' }],
    dbUrl: [{ required: true, message: '数据库URL不能为空', trigger: 'blur' }],
    username: [{ required: true, message: '数据库账号不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '数据库密码不能为空', trigger: 'blur' }]
});


const form = reactive({
    "id": '',
    "dataSourceName": '',
    "dataSourceDesc": '',
    "dbType": '',
    "dbUrl": '',
    "username": '',
    "password": ""
})


const getDbType = () => {
    axios.get("/datasource/list_type").then(res => {
        dbType.value = res.data.map(element => {
            return {
                label: element,
                value: element
            }
        });
        console.log("dbType - ", dbType.value)
    })
}


const closeForm = () => {
    dialogVisible.value = false;
    formRef.value.resetFields();
}

const addDataSource = async () => {
    await formRef.value.validate((valid, fields) => {
        if (valid) {
            axios.post("/datasource/save", form).then(res => {
                ElMessage.success(res.message);
                formRef.value.resetFields();
                dialogVisible.value = false;
                emit('confirm');
            })
        }
    })
}

const loadData = async (id) => {
    axios.get(`/datasource/one?id=${id}`).then(res => {
        Object.assign(form, res.data);
    }).catch(error => {
        ElMessage.error(error.message);
    });
};

defineExpose({
    loadData
});

</script>