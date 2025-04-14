//@ts-expect-error: External dependencies
export default class OutyardReportInfo {
  public sourceGuildName: string = ""; //进攻方公会名
  public sourceUserNickName: string = ""; //进攻方玩家名
  public rivalGuildName: string = ""; //防守方公会名
  public rivalUserNickName: string = ""; //防守方玩家名
  public rivalIsNpc: boolean = false; //防守方是否为NPC
  public isWin: boolean = false; //输赢 进攻列表进攻成功为true,防守列表防守成功为true
  public defenceDebuffLevel: number = 0; //防守debug等级 防守成功升一级
  public changeScore: number = 0; //积分变化
  public reportTime: string = ""; //时间 yyyy-MM-DD HH:mm:ss
  public timestamp: string = ""; //时间戳精确到豪秒, 用于刷新列表或加载更多
}
