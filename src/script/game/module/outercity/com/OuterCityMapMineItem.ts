//@ts-expect-error: External dependencies
import FUI_OuterCityMapMineItem from "../../../../../fui/OuterCity/FUI_OuterCityMapMineItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { t_s_mapmineData } from "../../../config/t_s_mapmine";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import OutCityMineNode from "../../../map/outercity/OutCityMineNode";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";

export default class OuterCityMapMineItem extends FUI_OuterCityMapMineItem {
  private _info: OutCityMineNode;
  protected onConstruct() {
    super.onConstruct();
    Utils.setDrawCallOptimize(this);
  }

  public set info(value: OutCityMineNode) {
    if (value) {
      this._info = value;
      this.refreshView();
    } else {
      this.mineNameTxt.text = "";
      this.hasCountTxt.text = "";
    }
  }

  private refreshView() {
    if (this._info) {
      let mapMineData: t_s_mapmineData = this.outercityModel.getNodeByNodeId(
        this._info.nodeId,
      );
      if (mapMineData) {
        let hasOccupyCount: number = this._info.occupyNum;
        let hasLeftCount: number =
          this._info.sonNodeTotalNum - this._info.allOccupyNum;
        let strName: string = LangManager.Instance.GetTranslation(
          "public.level3",
          mapMineData.Grade,
        );
        this.mineNameTxt.text = LangManager.Instance.GetTranslation(
          "OuterCityMapMineItem.mineLeftCountTxt",
          strName,
          hasLeftCount,
        );
        // this.mineNameTxt.text = LangManager.Instance.GetTranslation("public.level3", mapMineData.Grade);
        // let hasOccupyCount: number = this._info.occupyNum;
        // let hasLeftCount: number = this._info.sonNodeTotalNum - this._info.allOccupyNum;
        // this.mineLeftCountTxt.text = LangManager.Instance.GetTranslation("OuterCityMapMineItem.mineLeftCountTxt", hasLeftCount);
        this.hasCountTxt.text = LangManager.Instance.GetTranslation(
          "OuterCityMapMineItem.hasCountTxt",
          hasOccupyCount,
        );
      }
    }
  }

  private get outercityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  dispose() {
    super.dispose();
  }
}
