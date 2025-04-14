//@ts-expect-error: External dependencies
import FUI_OutercityPersonItem from "../../../../../fui/OuterCity/FUI_OutercityPersonItem";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { JobType } from "../../../constant/JobType";
import { TempleteManager } from "../../../manager/TempleteManager";
import VehiclePlayerInfo from "../../../map/data/VehiclePlayerInfo";

export default class OutercityPersonItem extends FUI_OutercityPersonItem {
  private _info: VehiclePlayerInfo;

  public headIcon: IconAvatarFrame;
  protected onConstruct() {
    super.onConstruct();
  }

  public set info(value: VehiclePlayerInfo) {
    if (value) {
      //有人员
      this._info = value;
      this.refreshView();
    } else {
      //无人员
      this.c1.selectedIndex = 0;
    }
  }

  private refreshView() {
    this.c1.selectedIndex = 1;
    if (this._info.headId == 0) {
      //说明没修改过头像, 使用默认头像
      this.headIcon.headId = this._info.job;
    } else {
      this.headIcon.headId = this._info.headId;
    }
    if (this._info.frameId > 0) {
      let itemData: t_s_itemtemplateData =
        TempleteManager.Instance.getGoodsTemplatesByTempleteId(
          this._info.frameId,
        );
      if (itemData) {
        this.headIcon.headFrame = itemData.Avata;
        this.headIcon.headEffect =
          Number(itemData.Property1) == 1 ? itemData.Avata : "";
      }
    } else {
      this.headIcon.headFrame = "";
      this.headIcon.headEffect = "";
    }
    this.jobIcon.url = JobType.getJobIcon(this._info.job);
    this.txtLevel.text = this._info.grade + "";
    this.playerNameTxt.text = this._info.nickName;
  }

  dispose() {
    super.dispose();
  }
}
