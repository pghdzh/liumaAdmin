<template>
  <div class="content">
    <div class="topSearchArea">
      <el-button
        type="primary"
        style="margin-left: 20px"
        @click="openAdd(null)"
      >
        新增
      </el-button>
      <el-button
        type="danger"
        style="margin-left: 20px"
        @click="deleteAllLiumaMediaReq"
      >
        删除全部流麻</el-button
      >
    </div>

    <el-table
      :data="tableData"
     
      v-loading="isLoading"
      stripe
      scrollbar-always-on
      :header-cell-style="{
        background: '#F7F8FA',
        color: '#000000',
        fontSize: '14px',
        fontWeight: 'normal',
      }"
    >
       <!-- 序号 -->
  <el-table-column type="index" :width="100" label="序号" align="center" />

<!-- 标题 -->
<el-table-column prop="title" label="标题" align="center" />

<!-- 图片预览 -->
<el-table-column label="图片" align="center">
  <template #default="{ row }">
    <el-image
      :src="row.image_url"
      style="width: 100px; height: 100px; object-fit: cover"
      :preview-src-list="[row.image_url]"
    />
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

<!-- 视频链接 -->
<el-table-column label="视频" align="center">
  <template #default="{ row }">
    <el-button v-if="row.video_url" type="primary" link @click="openVideo(row.video_url)">
      预览视频
    </el-button>
    <span v-else>无</span>
  </template>
</el-table-column>  <!-- 上传时间 -->
  <el-table-column prop="created_at" label="上传时间" align="center" width="180">
    <template #default="{ row }">
      {{ formatDate(row.created_at) }}
    </template>
  </el-table-column>
      <el-table-column label="操作" :width="300" align="center">
        <template #default="scope">
         
          <el-button
            type="primary"
            @click="openAdd(scope.row)"
            :icon="Edit"
            circle
          />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            @click="deleteLiumaMediaReq(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="addVisible" :title="dialogTitle" center width="600">
   
      <div class="upload-container">
    <!-- 上传组件 -->
    <el-upload
    v-if="!uploadedImage"
      class="upload-box"
      name="image"
      action="http://localhost:3000/api/liuma-media/upload"  
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="checkFileSize"
      :show-file-list="false"
      accept="image/*"
    >
      <el-button type="primary">上传图片</el-button>
    </el-upload>

    <!-- 预览已上传的图片 -->
    <div v-if="uploadedImage" class="image-preview">
      <el-card class="image-card">
        <img :src="uploadedImage" class="uploaded-image" />
      </el-card>
    </div>
  </div>
    <!-- 录入流麻信息 -->
    <el-form label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="addFormData.title" />
      </el-form-item>
      <el-form-item label="方向">
        <el-select v-model="addFormData.orientation">
          <el-option label="竖向" :value="1" />
          <el-option label="横向" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="视频地址">
        <el-input v-model="addFormData.video_url" />
      </el-form-item>
    </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitData"
            style="margin-right: 30px"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Delete, Edit, Search } from "@element-plus/icons-vue";
import { uploadLiumaImage, addLiumaMedia,getLiumaMediaList,updateLiumaMedia,deleteLiumaMedia,deleteAllLiumaMedia } from "@/api/modules/liumaMedia";
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
  title: "",
  orientation: 2,
  video_url: "",
  image_url: "",
});
// 存储上传后的单张图片
const uploadedImage = ref("");

// 上传成功回调
const handleUploadSuccess = (response) => {
  ElMessage.success("图片上传成功！");
  uploadedImage.value = 'http://localhost:3000'+response.image_url; // 只存储最新的一张图片
};

// 限制文件大小
const checkFileSize = (file) => {
  const isLessThan10MB = file.size / 1024 / 1024 < 10;
  if (!isLessThan10MB) {
    ElMessage.error("图片大小不能超过 10MB！");
  }
  return isLessThan10MB;
};

//获取用户列表
const getLiumaMediaListReq = async () => {
  let res: any = await getLiumaMediaList();
  if (res.length) {
    tableData.value = res;
  }
};

// 上传图片
const handleUpload = async (param) => {
  try {
    const res = await uploadLiumaImage(param.file);
    form.value.image_url = res.data.image_url;
    ElMessage.success("图片上传成功！");
  } catch (err) {
    ElMessage.error("图片上传失败！");
  }
};


const submitData = async () => {
  addFormData.value.image_url =  uploadedImage.value
  if (addFormData.value.id) {
    let res = await updateLiumaMedia(addFormData.value.id, addFormData.value);
    if (res.code == 200) {
      addVisible.value = false;
      ElMessage.success(`修改成功`);
      getLiumaMediaList();
    }
  } else {
    
    let res = await addLiumaMedia(addFormData.value);
    if (res.code == 200) {
      addVisible.value = false;
      ElMessage.success(`新增成功`);
      getLiumaMediaList();
    }
  }
};


const deleteLiumaMediaReq = async (id: any) => {
  ElMessageBox.confirm("确认删除流麻吗", "Warning", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let res = await deleteLiumaMedia(id);
      if (res.code == 200) {
        getLiumaMediaListReq();
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

const deleteAllLiumaMediaReq = async () => {
  ElMessageBox.confirm("确认删除全部流麻吗", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let res: any = await deleteAllLiumaMedia();
      if (res.code == 200) {
        getLiumaMediaListReq();
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

const dialogTitle = ref("");
const openAdd = (row: any) => {
  if (row?.id) {
    addFormData.value = row;
    addFormData.value.id = row.id;
    dialogTitle.value = "修改流麻";
  } else {
    dialogTitle.value = "新增流麻";
    addFormData.value = {};
    uploadedImage.value = null
  }
  addVisible.value = true;
};

onMounted(() => {
  getLiumaMediaListReq();
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
  /* 滚动条滑块颜色 */
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
