import FUI_EquipTipsContent from "../../../fui/Base/FUI_EquipTipsContent";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import LangManager from "../../core/lang/LangManager";
import { ArmyManager } from "../manager/ArmyManager";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { TempleteManager } from "../manager/TempleteManager";
import GoodsSonType from "../constant/GoodsSonType";
import { GoodsCheck } from "../utils/GoodsCheck";
import { BaseItem } from "../component/item/BaseItem";
import EquipTipsAttribute from "./EquipTipsAttribute";
import { ToolTipsManager } from "../manager/ToolTipsManager";
import { FashionManager } from "../manager/FashionManager";
import { GoodsManager } from "../manager/GoodsManager";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/17 15:15
 * @ver 1.0
 *
 */
export class EquipTipsContent extends FUI_EquipTipsContent {
  public item: BaseItem;
  public attributeInfo: EquipTipsAttribute;
  constructor() {
    super();
  }

  public set info(info: GoodsInfo) {
    //时装不需要展示属性了
    if (!this.isFashion(info.templateInfo)) {
      this.attributeInfo.info = info;
    } else {
      this.attributeInfo.visible = false;
    }
    this.attributeInfo.displayObject.name = "attributeInfo";
    this.clean();
    if (
      this.attributeInfo.height > this.attributeInfo.totalGroup.actualHeight
    ) {
      this.attributeInfo.height = this.attributeInfo.totalGroup.actualHeight;
    }
    this.initData(info, info.templateInfo);
  }

  protected initData(info: GoodsInfo, temp: t_s_itemtemplateData) {
    this.initBase(info, temp);
    this.initInlay(info);
  }

  protected initBase(info: GoodsInfo, temp: t_s_itemtemplateData) {
    this.item.info = info;
    this.item.isActive.selectedIndex = 0; //不显示时装和坐骑的已激活标识
    if (!GoodsManager.Instance.isEquip(temp)) {
      this.item.text = "";
    }
    this.txt_name.color = GoodsSonType.getColorByProfile(temp.Profile);
    if (this.isFashion(temp)) {
      this.txt_name.text = temp.TemplateNameLang;
      // this.txt_fashionLevel.visible = true;
      if (this.getFashionLevelByInfo(info) == 9) {
        this.txt_fashionLevel.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTipsContent.fashionFullLevel",
        );
      } else {
        this.txt_fashionLevel.text =
          this.getFashionLevelByInfo(info) +
          LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.EquipTipsContent.fashionLevel",
          );
      }
      //去除显示阶
      this.txt_fashionLevel.visible = false;
      this.txt_vocation.visible = false;
    } else {
      this.txt_name.text = temp.TemplateNameLang; // + this.getStrengthenGrade(info);//装备名字后面的+XX取消
      this.txt_fashionLevel.visible = false;
    }
    this.txt_vocation.text = temp.jobName;
    if (!GoodsCheck.isJobFix(this.thane, temp, false)) {
      this.txt_vocation.color = "#FF0000";
    }
    this.txt_type.text = temp.sonTypeName;
    this.txt_grade.text = LangManager.Instance.GetTranslation(
      "public.level4_space2",
      temp.NeedGrades,
    );
    if (!GoodsCheck.isGradeFix(this.thane, temp, false)) {
      this.txt_grade.color = "#FF0000";
    }
    ToolTipsManager.Instance.setMountActiveTxt(info, this.txt_bind);
  }

  private getStrengthenGrade(gInfo: GoodsInfo): string {
    return gInfo.strengthenGrade > 0 ? "+" + gInfo.strengthenGrade : "";
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private getFashionLevelByInfo(info: GoodsInfo): number {
    let skillId: number = info.randomSkill1;
    if (!TempleteManager.Instance.getSkillTemplateInfoById(info.randomSkill1)) {
      skillId = parseInt(info.templateInfo.DefaultSkill.split(",")[0]);
    }
    let cfg = TempleteManager.Instance.getSkillTemplateInfoById(skillId);
    if (cfg) {
      return cfg.Grades;
    }
    return 0;
  }

  private initInlay(info: GoodsInfo) {
    let index: number = 1;
    let key: string;
    let isFashion: boolean = this.isFashion(info.templateInfo);
    if (info.id == 0) {
      this.txt_bind.visible = false;
    } else {
      this.txt_bind.visible = true;
    }
    //	时装吞噬后, 需要在tips右侧新增已激活文字
    if (isFashion) {
      let booklist = FashionManager.Instance.fashionModel.bookList;
      if (info.templateInfo.TemplateId in booklist) {
        // if (booklist[info.templateInfo.TemplateId] == true) {
        this.txt_bind.text = LangManager.Instance.GetTranslation(
          "growthFundview.btn_active.title2",
        );
        this.txt_bind.color = "#39A82D";
        this.txt_bind.visible = true;
        // }
      }
    }
  }

  private isFashion(temp: t_s_itemtemplateData): boolean {
    //检测是否属于时装
    if (!temp) {
      return false;
    }
    if (
      temp.SonType == GoodsSonType.SONTYPE_WING ||
      temp.SonType == GoodsSonType.FASHION_CLOTHES ||
      temp.SonType == GoodsSonType.FASHION_HEADDRESS ||
      temp.SonType == GoodsSonType.FASHION_WEAPON
    ) {
      return true;
    }
    return false;
  }

  public clean() {
    this.txt_fashionLevel.visible = false;
  }

  dispose() {
    this.item.dispose();
    super.dispose();
  }
}
