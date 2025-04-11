<template>
    <div class="content">
        <div class="topSearchArea">
            <el-button type="primary" @click="openDialog(null)">新增参与者</el-button>
            <el-button type="danger" @click="onDeleteAll" style="margin-left: 20px">删除全部参与者</el-button>
        </div>

        <el-table :data="tableData" v-loading="isLoading" stripe :header-cell-style="{
            background: '#F7F8FA',
            color: '#000',
            fontSize: '14px',
            fontWeight: 'normal'
        }">
            <!-- 序号 -->
            <el-table-column type="index" label="序号" width="80" align="center" />

            <!-- 姓名 -->
            <el-table-column prop="name" label="姓名" align="center" />

            <!-- 权重 -->
            <el-table-column prop="weight" label="权重" align="center" />

            <!-- 创建时间 -->
            <el-table-column prop="created_at" label="创建时间" align="center" width="180">
                <template #default="{ row }">
                    {{ formatDate(row.created_at) }}
                </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作" align="center" width="200">
                <template #default="{ row }">
                    <el-button icon="el-icon-edit" size="small" @click="openDialog(row)">编辑</el-button>
                    <el-button icon="el-icon-delete" size="small" type="danger" @click="onDelete(row.id)"
                        style="margin-left: 8px">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination v-if="total > 0" class="pagination" background layout="total, sizes, prev, pager, next, jumper"
            :total="total" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
            @current-change="onPageChange" @size-change="onSizeChange" />

        <!-- 新增/编辑 对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" center>
            <el-form :model="form" ref="formRef" label-width="80px">
                <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="权重" prop="weight" :rules="[{ required: true, message: '请输入权重', trigger: 'blur' }]">
                    <el-input-number v-model="form.weight" :min="1" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    createParticipant,
    getluckyDraw,
    getParticipant,
    updateParticipant,
    deleteParticipant,
    deleteAllluckyDraw
} from '@/api/modules/luckyDraw'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Participant {
    id: number
    name: string
    weight: number
    created_at: string
}

const isLoading = ref(false)
const tableData = ref<Participant[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const form = ref<Partial<Participant>>({ name: '', weight: 1 })

// 格式化日期
const formatDate = (dt: string) => new Date(dt).toLocaleString()

// 拉取列表
async function fetchList() {
    isLoading.value = true
    const res = await getluckyDraw({
        page: currentPage.value,
        pageSize: pageSize.value,
        sortBy: 'id',
        order: 'ASC'
    })
    tableData.value = res.participants
    total.value = res.participants.length // 如果后端返回 total，请用 res.total
    isLoading.value = false
}

// 分页
function onPageChange(page: number) {
    currentPage.value = page
    fetchList()
}
function onSizeChange(size: number) {
    pageSize.value = size
    currentPage.value = 1
    fetchList()
}

// 打开对话框
function openDialog(row: Participant | null) {
    if (row) {
        dialogTitle.value = '编辑参与者'
        form.value = { ...row }
    } else {
        dialogTitle.value = '新增参与者'
        form.value = { name: '', weight: 1 }
    }
    dialogVisible.value = true
}

// 提交新增/编辑
async function onSubmit() {
    try {
        await formRef.value.validate()
    } catch {
        return
    }
    if (form.value.id) {
        await updateParticipant(form.value.id, {
            name: form.value.name!,
            weight: form.value.weight!
        })
        ElMessage.success('更新成功')
    } else {
        await createParticipant({
            name: form.value.name!,
            weight: form.value.weight!
        })
        ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchList()
}

// 删除单个
function onDelete(id: number) {
    ElMessageBox.confirm('确认删除该参与者？', '警告', { type: 'warning' })
        .then(async () => {
            await deleteParticipant(id)
            ElMessage.success('删除成功')
            fetchList()
        })
        .catch(() => { })
}

// 删除全部
function onDeleteAll() {
    ElMessageBox.confirm('确认删除所有参与者？', '警告', { type: 'warning' })
        .then(async () => {
            await deleteAllluckyDraw()
            ElMessage.success('已删除全部')
            fetchList()
        })
        .catch(() => { })
}

onMounted(fetchList)
</script>

<style scoped lang="scss">
.content {
    padding: 20px;

    .topSearchArea {
        margin-bottom: 20px;
    }
}

.pagination {
    margin: 20px 0;
    text-align: right;
}
</style>