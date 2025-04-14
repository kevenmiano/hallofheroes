import t_s_baseConfigData from "./t_s_baseConfigData";

export default class t_s_mapphysicposition {
  public mDataList: t_s_mapphysicpositionData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_mapphysicpositionData(list[i]));
    }
  }
}

export class t_s_mapphysicpositionData extends t_s_baseConfigData {
  public ID: number;
  public Type: number; //类型——1城堡、2宝藏矿脉、3矿区、4boss、5精英、6小怪 7物资车
  public PhysicId: number; //坐标ID——对应t_s_physic的id, 非0为固定坐标, 0为随机刷新（刷新见下面几个字段）
  public Grade: number; //等级——显示等级
  protected Name: string; //名称——显示名称（有多语言后缀）
  protected Name_en: string = "";
  protected Name_es: string = "";
  protected Name_fr: string = "";
  protected Name_pt: string = "";
  protected Name_tr: string = "";
  protected Name_zhcn: string = "";
  protected Name_zhtw: string = "";
  public SonType: number; //显示——外观显示
  public RefreshNum: number; //刷新数量——对非固定有效, 此节点一次刷新出现的总数量
  public RefreshCoordinateRange: string; //刷新坐标范围——对非固定有效, X,X,Y,Y|X,X,Y,Y|X,X,Y,Y....的格式, 每个“X,X,Y,Y”为一个矩形
  public RefreshMinute: number; //刷新分钟——对非固定有效, 以整点计算, 如30就是0:00、0:30、1:00....刷新, 刷新时清除当前地图上的同类型节点, 重新刷新对应数量
  public Heroes: string; //Heroes——触发PVE战斗的怪物配置（可为空）
  public Soldiers: string; //触发PVE战斗的怪物配置（可为空）
  public Property1: number; //宝藏矿脉的公会加成、单个矿区的可占领数量上限
  public Property2: string; //备用

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  private NameKey: string = "Name";
  public get NameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.NameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.NameKey);
  }
}
