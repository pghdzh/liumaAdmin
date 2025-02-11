import http from "../axios";

/**
 * @function 上传 AI 生成的图片（返回存储路径）
 * @param {File} file - 需要上传的图片文件
 */
export const uploadAIImage = (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return http.post("/api/aiImages/upload", formData);
};

/**
 * @function 添加 AI 生成的图片数据
 * @param {object} data - 例如：{ image_name: "AI 图片", image_path: "uploads/aiImg/xxx.jpg", description: "描述", likes: 0 }
 */
export const addAIImage = (data: any) => {
  return http.post("/api/aiImages", data);
};

/**
 * @function 获取 AI 生成的图片列表（支持排序、分页）
 * @param {object} params - 例如：{ sortBy: "likes", order: "DESC", page: 1, pageSize: 10 }
 */
export const getAIImageList = (params: any): any => {
  return http.get("/api/aiImages", params);
};

/**
 * @function 获取单个 AI 生成的图片信息
 * @param {number} imageId - 图片 ID
 */
export const getAIImage = (imageId: number): any => {
  return http.get(`/api/aiImages/${imageId}`);
};

/**
 * @function 更新 AI 生成的图片信息
 * @param {number} imageId - 图片 ID
 * @param {object} updatedData - 例如：{ image_name: "新名称", description: "新描述" }
 */
export const updateAIImage = (imageId: number, updatedData: any): any => {
  return http.put(`/api/aiImages/${imageId}`, updatedData);
};

/**
 * @function 删除单个 AI 生成的图片
 * @param {number} imageId - 图片 ID
 */
export const deleteAIImage = (imageId: number): any => {
  return http.delete(`/api/aiImages/${imageId}`);
};

/**
 * @function 批量删除所有 AI 生成的图片
 */
export const deleteAllAIImages = (): any => {
  return http.delete(`/api/aiImages/deleteAll`);
};
