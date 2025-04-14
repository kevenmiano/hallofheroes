import FUI_SevenGoalsTaskItem from "../../../../fui/SevenTarget/FUI_SevenGoalsTaskItem";
import AudioManager from "../../../core/audio/AudioManager";
import LangManager from "../../../core/lang/LangManager";
import { UIFilter } from "../../../core/ui/UIFilter";
import UIManager from "../../../core/ui/UIManager";
import StringHelper from "../../../core/utils/StringHelper";
import Utils from "../../../core/utils/Utils";
import { BaseItem } from "../../component/item/BaseItem";
import { t_s_seventargetData } from "../../config/t_s_seventarget";
import OpenGrades from "../../constant/OpenGrades";
import { SoundIds } from "../../constant/SoundIds";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { MopupManager } from "../../manager/MopupManager";
import { PlayerManager } from "../../manager/PlayerManager";
import SevenGoalsManager from "../../manager/SevenGoalsManager";
import { TaskManage } from "../../manager/TaskManage";
import { TempleteManager } from "../../manager/TempleteManager";
import BuildingManager from "../../map/castle/BuildingManager";
import BuildingType from "../../map/castle/consant/BuildingType";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import SpaceNodeType from "../../map/space/constant/SpaceNodeType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import SevenTaskInfo from "../welfare/data/SevenTaskInfo";
import SevenGoalsModel from "./SevenGoalsModel";

