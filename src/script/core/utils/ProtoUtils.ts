/**
* @author:pzlricky
* @data: 2021-12-30 17:52
* @description Proto3处理工具
*/
export default class ProtoUtils {

    constructor() {

    }

    /**针对Proto3解析 */
    public static parse(msg: Object) {
        let protoObj = msg['__proto__'];
        for (const key in protoObj) {
            if (Object.prototype.hasOwnProperty.call(protoObj, key)) {
                let element = protoObj[key];
                if (!msg.hasOwnProperty(key)) {
                    msg[key] = element;
                }
            }
        }
        return msg;
    }

}