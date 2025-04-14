import FUI_FunOpenItem from "../../../../fui/FunPreview/FUI_FunOpenItem";
import { t_s_systemopentipsData } from "../../config/t_s_systemopentips";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import FUIHelper from "../../utils/FUIHelper";

export default class FunOpenItem extends FUI_FunOpenItem {
  // private funData: FunPreviewData;
  protected onConstruct(): void {
    super.onConstruct();
  }

  setData(data: t_s_systemopentipsData) {
    this.txt_desc.text = data.DescriptionLang;
    // this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, 'Img_Pre_Engrave');
    // return
    let url: string = "";
    this.loader.width = this.loader.height = 90;
    switch (data.Type) {
      case 1: //农场
        url = "Btn_MyFarm";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 2: //单人挑战
      case 11: //多人竞技
        url = "Btn_Eve_Arena";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Dialog, url);
        break;
      case 3: //悬赏
        url = "Btn_BountyCard";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 4: //多人副本
        url = "Btn_Eve_HallOfHeroes";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Dialog, url);
        break;
      case 5: //世界Boss
        url = "Btn_Eve_WorldBOSS";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 6: //地下迷宫
        url = "Img_Pre_Crypt";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 7: //占星
      case 10: //新星运槽
        url = "Btn_Main_Astro";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 8: //荣誉勋章
        url = "Btn_honor";
        this.loader.width = this.loader.height = 76;
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 9: //战场
        url = "Btn_Eve_Battle";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 12: //坐骑
        url = "Btn_Main_Mount";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 13: //符文
        url = "Btn_rune";
        this.loader.width = this.loader.height = 76;
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 14: //符孔
        url = "runegem_point";
        this.loader.width = this.loader.height = 76;
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 16: //跑环
        url = "Btn_Eve_Task";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 15: //灵魂刻印
        url = "Img_Pre_Engrave";
        this.loader.width = this.loader.height = 76;
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 17: //王者之塔
      case 22: //试炼之塔
        url = "Btn_Eve_HallOfHeroes";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 18: //英灵
      case 19: //英灵战役
      case 21: //英灵远征
      case 24: //英灵竞技
        url = "Btn_Main_Sylph";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 20: //兵种领悟
        url = "Img_Pre_Enlighten";
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 23: //天赋
        url = "Icon_Talents";
        this.loader.width = this.loader.height = 70;
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Base, url);
        break;
      case 25: //龙纹
        url = "Icon_Tattoo_Stats";
        this.loader.width = this.loader.height = 76;
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Base, url);
        break;
      case 26: //命运守护
        url = "Btn_FateGuardian";
        this.loader.width = this.loader.height = 70;
        this.loader.icon = FUIHelper.getItemURL(EmPackName.Home, url);
        break;
      case 27: //专精
        this.loader.icon = FUIHelper.getItemURL(
          EmPackName.Home,
          "Btn_Mastery_Stats",
        );
        break;
      case 28: //秘境
        this.loader.icon = FUIHelper.getItemURL(
          EmPackName.Home,
          "Btn_Main_Campaign",
        );
        break;
      case 29: //时装
        this.loader.icon = FUIHelper.getItemURL(
          EmPackName.Home,
          "Btn_Eve_Fashion",
        );
        break;
    }
  }
}
