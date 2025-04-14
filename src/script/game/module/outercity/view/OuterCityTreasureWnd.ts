//@ts-expect-error: External dependencies
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import ResMgr from "../../../../core/res/ResMgr";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { MovieClip } from "../../../component/MovieClip";
import { t_s_mapphysicpositionData } from "../../../config/t_s_mapphysicposition";
import ColorConstant from "../../../constant/ColorConstant";
import { ConfigType } from "../../../constant/ConfigDefine";
import {
  NotificationEvent,
  OuterCityEvent,
} from "../../../constant/event/NotificationEvent";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { AnimationManager } from "../../../manager/AnimationManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { PathManager } from "../../../manager/PathManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { WildLand } from "../../../map/data/WildLand";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
/**
 * 外城宝藏矿脉详情界面
 */
export default class OuterCityTreasureWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public battleBtn: fgui.GButton;
  public consortiaNamext: fgui.GTextField;
  public resouceAddPrecentTxt: fgui.GTextField;
  public statusTxt: fgui.GTextField;
  public timeTxt: fgui.GTextField;
  public consortiaGroup: fgui.GGroup;
  private _wildLand: WildLand;
  private _countDown: number = 0; //倒计时
  private _outercityModel: OuterCityModel;
  private _treasureMovieClip: MovieClip;
  private _path: string;
  private _preUrl: string;
  private _cacheName: string;
  public isShowAttack: fgui.Controller;
  private _playerModel: PlayerModel;
  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.initEvent();
    this.initView();
    this.setCenter();
  }

  private initData() {
    this.isShowAttack = this.getController("isShowAttack");
    this._playerModel = PlayerManager.Instance.currentPlayerModel;
    this._wildLand = this.frameData as WildLand;
    this._outercityModel = OuterCityManager.Instance.model;
    let path: string = PathManager.solveMapPhysicsBySonType(
      this._wildLand.tempInfo.SonType,
    );
    this.updateAvatar(path);
    let tempInfo: t_s_mapphysicpositionData =
      ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_mapphysicposition,
        this._wildLand.templateId,
      );
    if (tempInfo) {
      let add = tempInfo.Property1;
      this.resouceAddPrecentTxt.text = LangManager.Instance.GetTranslation(
        "OuterCityMapTreasureTips.resouceAddTxt",
        add,
      );
    }
    this.frame.getChild("title").text = this._wildLand.tempInfo.NameLang;
  }

  private initEvent() {
    this.battleBtn.onClick(this, this.onBtnOperateClick);
    if (this._outercityModel)
      this._outercityModel.addEventListener(
        OuterCityEvent.CURRENT_WILD_LAND,
        this.updateOccupyPlayerName,
        this,
      );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.UPDATE_TREASURE_INFO,
      this.initView,
      this,
    );
    if (this._playerModel)
      this._playerModel.addEventListener(
        NotificationEvent.UPDATE_SYSTEM_TIME,
        this.updateTimeView,
        this,
      );
  }

  private removeEvent() {
    this.battleBtn.offClick(this, this.onBtnOperateClick);
    if (this._outercityModel)
      this._outercityModel.removeEventListener(
        OuterCityEvent.CURRENT_WILD_LAND,
        this.updateOccupyPlayerName,
        this,
      );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.UPDATE_TREASURE_INFO,
      this.initView,
      this,
    );
    if (this._playerModel)
      this._playerModel.removeEventListener(
        NotificationEvent.UPDATE_SYSTEM_TIME,
        this.updateTimeView,
        this,
      );
  }

  private updateAvatar(path: string) {
    if (this._path == path) {
      return;
    }
    this._path = path;
    ResMgr.Instance.loadRes(
      this._path,
      (res) => {
        this.loaderCompleteHandler(res);
      },
      null,
      Laya.Loader.ATLAS,
    );
  }

  private loaderCompleteHandler(res: any) {
    if (this._treasureMovieClip) {
      this._treasureMovieClip.stop();
      this._treasureMovieClip.parent &&
        this._treasureMovieClip.parent.removeChild(this._treasureMovieClip);
    }
    if (!res) {
      return;
    }
    this._preUrl = res.meta.prefix;
    this._cacheName = this._preUrl;
    let aniName = "";
    AnimationManager.Instance.createAnimation(
      this._preUrl,
      aniName,
      undefined,
      "",
      AnimationManager.MapPhysicsFormatLen,
    );
    this._treasureMovieClip = new MovieClip(this._cacheName);
    this.addChild(this._treasureMovieClip);
    this._treasureMovieClip.gotoAndStop(1);
    let frames = res.frames;
    let offsetX: number = 0;
    let offsetY: number = 0;
    if (res.offset) {
      let offset = res.offset;
      offsetX = offset.footX;
      offsetY = offset.footY;
    }
    let sourceSize = new Laya.Rectangle();
    for (let key in frames) {
      if (Object.prototype.hasOwnProperty.call(frames, key)) {
        let sourceItem = frames[key].sourceSize;
        sourceSize.width = sourceItem.w;
        sourceSize.height = sourceItem.h;
        break;
      }
    }
    this._treasureMovieClip.scale(0.8, 0.8);
    this._treasureMovieClip.x = 55;
    this._treasureMovieClip.y = 100;
    this._treasureMovieClip.gotoAndPlay(1, true);
  }

  private updateOccupyPlayerName() {
    if (this._wildLand.info.occupyLeagueName == "") {
      this.consortiaNamext.text = LangManager.Instance.GetTranslation(
        "maze.MazeFrame.Order",
      );
    } else {
      this.consortiaNamext.text = this._wildLand.info.occupyLeagueName;
    }
    if (this.playerModel.treasureState == OuterCityModel.TREASURE_STATE3) {
      //争夺期间
      if (this._wildLand.info.occupyLeagueConsortiaId == 0) {
        //没人占领, 攻击
        this.isShowAttack.selectedIndex = 1;
      } else if (this._wildLand.info.occupyLeagueConsortiaId > 0) {
        //有人占领
        if (
          this._wildLand.info.occupyLeagueConsortiaId != this.thane.consortiaID
        ) {
          //不是自己公会的
          this.isShowAttack.selectedIndex = 1;
        } else if (
          this._wildLand.info.occupyLeagueConsortiaId == this.thane.consortiaID
        ) {
          this.isShowAttack.selectedIndex = 0;
        }
      }
    } else {
      this.isShowAttack.selectedIndex = 0;
    }
  }

  private initView() {
    this.updateOccupyPlayerName();
    this.statusTxt.text = LangManager.Instance.GetTranslation(
      "consortia.view.myConsortia.activity.ConsortiaActivityListView.consortiaTreasure" +
        this.playerModel.treasureState,
    );
    if (this.playerModel.treasureState == OuterCityModel.TREASURE_STATE1) {
      this.statusTxt.color = this.timeTxt.color = ColorConstant.BLUE_COLOR;
    } else if (
      this.playerModel.treasureState == OuterCityModel.TREASURE_STATE2
    ) {
      this.statusTxt.color = this.timeTxt.color = ColorConstant.GREEN_COLOR;
    } else {
      this.statusTxt.color = this.timeTxt.color = ColorConstant.RED_COLOR;
    }

    let curTime: number =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond; //当前时间
    let endTime: number = this.playerModel.stateEndTime; //截止时间
    this._countDown = endTime - curTime; //剩余的秒数

    if (this._countDown > 0) {
      this.timeTxt.text =
        "(" + DateFormatter.getConsortiaCountDate(this._countDown) + ")";
      Laya.timer.loop(1000, this, this.updateCountDown);
    } else {
      Laya.timer.clear(this, this.updateCountDown);
      this.timeTxt.text = "";
    }
  }

  private updateCountDown() {
    this._countDown--;
    if (this._countDown > 0) {
      this.timeTxt.text =
        "(" + DateFormatter.getConsortiaCountDate(this._countDown) + ")";
    } else {
      this.timeTxt.text = "";
      Laya.timer.clear(this, this.updateCountDown);
    }
  }

  private updateTimeView() {
    let curTime: number =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond; //当前时间
    let endTime: number = this.playerModel.stateEndTime; //截止时间
    this._countDown = endTime - curTime; //剩余的秒数
  }

  private onBtnOperateClick() {
    if (this.playerModel.treasureState != OuterCityModel.TREASURE_STATE3) {
      return;
    }
    OuterCityManager.Instance.controler.sendAttack(
      this._wildLand.posX,
      this._wildLand.posY,
    );
    this.hide();
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._wildLand = null;
    if (this._treasureMovieClip) {
      this._treasureMovieClip.stop();
      this._treasureMovieClip = null;
    }
    Laya.timer.clear(this, this.updateCountDown);
    super.dispose(dispose);
  }
}
