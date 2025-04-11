import http from "../axios";

export interface Participant {
  id: number;
  name: string;
  weight: number;
  created_at?: string;
}

/** 创建参与者 */
export const createParticipant = (data: { name: string; weight?: number }) => {
  return http.post<Participant>("/api/luckyDraw", data);
};

/** 获取参与者列表 */
export const getluckyDraw = (params: {
  sortBy?: "id" | "weight" | "created_at";
  order?: "ASC" | "DESC";
  page?: number;
  pageSize?: number;
}) => {
  return http.get<{ luckyDraw: Participant[] }>("/api/luckyDraw", { params });
};

/** 获取单个参与者 */
export const getParticipant = (id: number) => {
  return http.get<Participant>(`/api/luckyDraw/${id}`);
};

/** 更新参与者 */
export const updateParticipant = (id: number, data: { name?: string; weight?: number }) => {
  return http.put<Participant>(`/api/luckyDraw/${id}`, data);
};

/** 删除单个参与者 */
export const deleteParticipant = (id: number) => {
  return http.delete<void>(`/api/luckyDraw/${id}`);
};

/** 删除全部参与者 */
export const deleteAllluckyDraw = () => {
  return http.delete<void>("/api/luckyDraw");
};
