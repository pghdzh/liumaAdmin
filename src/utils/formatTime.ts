/**
 * 时间问候语
 * @param param 当前时间，new Date() 格式
 * @description param 调用 `formatAxis(new Date())` 输出 `上午好`
 * @returns 返回拼接后的时间字符串
 */
export function formatAxis(param: Date): string {
  let hour: number = new Date(param).getHours();
  if (hour < 6) return "凌晨好，愿你拥有一个宁静的清晨！";
  else if (hour < 9) return "早上好，祝你今天有个美好的开始！";
  else if (hour < 12) return "上午好，愿你在这段时间精力充沛！";
  else if (hour < 14) return "中午好，别忘了好好吃饭，保持能量！";
  else if (hour < 17) return "下午好，愿你度过一个高效而愉快的下午！";
  else if (hour < 19) return "傍晚好，放松一下，享受这温暖的时刻吧！";
  else if (hour < 22) return "晚上好，愿你度过一个美好的夜晚！";
  else return "夜里好，早点休息，晚安！";
}
