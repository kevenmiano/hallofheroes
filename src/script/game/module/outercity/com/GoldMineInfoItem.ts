//@ts-expect-error: External dependencies
import FUI_GoldMineInfoItem from "../../../../../fui/OuterCity/FUI_GoldMineInfoItem";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import StringHelper from "../../../../core/utils/StringHelper";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_mapmineData } from "../../../config/t_s_mapmine";
import { t_s_mapphysicpositionData } from "../../../config/t_s_mapphysicposition";
import ColorConstant from "../../../constant/ColorConstant";
import { ConfigType } from "../../../constant/ConfigDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { OuterCitySocketOutManager } from "../../../manager/OuterCitySocketOutManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import { WildLand } from "../../../map/data/WildLand";
import OutCityOneMineInfo from "../../../map/outercity/OutCityOneMineInfo";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";

export default class GoldMineInfoItem extends FUI_GoldMineInfoItem {
  private _info: OutCityOneMineInfo;
  private _position: string;
  private _mapMineData: t_s_mapmineData;
  private _wild: WildLand;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.addEvent();
  }

  private addEvent() {
    this.attackBtn.onClick(this, this.attackBtnHandler);
    this.giveUpLink.onClick(this, this.giveUpHandler);
  }

  private removeEvent() {
    this.attackBtn.offClick(this, this.attackBtnHandler);
    this.giveUpLink.offClick(this, this.giveUpHandler);
  }

  private giveUpHandler() {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let nameStr: string = LangManager.Instance.GetTranslation(
      "public.level3",
      this._mapMineData.Grade,
    );
    let content: string;
    let mapData: t_s_mapphysicpositionData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_mapphysicposition,
      this._info.posId.toString(),
    );
    if (mapData) {
      content = LangManager.Instance.GetTranslation(
        "MyGoldInfoItem.giveUpBtn.confirmTips",
        mapData.NameLang,
        nameStr,
      );
    }
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.confirmHandler.bind(this),
    );
  }

  private confirmHandler(b: boolean, flag: boolean) {
    if (b) {
      OuterCitySocketOutManager.removeMine(
        this._position,
        this._info.nodeId,
        this._info.sonNodeId,
      );
    }
  }

  private attackBtnHandler() {
    if (
      !StringHelper.isNullOrEmpty(this._wild.info.occupyLeagueName) &&
      this._wild.info.occupyLeagueName !=
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaName
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("GoldMineInfoView.descTxt4"),
      );
      return;
    }
    if (this.outerCityModel.checkPlayerOccpuyNumberIsMax()) {
      //玩家占领总数量达到上限
      if (SharedManager.Instance.outercityAttackTotalNeedTips) {
        //需要提示
        let content: string = LangManager.Instance.GetTranslation(
          "GoldMineInfoItem.attackAllTips",
        );
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
          content: content,
          backFunction: this.attackAllConfirmHandler.bind(this),
          closeFunction: null,
          state: 2,
        });
      } else {
        this.attackOperation();
      }
    } else {
      //总数量没有达到上限
      if (
        this.outerCityModel.occupyCount(this._wild) >=
        this._wild.tempInfo.Property1
      ) {
        //在这个矿点达到上限了不能占领
        if (SharedManager.Instance.outercityAttackCurrentNeedTips) {
          //需要提示
          let content: string = LangManager.Instance.GetTranslation(
            "GoldMineInfoItem.attackCurrentTips",
          );
          UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
            content: content,
            backFunction: this.attackCurrentConfirmHandler.bind(this),
            closeFunction: null,
            state: 2,
          });
        } else {
          this.attackOperation();
        }
      } else {
        this.attackOperation();
      }
    }
  }

  private attackAllConfirmHandler(b: boolean, useBind: boolean) {
    SharedManager.Instance.outercityAttackTotalNeedTips = !b;
    this.attackOperation();
  }

  private attackCurrentConfirmHandler(b: boolean, useBind: boolean) {
    SharedManager.Instance.outercityAttackCurrentNeedTips = !b;
    this.attackOperation();
  }

  private attackOperation() {
    let posX = 0;
    let posY = 0;
    if (this.outerCityModel.currentSelectMine) {
      posX = this.outerCityModel.currentSelectMine.posX;
      posY = this.outerCityModel.currentSelectMine.posY;
    }
    OuterCitySocketOutManager.sendAttackMine(
      this.outerCityModel.mapId,
      posX,
      posY,
      this._info.nodeId,
      this._info.sonNodeId,
    );
  }

  public set info(value: OutCityOneMineInfo) {
    this._info = value;
    if (this._info) {
      this.refreshView();
    } else {
      this.goldNameTxt.text = "";
      this.userNameTxt.text = "";
      this.giveUpLink.visible = false;
      this.attackBtn.visible = false;
    }
  }

  public set wild(value: WildLand) {
    this._wild = value;
    this._position = this._wild.posX + "," + this._wild.posY;
  }

  private refreshView() {
    if (this._info) {
      if (this._info.occupyPlayerId != 0) {
        this.userNameTxt.text = this._info.playerName;
        if (this.outerCityModel.checkIsSameConsortiaById(this._info.guildId)) {
          this.userNameTxt.color = ColorConstant.GREEN_COLOR;
        } else {
          this.userNameTxt.color = ColorConstant.RED_COLOR;
        }
        if (this._info.sort == 1) {
          this.isself.selectedIndex = 0;
        } else {
          this.isself.selectedIndex = 1;
        }
      } else {
        this.userNameTxt.text =
          LangManager.Instance.GetTranslation("public.notHave");
        this.userNameTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
        this.isself.selectedIndex = 1;
      }
      this._mapMineData = this.outerCityModel.getNodeByNodeId(
        this._info.nodeId,
      );
      if (this._mapMineData) {
        this.goldNameTxt.text = LangManager.Instance.GetTranslation(
          "public.level3",
          this._mapMineData.Grade,
        );
      }
    }
  }

  private get outerCityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
