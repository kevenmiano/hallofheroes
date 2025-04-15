// @ts-expect-error: External dependencies

import SimpleUserInfo = com.road.yishi.proto.login.SimpleUserInfo;

/**UserModel用户属性 */
export enum UserModelAttribute {
  userInfoList = "userInfoList",
  userName = "userName",
  password = "password",
  tempPassword = "tempPassword",
  loginKey = "loginKey",
  site = "site",
  key = "key",
  userId = "userId",
  gateIp = "gateIp", // 准备登录的网关IP
  port = "port", // 准备登录的网关端口
  loginState = "loginState", //登录状态
  channelId = "channelId", //玩家聚道ID
}

export class UserModelData {
  public userInfoList: SimpleUserInfo[];
  public userName: string = "";
  public password: string = "000000";
  public tempPassword: string = "";
  public loginKey: string = "";
  public site: string = "";
  public key: string = "";
  public userId: number = 0;
  public gateIp: string = "";
  public port: number = 0;
  public loginState: number = 0;
  public channelId: number = 0;
}
