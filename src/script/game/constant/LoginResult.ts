// @ts-nocheck
/**
* @author:pzlricky
* @data: 2021-07-05 17:05
* @description *** 
*/
export default class LoginResult {

    public static SUCCEED: number = 0;//代理商登陆成功        
    public static OTHER_ERROR: number = 1;//其他错误
    public static CONTENT_ERROR: number = 2;//地址栏参数个数不对
    public static IP_ERROR: number = 3;//无效IP
    public static SITE_ERROR: number = 4;//代理商错误
    public static LOGIN_ERROR: number = 5;//加密不正确
    public static WEBCASTLE_ERROR: number = 6;//注册服务不正确
    public static VERIFY_ERROR: number = 7;//验证失败
    public static SITE_CLOSE: number = 8;//区服未开放

}


export class PREPARE_LOGIN_RESULT {
    public static SUCCEED_NOVISUALIZE = "Login Succeed No Visualize";
}