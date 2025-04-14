import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { t_s_runeholeData } from "../../../config/t_s_runehole";
import { ConfigType } from "../../../constant/ConfigDefine";
import { TempleteManager } from "../../../manager/TempleteManager";
import { RuneHoleHelpItem } from "./RuneHoleHelpItem";
/**
 * @description 符孔组合帮助说明
 */
export default class RuneHoleHelpWnd extends BaseWindow {
  private list: fairygui.GList;
  private listData: Array<t_s_runeholeData>;

  public OnInitWind() {
    this.setCenter();

    let title = LangManager.Instance.GetTranslation("runeGem.review");

    this.txtFrameTitle.text = title;

    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem1,
      null,
      false,
    );
    this.listData = [];
    let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_runehole);
    for (const dicKey in templateDic) {
      if (templateDic.hasOwnProperty(dicKey)) {
        let temp: t_s_runeholeData = templateDic[dicKey];
        if (temp.Length > 3) {
          this.listData.push(temp);
        }
      }
    }

    this.list.numItems = this.listData.length;
  }

  private onRenderListItem1(index: number, item: RuneHoleHelpItem) {
    if (item) {
      item.info = this.listData[index];
    }
  }

  confirmBtnClick() {
    super.OnBtnClose();
  }

  dispose() {
    super.dispose();
  }
}
