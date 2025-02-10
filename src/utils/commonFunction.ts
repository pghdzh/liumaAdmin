// 清空对象字段值 --- 根据类型赋值
export const clearsObjectFieldValues = (obj: any) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const fieldType = typeof obj[key];
            switch (fieldType) {
                case 'string':
                    obj[key] = '';
                    break;
                case 'number':
                    obj[key] = 0;
                    break;
                case 'boolean':
                    obj[key] = false;
                    break;
                case 'object':
                    if (obj[key] === null) {
                        obj[key] = null;
                    } else if (Array.isArray(obj[key])) {
                        obj[key] = [];
                    } else {
                        obj[key] = {};
                    }
                    break;
                case 'undefined':
                    obj[key] = null;  // 将 undefined 赋值为 null
                    break;
                default:
                    obj[key] = null;
            }
        }
    }
    return obj;
};