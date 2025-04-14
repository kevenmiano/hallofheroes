export default class OutCityOneMineInfo {
  public posId: number = 0; //地图显示的节点id  mapposition id
  public nodeId: number = 0; //打开节点后不同等级的矿 mapmine id
  public sonNodeId: number = 0; //等级矿打开不同的节点
  public occupyPlayerId: number = 0; //占领该节点的玩家id
  public playerName: string = ""; //玩家姓名
  public guildId: number = 0; //占领玩家的公会id
  public sort: number = 0; //自己1 别人2
  public isOccupy: boolean = false; //是否是自己公会所占的城堡节点 默认false
}
