export enum SocketEvent
{
    SERVER_SUCCESS = "server_success",
    SERVER_DATA = "server_data",
    SERVER_ERROR = "server_error",
    SERVER_CLOSE = "server_close",
    CHECK_ERROR = "CHECK_ERROR",
    WEAK_NET = "WEAK_NET",
}

enum SocketCode
{
    SUCCESS = 0,
    World_ID_Err = 1,  // 服务器ID错误
    Name_Invalid = 2, // 名字无效
    Name_Out_len = 3, // 名字超出
    Name_Is_Used = 4, // 名字已占用
    Not_Player = 5, // 玩家不存在
    Create_Err = 6, // 创角失败
    Create_Success = 7, // 创角成功
    Sex_Err = 8, // 性别错误
    Job_Err = 9, // 职业错误
    Had_Login = 10,// 已登录
    Resubmit = 11, //  重复提交
    Server_Upgrade = 12, // 服务器维护中
    Limit_entry = 13, // 限制登录
    Server_packed = 14, // 服务器已满, 请前往其他服创建角色
    Sid_Invalid = 15, // 无效的 SID
    Sign_Invalid = 16, // 无效的签名
    Openid_Invalid = 17, // 无效的 OPENID
    Code_Invalid = 18, //验证码错误
}