/**任务项 */
export default class SevenGoalsTaskItem extends FUI_SevenGoalsTaskItem {
  private _info: SevenTaskInfo;
  private _goodsArr: Array<GoodsInfo>;
  private sevenData: t_s_seventargetData;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
  }

  private initEvent() {
    this.getRewardBtn.onClick(this, this.getRewardBtnHandler);
    this.gotoBtn.onClick(this, this.gotoBtnHandler);
    Utils.setDrawCallOptimize(this.goodsList);
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.renderGoodsListItem,
      null,
      false,
    );
  }

  private removeEvent() {
    this.getRewardBtn.offClick(this, this.getRewardBtnHandler);
    this.gotoBtn.offClick(this, this.gotoBtnHandler);
  }

  /**每日宝箱 */
  renderGoodsListItem(index: number, item: BaseItem) {
    item.info = this._goodsArr[index];
    if (this.sevenData.Day < this.sevenGoalsModel.sevenCurrentDay) {
      //选中的是之前的天数
      if (this.sevenGoalsModel.tabValue == 0) {
        //选中的tab是成长任务
        UIFilter.normal(item);
        item.enabled = true;
      } else {
        UIFilter.gray(item);
        item.enabled = false;
      }
    } else {
      UIFilter.normal(item);
      item.enabled = true;
    }
  }

  private getRewardBtnHandler() {
    if (this._info) {
      AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
      SevenGoalsManager.Instance.getTaskReward(this._info.taskId);
    }
  }

  public set info(value: SevenTaskInfo) {
    this._info = value;
    UIFilter.normal(this);
    UIFilter.normal(this.goodsList.displayObject);
    this.getRewardBtn.enabled = true;
    this.refreshView();
  }

  private refreshView() {
    if (this._info) {
      this.sevenData = TempleteManager.Instance.getSevenTaskByTaskId(
        this._info.taskId,
      );
      if (this.sevenData) {
        this.pointValueTxt.text = this.sevenData.Num.toString();
        this.DescTxt.text = this.sevenData.TitleLang;
        if (
          this.sevenGoalsModel.sevenNotNeedProgressTypeArr.indexOf(
            this.sevenData.Type,
          ) != -1
        ) {
          this.countTxt.text = "";
        } else {
          this.countTxt.text =
            "(" + this._info.finishNum + "/" + this.sevenData.Para1 + ")";
        }
        this._goodsArr = this.getGoodsArray(this.sevenData);
        //非滚动列表, 不需要设置虚拟
        this.goodsList.numItems = this._goodsArr.length;
        this.c1.selectedIndex = this._info.status - 1;
        if (this._info.status == 2) {
          //未完成
          if (this.sevenData.Day < this.sevenGoalsModel.sevenCurrentDay) {
            //选中的是之前的天数
            if (this.sevenGoalsModel.tabValue == 0) {
              //选中的tab是成长任务
              this.c1.selectedIndex = 4;
            }
          } else {
            this.c1.selectedIndex = 4;
          }
        }
      }
    }
  }

  private getGoodsArray(sevenData: t_s_seventargetData): Array<GoodsInfo> {
    let strArr: Array<string> = sevenData.Item.split("|");
    var goodsArr: Array<GoodsInfo> = [];
    if (strArr) {
      let len = strArr.length;
      let goods: GoodsInfo;
      let strItem: string;
      for (let i = 0; i < len; i++) {
        strItem = strArr[i];
        if (!StringHelper.isNullOrEmpty(strItem)) {
          goods = new GoodsInfo();
          goods.templateId = Number(strItem.split(",")[0]);
          goods.count = Number(strItem.split(",")[1]);
          goodsArr.push(goods);
        }
      }
    }
    return goodsArr;
  }

  private get sevenGoalsModel(): SevenGoalsModel {
    return SevenGoalsManager.Instance.sevenGoalsModel;
  }

  private exitMainFrame() {
    FrameCtrlManager.Instance.exit(EmWindow.SevenGoalsWnd);
  }

  private gotoBtnHandler() {
    switch (this.sevenData.Type) {
      case 1:
      case 14:
      case 23:
      case 44:
      case 47:
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.PveCampaignWnd);
        break;
      case 2:
      case 26:
      case 64:
        this.exitMainFrame();
        if (
          PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0
        ) {
          FrameCtrlManager.Instance.open(EmWindow.ConsortiaApply);
        } else {
          FrameCtrlManager.Instance.open(EmWindow.Consortia);
        }
        break;
      case 3:
        this.exitMainFrame();
        if (this.sevenData.Para2 == 3) {
          //仓库
          UIManager.Instance.ShowWind(
            EmWindow.DepotWnd,
            BuildingManager.Instance.model.getBuildingInfoBySonType(
              BuildingType.WAREHOUSE,
            ),
          );
        } else if (this.sevenData.Para2 == 1) {
          //精炼炉
          UIManager.Instance.ShowWind(
            EmWindow.CrystalWnd,
            BuildingManager.Instance.model.getBuildingInfoBySonType(
              BuildingType.CRYSTALFURNACE,
            ),
          );
        }
        break;
      case 4:
      case 39:
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(
          EmWindow.CasernWnd,
          BuildingManager.Instance.model.getBuildingInfoBySonType(
            BuildingType.CASERN,
          ),
        );
        break;
      case 5:
      case 9:
      case 15:
      case 36:
        if (ArmyManager.Instance.thane.grades < OpenGrades.STAR) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.STAR,
            ),
          );
          return;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.Star);
        break;
      case 6:
      case 7:
      case 10:
      case 41:
      case 50:
      case 55:
      case 61:
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.Forge);
        break;
      case 11:
      case 17:
      case 40:
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.Skill);
        break;
      case 12:
      case 20:
        if (ArmyManager.Instance.thane.grades < OpenGrades.MOUNT) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.MOUNT,
            ),
          );
          return;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.MountsWnd);
        break;
      case 16:
      case 52:
      case 65:
      case 71:
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.PvpGate);
        break;
      case 18:
        if (ArmyManager.Instance.thane.grades < OpenGrades.TALENT) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.TALENT,
            ),
          );
          return;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.Skill);
        break;
      case 19:
      case 79:
      case 81:
        if (ArmyManager.Instance.thane.grades < OpenGrades.PET) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.PET,
            ),
          );
          return;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.Pet);
        break;
      case 21:
      case 22:
      case 37:
      case 45:
      case 56:
      case 62:
      case 63:
      case 68:
      case 73:
      case 75:
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.SRoleWnd);
        break;
      case 38:
        if (ArmyManager.Instance.thane.grades < OpenGrades.MAZE) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.MAZE,
            ),
          );
          return true;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.MazeFrameWnd);
        break;
      case 42:
      case 67:
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.FriendWnd);
        break;
      case 43:
      case 46:
      case 69:
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.Farm);
        break;
      case 48:
      case 59:
      case 74:
        let str: string;
        if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
          str = LangManager.Instance.GetTranslation(
            "mainBar.MainToolBar.command01",
          );
          MessageTipManager.Instance.show(str);
          return;
        }
        if (!TaskManage.Instance.IsTaskFinish(TaskManage.SETARMY_TASK)) {
          str = LangManager.Instance.GetTranslation("newbie.needfinishTask");
          MessageTipManager.Instance.show(str);
          return;
        }
        this.exitMainFrame();
        SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE);
        break;
      case 49:
      case 57:
        this.exitMainFrame();
        UIManager.Instance.ShowWind(
          EmWindow.SeminaryWnd,
          BuildingManager.Instance.model.getBuildingInfoBySonType(
            BuildingType.SEMINARY,
          ),
        );
        break;
      case 53:
      case 60:
        if (ArmyManager.Instance.thane.grades < OpenGrades.WORLD_BOSS) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.WORLD_BOSS,
            ),
          );
          return true;
        }
        if (MopupManager.Instance.model.isMopup) {
          let str: string = LangManager.Instance.GetTranslation(
            "mopup.MopupManager.mopupTipData01",
          );
          MessageTipManager.Instance.show(str);
          return;
        }
        if (ArmyManager.Instance.army.onVehicle) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "OuterCityCastleTips.gotoBtnTips",
            ),
          );
          return;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.WorldBossWnd);
        break;
      case 51:
        this.exitMainFrame();
        UIManager.Instance.ShowWind(EmWindow.OfferRewardWnd);
        break;
      case 54:
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 0 });
        break;
      case 58:
      case 66:
        if (ArmyManager.Instance.thane.grades < OpenGrades.RVR) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.RVR,
            ),
          );
          return true;
        }
        if (MopupManager.Instance.model.isMopup) {
          let str: string = LangManager.Instance.GetTranslation(
            "mopup.MopupManager.mopupTipData01",
          );
          MessageTipManager.Instance.show(str);
          return;
        }
        if (ArmyManager.Instance.army.onVehicle) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "OuterCityCastleTips.gotoBtnTips",
            ),
          );
          return;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.RvrBattleWnd);
        break;
      case 77:
      case 78:
        if (ArmyManager.Instance.thane.grades < OpenGrades.RUNE_OPEN) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.RUNE_OPEN,
            ),
          );
          return true;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.Skill);
        break;
      case 70:
        if (!this.checkScene()) return;
        this.exitMainFrame();
        SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_RING_TASK);
        break;
      case 72:
        if (ArmyManager.Instance.thane.grades < OpenGrades.HOOK) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.HOOK,
            ),
          );
          return true;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.Hook);
        break;
      case 76:
        if (ArmyManager.Instance.thane.grades < OpenGrades.MYSTERIOUS) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "armyII.SkillFrame.AlertMsg",
              OpenGrades.MYSTERIOUS,
            ),
          );
          return true;
        }
        this.exitMainFrame();
        FrameCtrlManager.Instance.open(EmWindow.OuterCityShopWnd);
        break;
      case 80:
        if (!this.checkScene()) return;
        this.exitMainFrame();
        SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PET_LAND);
        break;
      case 82:
        if (!this.checkScene()) return;
        this.exitMainFrame();
        SwitchPageHelp.goSpaceAndFind(SpaceNodeType.PET_CAMPAIGN);
        break;
      case 83:
        this.exitMainFrame();
        UIManager.Instance.ShowWind(
          EmWindow.PoliticsFrameWnd,
          BuildingManager.Instance.model.getBuildingInfoBySonType(
            BuildingType.OFFICEAFFAIRS,
          ),
        );
        break;
    }
  }

  private checkScene(): boolean {
    return SwitchPageHelp.checkScene();
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
