/*
 * @Author: jeremy.xu
 * @Date: 2024-03-01 16:30:53
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-20 14:49:31
 * @Description:
 */
import { CommonConstant } from "../constant/CommonConstant";
import { EmPackName } from "../constant/UIDefine";
import GoodsProfile from "../datas/goods/GoodsProfile";
import { PathManager } from "../manager/PathManager";
import FUIHelper from "../utils/FUIHelper";
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
 * t_s_secrettreasure
 */
export default class t_s_secrettreasure {
  public mDataList: t_s_secrettreasureData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_secrettreasureData(list[i]));
    }
  }
}

export class t_s_secrettreasureData extends t_s_baseConfigData {
  // 秘宝ID
  public TreasureId: number = 0;
  // 图标路径
  public Icon: string = "";
  // 品质，显示用
  public Quality: number = 0;
  // 类型，1为装备，2为消耗品
  public Type: number = 0;
  // 友方附加被动技能
  public OwnSkill: number = 0;
  // 敌方附加被动技能
  public EnemySkill: number = 0;
  protected Name_de: string = "";
  protected Name_en: string = "";
  protected Name_es: string = "";
  protected Name_fr: string = "";
  protected Name_pt: string = "";
  protected Name_tr: string = "";
  protected Name_zhcn: string = "";
  protected Name_zhtw: string = "";
  protected Description_de: string = "";
  protected Description_en: string = "";
  protected Description_es: string = "";
  protected Description_fr: string = "";
  protected Description_pt: string = "";
  protected Description_tr: string = "";
  protected Description_zhcn: string = "";
  protected Description_zhtw: string = "";

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  public get profileColor(): string {
    return GoodsProfile.getGoodsProfileColor(this.Quality);
  }

  public get iconPath(): string {
    return PathManager.resourcePath + "icon" + this.Icon.toLocaleLowerCase();
  }

  public get profilePath(): string {
    let profileNum = this.Quality - 1;
    let url = FUIHelper.getItemURL(
      EmPackName.Base,
      CommonConstant.QUALITY_RES[profileNum],
    );
    return url;
  }

  private TemplateNameKey: string = "Name";
  public get TemplateNameLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.TemplateNameKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.TemplateNameKey);
  }

  private DescriptionKey: string = "Description";
  public get DescriptionLang(): string {
    let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
    if (value) {
      return value;
    }
    return ""; //return this.getKeyValue(this.DescriptionKey);
  }
}
