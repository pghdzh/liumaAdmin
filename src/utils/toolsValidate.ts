/**
 * 去掉中文及空格
 * @param val 当前值字符串
 * @returns 返回处理后的字符串
 */
export function verifyCnAndSpace(val: string) {
    // 匹配中文与空格
    let v = val.replace(/[\u4e00-\u9fa5\s]+/g, '');
    // 匹配空格
    v = v.replace(/(^\s*)|(\s*$)/g, '');
    // 返回结果
    return v;
}