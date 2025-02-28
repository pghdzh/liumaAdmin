<template>
  <div class="content">
    <div class="topSearchArea">
      <el-button type="primary" style="margin-left: 20px" @click="openAdd(null)">
        新增
      </el-button>
      <el-button type="primary" style="margin-left: 20px" @click="openAddMultiple">
        批量新增
      </el-button>
      <el-button type="danger" style="margin-left: 20px" @click="deleteAllAIImagesReq">
        删除全部生成的图片</el-button>
    </div>

    <el-table :data="tableData" v-loading="isLoading" stripe scrollbar-always-on :header-cell-style="{
      background: '#F7F8FA',
      color: '#000000',
      fontSize: '14px',
      fontWeight: 'normal',
    }">
      <!-- 序号 -->
      <el-table-column type="index" :width="100" label="序号" align="center" />

      <!-- 标题 -->
      <el-table-column prop="image_name" label="标题" align="center" />

      <!-- 图片预览 -->
      <el-table-column label="图片" align="center">
        <template #default="{ row }">
          <el-image :src="row.image_path" :style="getCardStyle(row.orientation)" />
        </template>
      </el-table-column>

      <!-- 方向（横/竖） -->
      <el-table-column prop="orientation" label="方向" align="center">
        <template #default="{ row }">
          <el-tag :type="row.orientation === 1 ? 'success' : 'warning'">
            {{ row.orientation === 1 ? "竖" : "横" }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 描述 -->
      <el-table-column prop="description" label="描述" align="center" />

      <!-- 上传时间 -->
      <el-table-column prop="created_at" label="上传时间" align="center" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" :width="300" align="center">
        <template #default="scope">
          <el-button type="primary" @click="openAdd(scope.row)" :icon="Edit" circle />
          <el-button type="danger" :icon="Delete" circle @click="deleteAIImageReq(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination v-if="total > 0" class="pagination" background layout="total, sizes, prev, pager, next, jumper"
      :total="total" :current-page="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
      @current-change="handlePageChange" @size-change="handleSizeChange" />
    <el-dialog v-model="addVisible" :title="dialogTitle" center width="600">
      <div class="upload-container">
        <!-- 上传组件 -->
        <el-upload v-if="!uploadedImage" class="upload-box" name="image"
          action="http://localhost:3000/api/aiImages/upload-ai-image" list-type="picture-card"
          :on-success="handleUploadSuccess" :before-upload="checkFileSize" :show-file-list="false" accept="image/*">
          <el-button type="primary">上传图片</el-button>
        </el-upload>

        <!-- 预览已上传的图片 -->
        <div v-if="uploadedImage" class="image-preview">
          <el-card class="image-card">
            <img :src="uploadedImage" class="uploaded-image" />
          </el-card>
        </div>
      </div>
      <!-- 录入AI生成信息 -->
      <el-form label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="addFormData.image_name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addFormData.description" />
        </el-form-item>
        <el-form-item label="方向">
          <el-select v-model="addFormData.orientation">
            <el-option label="竖向" :value="1" />
            <el-option label="横向" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitData" style="margin-right: 30px">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="addVisibleMultiple" title="批量上传" center width="1600">
      <div class="upload-container">
        <!-- 批量上传组件 -->
        <el-upload class="upload-box" name="images" action="http://localhost:3000/api/aiImages/upload-ai-images"
          list-type="picture-card" :on-success="handleUploadSuccessMultiple" :before-upload="checkFileSizeMultiple"
          :show-file-list="true" accept="image/*" multiple ref="uploadRef">
          <el-button type="primary">上传图片</el-button>
        </el-upload>
      </div>

      <!-- 录入AI生成信息 -->
      <el-form label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="addFormDataMultiple.image_name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addFormDataMultiple.description" />
        </el-form-item>
        <el-form-item label="方向">
          <el-select v-model="addFormDataMultiple.orientation">
            <el-option label="竖向" :value="1" />
            <el-option label="横向" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDataMultiple" style="margin-right: 30px">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { addAIImage, addAIImageMultiple, getAIImageList, updateAIImage, deleteAIImage, deleteAllAIImages } from "@/api/modules/AIGeneratedImage";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const isLoading: any = ref(false);
const tableData: any = ref([]);

// 格式化日期
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString();
};

const addVisible: any = ref(false);
const addFormData = ref({
  image_name: "",
  orientation: 2,
  image_path: "",
  description: '',
});

const total = ref(0); // 总数据量
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页数据量
// 计算序号
const indexMethod = (index: number) => {
  return (currentPage.value - 1) * pageSize.value + index + 1;
};

// 切换页码
const handlePageChange = (page: number) => {
  currentPage.value = page;
  getAIImageListReq();
};

// 切换每页数量
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1; // 重新计算页码
  getAIImageListReq();
};

// 存储上传后的单张图片
const uploadedImage = ref("");

