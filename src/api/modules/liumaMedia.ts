import http from "../axios";
//
export const uploadLiumaImage = (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return http.post("/api/liuma-media/upload", formData);
};

export const addLiumaMedia = (data: any) => {
  return http.post("/api/liuma-media", data);
};
/**
 * @function 获取流麻图片列表（支持排序、分页）
 * @param {object} params - 例如：{ sortBy: "likes", order: "DESC", page: 1, pageSize: 10 }
 */
export const getLiumaMediaList = (params: any): any => {
  return http.get("/api/liuma-media", { params });
};

/**
 * @function 获取单个流麻图片信息
 * @param {number} mediaId - 图片 ID
 */
export const getLiumaMedia = (mediaId: number): any => {
  return http.get(`/api/liuma-media/${mediaId}`);
};

/**
 * @function 更新流麻图片信息
 * @param {number} mediaId - 图片 ID
 * @param {object} updatedData - 例如：{ title: "新标题", orientation: 1, video_url: "xxx" }
 */
export const updateLiumaMedia = (mediaId: number, updatedData: any): any => {
  return http.put(`/api/liuma-media/${mediaId}`, updatedData);
};

/**
 * @function 删除单个流麻图片
 * @param {number} mediaId - 图片 ID
 */
export const deleteLiumaMedia = (mediaId: number): any => {
  return http.delete(`/api/liuma-media/${mediaId}`);
};

/**
 * @function 批量删除所有流麻图片
 */
export const deleteAllLiumaMedia = (): any => {
  return http.delete(`/api/liuma-media/all`);
};
