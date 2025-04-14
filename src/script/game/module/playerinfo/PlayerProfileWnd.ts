//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { IconFactory } from "../../../core/utils/IconFactory";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { AppellView } from "../../avatar/view/AppellView";
import { t_s_appellData } from "../../config/t_s_appell";
import { t_s_honorequipData } from "../../config/t_s_honorequip";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { IconType } from "../../constant/IconType";
import { JobType } from "../../constant/JobType";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { TempleteManager } from "../../manager/TempleteManager";
import IconAvatarFrame from "../../map/space/view/physics/IconAvatarFrame";

/**
 * @description玩家资料界面
 * @author zhihua.zhou
 */
export class PlayerProfileWnd extends BaseWindow {
  private txt_name: fairygui.GBasicTextField;
  private txt_job: fairygui.GBasicTextField;
  private txt_consortia: fairygui.GBasicTextField;
  private txt_charm: fairygui.GBasicTextField;
  private txt_honor: fairygui.GBasicTextField;
  private txt_svr: fairygui.GBasicTextField;
  private txt_title: fairygui.GBasicTextField;
  private txt_lv: fairygui.GBasicTextField;
  private txt_honorName: fairygui.GBasicTextField;
  public icon_head: IconAvatarFrame;
  protected _honerView: AppellView;

  public OnInitWind() {
    super.OnInitWind();

    this.setCenter();
    let thane = this.frameData as ThaneInfo;
    this.txt_name.text = thane.nickName;
    this.txt_job.text = JobType.getJobName(thane.job);
    this.txt_consortia.text = thane.consortiaName
      ? thane.consortiaName
      : LangManager.Instance.GetTranslation(
          "armyII.viewII.attribute.PlayerAttributeView.Not",
        );
    this.txt_charm.text = thane.charms.toString();
    this.txt_honor.text = " " + thane.honer.toString() + "/";
    let stage = thane.honorEquipStage;
    let cfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      1,
      stage,
    );
    if (cfg) {
      this.txt_honorName.text = cfg.HonorequipnameLang;
    }
    this.txt_svr.text = thane.serviceName;
    let appellData: t_s_appellData =
      TempleteManager.Instance.getAppellInfoTemplateByID(
        thane.appellId,
      ) as t_s_appellData;
    if (appellData) {
      this._honerView = new AppellView(
        appellData.ImgWidth,
        appellData.ImgHeight,
        thane.appellId,
      );
      this._honerView.x = this.txt_title.x;
      this._honerView.y = this.txt_title.y;
      this._honerView.fixOffset(this.txt_title.initHeight);
      this._honerView.visible = true;
      this.txt_title.visible = false;
      this.contentPane.displayObject.addChild(this._honerView);
    } else {
      this.txt_title.text = LangManager.Instance.GetTranslation(
        "armyII.viewII.attribute.PlayerAttributeView.Not",
      );
      if (this._honerView) this._honerView.visible = false;
      this.txt_title.visible = true;
    }

    this.txt_title.text = thane.appellInfo
      ? thane.appellInfo.TitleLang
      : LangManager.Instance.GetTranslation(
          "armyII.viewII.attribute.PlayerAttributeView.Not",
        );
    if (thane) {
      this.txt_lv.text = thane.grades.toString();
    } else {
      this.txt_lv.text = "0";
    }
    this.icon_head.headId = thane.headId;
    if (thane.frameId > 0) {
      let itemData: t_s_itemtemplateData =
        TempleteManager.Instance.getGoodsTemplatesByTempleteId(thane.frameId);
      if (itemData) {
        this.icon_head.headFrame = itemData.Avata;
        this.icon_head.headEffect =
          Number(itemData.Property1) == 1 ? itemData.Avata : "";
      }
    } else {
      this.icon_head.headFrame = "";
      this.icon_head.headEffect = "";
    }
    // PlayerManager.Instance.addEventListener(RequestInfoEvent.REQUEST_SIMPLEANDSNS_INFO, this.__requestFriendInfoHandler, this);
    // PlayerManager.Instance.sendRequestSimpleAndSnsInfo(thane.userId, RequestInfoRientation.SHOW_INFO);
  }

  // private __requestFriendInfoHandler(orientation:number, pInfo:FriendItemCellInfo){
  //     this.icon_head.url = IconFactory.getPlayerIcon(pInfo.snsInfo.headId, IconType.HEAD_ICON);
  // }

  dispose() {
    // PlayerManager.Instance.removeEventListener(RequestInfoEvent.REQUEST_SIMPLEANDSNS_INFO, this.__requestFriendInfoHandler, this);
    if (this._honerView) {
      ObjectUtils.disposeObject(this._honerView);
      this._honerView = null;
    }
    super.dispose();
  }
}