// 上传成功回调
const handleUploadSuccess = (response) => {
  ElMessage.success("图片上传成功！");
  uploadedImage.value = 'http://localhost:3000' + response.imagePath; // 只存储最新的一张图片
};

// 限制文件大小
const checkFileSize = (file) => {
  const isLessThan10MB = file.size / 1024 / 1024 < 10;
  if (!isLessThan10MB) {
    ElMessage.error("图片大小不能超过 10MB！");
  }
  return isLessThan10MB;
};

// 获取列表
const getAIImageListReq = async () => {
  isLoading.value = true;
  let res: any = await getAIImageList({
    page: currentPage.value,
    pageSize: pageSize.value,
  });
  if (res.code == 200) {
    tableData.value = res.data;
    total.value = res.total
  }
  isLoading.value = false;
};

// 图片显示样式（根据方向调整）
const getCardStyle = (orientation?: number) => {
  return orientation === 1
    ? { width: "90px", height: "160px" } // 竖向
    : { width: "160px", height: "90px" }; // 横向
};

// 提交数据
const submitData = async () => {
  addFormData.value.image_path = uploadedImage.value;
  if (addFormData.value.id) {
    let res = await updateAIImage(addFormData.value.id, addFormData.value);
    if (res.code === 200) {
      addVisible.value = false;
      ElMessage.success("修改成功");
      getAIImageListReq();
    }
  } else {
    let res = await addAIImage(addFormData.value);
    if (res.code === 200) {
      addVisible.value = false;
      ElMessage.success("新增成功");
      getAIImageListReq();
    }
  }
};

// 删除单个AI图片
const deleteAIImageReq = async (id: any) => {
  ElMessageBox.confirm("确认删除该AI生成图片吗", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let res = await deleteAIImage(id);
      if (res.code === 200) {
        getAIImageListReq();
        ElMessage.success("删除成功");
      }
    })
    .catch(() => {
      ElMessage.info("取消删除");
    });
};

// 删除全部AI图片
const deleteAllAIImagesReq = async () => {
  ElMessageBox.confirm("确认删除所有AI生成图片吗", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let res: any = await deleteAllAIImages();
      if (res.code === 200) {
        getAIImageListReq();
        ElMessage.success("删除成功");
      }
    })
    .catch(() => {
      ElMessage.info("取消删除");
    });
};

// 打开新增/修改对话框
const dialogTitle = ref("");
const openAdd = (row: any) => {
  if (row?.id) {
    uploadedImage.value = row.image_path
    addFormData.value = row;
    addFormData.value.id = row.id;
    dialogTitle.value = "修改AI生成图片";
  } else {
    dialogTitle.value = "新增AI生成图片";

    uploadedImage.value = null;
  }
  addVisible.value = true;
};

//批量新增
const addVisibleMultiple = ref(false)
const uploadedImages = ref([]); // 存储已上传的图片路径
const addFormDataMultiple = ref({
  image_name: '',
  description: '',
  orientation: 2,
});

const openAddMultiple = () => {
  addVisibleMultiple.value = true
  uploadedImages.value = []
}

// 图片上传成功处理
const handleUploadSuccessMultiple = (response, file, fileList) => {
  // 将新上传的图片路径添加到现有路径数组前面
  if (response && response.imagePaths) {
    const updatedImagePaths = response.imagePaths.map(path => `http://localhost:3000${path}`);

    // 将新图片路径添加到已上传路径前面
    uploadedImages.value = [...updatedImagePaths, ...uploadedImages.value];
  }
};


// 文件大小限制
const checkFileSizeMultiple = (file) => {
  const isSmallEnough = file.size / 1024 / 1024 < 10; // 限制文件小于5MB
  if (!isSmallEnough) {
    ElMessage.error('文件过大，最大支持10MB');
  }
  return isSmallEnough;
};

// 引用上传组件
const uploadRef = ref(null);
const submitDataMultiple = async () => {
  try {
    const data = {
      ...addFormDataMultiple.value,
      image_path: uploadedImages.value, // 提交所有上传的图片路径
    };

    // 发送请求到后端，保存图片信息
    const res = await addAIImageMultiple(data);
    ElMessage.success('提交成功');
    getAIImageListReq();
    uploadRef.value.clearFiles(); // 调用 clearFiles 方法清除文件
    addVisibleMultiple.value = false // 关闭弹窗
  } catch (error) {
    ElMessage.error('提交失败');
  }

}
onMounted(() => {
  getAIImageListReq();
});
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  overflow: auto;

  .topSearchArea {
    margin: 20px 0;
  }
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.image-preview {
  margin-top: 10px;
}

.image-card {
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: gainsboro;
  border-radius: 10px;
}

/* Firefox */
::-moz-scrollbar {
  width: 4px;
}

::-moz-scrollbar-thumb {
  background-color: gainsboro;
  border-radius: 10px;
}
</style>
