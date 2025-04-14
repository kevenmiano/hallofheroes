import AudioManager from "../../core/audio/AudioManager";
import LangManager from "../../core/lang/LangManager";
import Dictionary from "../../core/utils/Dictionary";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { GlobalConfig } from "../constant/GlobalConfig";
import { SoundIds } from "../constant/SoundIds";
import { EmWindow } from "../constant/UIDefine";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { CampaignManager } from "../manager/CampaignManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { PlayerManager } from "../manager/PlayerManager";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import KeyboardManager from "./KeyboardManager";
import KeyStroke from "./KeyStroke";

export default class KeyBoardRegister {
  private static _instance: KeyBoardRegister;
  public battleFlag: boolean;

  public static get Instance(): KeyBoardRegister {
    if (!this._instance) {
      this._instance = new KeyBoardRegister();
    }
    return this._instance;
  }

  constructor() {}

  public get keyEnable(): boolean {
    return this._enableCount >= 0;
  }

  private _enableCount: number;

  public set keyEnable(value: boolean) {
    value ? this._enableCount++ : this._enableCount--;
    this._enableCount > 0 ? (this._enableCount = 0) : this._enableCount;
  }

  public functionEnable: boolean = true;
  public vehicleFlag: boolean = false;

  public setup() {
    KeyboardManager.Instance.addEventListener(
      Laya.Event.KEY_DOWN,
      this.__keyDownHandler,
      this,
    );
    KeyboardManager.Instance.addEventListener(
      Laya.Event.KEY_UP,
      this.__keyUpHandler,
      this,
    );
  }

  private _downKeys: Dictionary = new Dictionary();

  private __keyUpHandler(evt: Laya.Event) {
    this._downKeys[evt.keyCode] = false;
  }

  getTimer(): number {
    return new Date().getTime();
  }

  private __keyDownHandler(evt: Laya.Event) {
    var obj = this._downKeys[evt.keyCode];
    var time: number = this.getTimer();
    if (obj && obj.time) {
      var pre: number = Number(obj.time);
      if (time - pre < 30000) {
        return;
      }
    }
    this._downKeys[evt.keyCode] = { time: time };
    switch (evt.keyCode) {
      case KeyStroke.VK_L.getCode():
        this.showTask();
        break;
      case KeyStroke.VK_B.getCode():
        this.showEquip();
        break;
      case KeyStroke.VK_M.getCode():
        this.showMap();
        break;
      case KeyStroke.VK_F.getCode():
        this.showFriend();
        break;
      case KeyStroke.VK_G.getCode():
        this.showConsortia();
        break;
      case KeyStroke.VK_A.getCode():
        this.showPawn();
        break;
      case KeyStroke.VK_T.getCode():
        this.showStore();
        break;
      case KeyStroke.VK_O.getCode():
        this.showStop();
        break;
      case KeyStroke.VK_S.getCode():
        this.showSkill();
        break;
      case KeyStroke.VK_H.getCode():
        this.showStar();
        break;
      case KeyStroke.VK_ESCAPE.getCode():
        this.showSetting();
        break;
      case KeyStroke.VK_Z.getCode():
        this.showCampaign();
        break;
        break;
      case KeyStroke.VK_P.getCode():
        this.showMount();
        break;
      case KeyStroke.VK_Y.getCode():
        this.showPet();
        break;
      case KeyStroke.VK_Q.getCode():
        this.showInnerOrOuterCity();
        break;
    }
  }

  private _leftFunction: Function;
  private _rightFunction: Function;
  private _topFunction: Function;
  private _downFunction: Function;

  public registerMapKey(
    left: Function,
    right: Function,
    top: Function,
    down: Function,
  ) {
    this._leftFunction = left;
    this._rightFunction = right;
    this._topFunction = top;
    this._downFunction = down;
    KeyboardManager.Instance.registerKeyAction(
      KeyStroke.VK_LEFT,
      this.__leftKeyDownHandler.bind(this),
    );
    KeyboardManager.Instance.registerKeyAction(
      KeyStroke.VK_RIGHT,
      this.__rightKeyDownHandler.bind(this),
    );
    KeyboardManager.Instance.registerKeyAction(
      KeyStroke.VK_UP,
      this.__topKeyDownHandler.bind(this),
    );
    KeyboardManager.Instance.registerKeyAction(
      KeyStroke.VK_DOWN,
      this.__downKeyDownHandler.bind(this),
    );
  }

  public removeMapKey(
    left: Function,
    right: Function,
    top: Function,
    down: Function,
  ) {
    this._leftFunction = null;
    this._rightFunction = null;
    this._topFunction = null;
    this._downFunction = null;
    KeyboardManager.Instance.unregisterKeyAction(
      KeyStroke.VK_LEFT,
      this.__leftKeyDownHandler.bind(this),
    );
    KeyboardManager.Instance.unregisterKeyAction(
      KeyStroke.VK_RIGHT,
      this.__rightKeyDownHandler.bind(this),
    );
    KeyboardManager.Instance.unregisterKeyAction(
      KeyStroke.VK_UP,
      this.__topKeyDownHandler.bind(this),
    );
    KeyboardManager.Instance.unregisterKeyAction(
      KeyStroke.VK_DOWN,
      this.__downKeyDownHandler.bind(this),
    );
  }

  private __leftKeyDownHandler() {
    if (this.battleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.checkInputTxt() && this._leftFunction != null) {
      this._leftFunction();
    }
  }

  private __rightKeyDownHandler() {
    if (this.battleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.checkInputTxt() && this._rightFunction != null) {
      this._rightFunction();
    }
  }

  private __topKeyDownHandler() {
    if (this.battleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.checkInputTxt() && this._topFunction != null) {
      this._topFunction();
    }
  }

  private __downKeyDownHandler() {
    if (this.battleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.checkInputTxt() && this._downFunction != null) {
      this._downFunction();
    }
  }

  public checkInputTxt(): boolean {
    var obj: Laya.TextInput = Laya.stage.focus as Laya.TextInput;
    if (obj && obj.type == "input") {
      return true;
    } else {
      return false;
    }
  }

  private showEquip() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }

    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    // FrameCtrlManager.Instance.armyController.startFrameByType(ArmyPanelEnum.EQUIP_PANEL);
  }

  private showSkill() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    // FrameCtrlManager.Instance.armyController.startFrameByType(ArmyPanelEnum.SKILL_PANEL);
  }

  private showPawn() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }

    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    // FrameCtrlManager.Instance.armyController.startFrameByType(ArmyPanelEnum.PAWN_PANEL);
  }

  private showStore() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }

    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    // FrameCtrlManager.Instance.storeController.startFrameByType(StorePanelEnum.STORE_PANEL_INTENSIFY);
  }

  private showStop() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    if (ArmyManager.Instance.thane.grades < 10) {
      return;
    }
    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    FrameCtrlManager.Instance.open(EmWindow.ShopWnd);
  }

  private showInnerOrOuterCity() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    if (SceneManager.Instance.lock == true) {
      return;
    }
    switch (SceneManager.Instance.currentType) {
      case SceneType.CASTLE_SCENE:
        this.showOuterCity();
        break;
      case SceneType.OUTER_CITY_SCENE:
        this.showInnerCity();
        break;
    }
  }

  private showOuterCity() {
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    var content: string = LangManager.Instance.GetTranslation(
      "yishi.keyboard.KeyBoardRegister.content01",
    );
    SimpleAlertHelper.Instance.popAlerFrame(prompt, content, confirm, cancel, {
      callback: this.__showOuterCityResponse.bind(this),
    });
  }

  private showInnerCity() {
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    var content: string = LangManager.Instance.GetTranslation(
      "yishi.keyboard.KeyBoardRegister.content02",
    );
    SimpleAlertHelper.Instance.popAlerFrame(prompt, content, confirm, cancel, {
      callback: this.__showInnerCityResponse.bind(this),
    });
  }

  private __showOuterCityResponse(boolean: boolean, flag: boolean) {
    if (SceneManager.Instance.currentType != SceneType.CASTLE_SCENE) {
      var str: string = WorldBossHelper.getCampaignTips();
      if (str == "") {
        str = LangManager.Instance.GetTranslation(
          "yishi.keyboard.KeyBoardRegister.command01",
        );
      }
      MessageTipManager.Instance.show(str);
      return;
    }
    if (boolean) {
      SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE);
    }
  }

  private __showInnerCityResponse(boolean: boolean, flag: boolean) {
    if (SceneManager.Instance.currentType != SceneType.OUTER_CITY_SCENE) {
      var str: string = WorldBossHelper.getCampaignTips();
      if (str) {
        str = LangManager.Instance.GetTranslation(
          "yishi.keyboard.KeyBoardRegister.command01",
        );
      }
      MessageTipManager.Instance.show(str);
      return;
    }
    if (boolean) {
      SceneManager.Instance.setScene(SceneType.CASTLE_SCENE);
    }
  }

  private showTask() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }

    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    FrameCtrlManager.Instance.open(EmWindow.SpaceTaskInfoWnd);
  }

  private showMap() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    if (
      CampaignManager.Instance.mapModel &&
      WorldBossHelper.checkPetLand(CampaignManager.Instance.mapModel.mapId)
    ) {
      // FrameCtrlManager.Instance.open(EmWindow.SPACE, SpaceController.PETLAND_MAP);
    } else if (
      CampaignManager.Instance.mapModel &&
      WorldBossHelper.checkMineral(CampaignManager.Instance.mapModel.mapId)
    ) {
      // FrameCtrlManager.Instance.open(UIModuleTypes.SPACE, SpaceController.MINERAL_MAP);
    } else if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      // FrameCtrlManager.Instance.open(UIModuleTypes.SPACE);
    } else {
      return;
    }
    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
  }

  private showFriend() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    if (ArmyManager.Instance.thane.grades < 6) {
      return;
    }
    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    // FrameCtrlManager.Instance.friendControler.startFrameByType(FriendFrameType.MAIN_FRAME);
  }

  private showConsortia() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    // FrameCtrlManager.Instance.open(UIModuleTypes.CONSORTIA);
  }

  private showStar() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    AudioManager.Instance.playSound(SoundIds.CAMPAIGN_OUTERCITY_STAR_SOUND, 0);
    // FrameCtrlManager.Instance.open(EmWindow.STAR);
  }

  private showSetting() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    // if (!Frame.hasOpenFrame) {
    // 	AudioManager.Instance.playSound(SoundIds.INNERCITY_CLICK_BUILD_SOUND, 0);
    // 	FrameCtrlManager.Instance.open(EmWindow.SETTING);
    // }
  }

  private showCampaign() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    var curScene: string = SceneManager.Instance.currentType;
    if (
      curScene != SceneType.CASTLE_SCENE &&
      curScene != SceneType.SPACE_SCENE &&
      curScene != SceneType.OUTER_CITY_SCENE
    ) {
      return;
    }
    AudioManager.Instance.playSound(SoundIds.CAMPAIGN_OUTERCITY_STAR_SOUND, 0);
    FrameCtrlManager.Instance.open(EmWindow.PveCampaignWnd);
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private showMount() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    if (this.thane.grades < 40) {
      return;
    }
    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    FrameCtrlManager.Instance.open(EmWindow.MountsWnd, 1);
  }

  private showPet() {
    if (this.battleFlag) {
      return;
    }
    if (this.vehicleFlag) {
      return;
    }
    if (!this.keyEnable) {
      return;
    }
    if (!this.functionEnable) {
      return;
    }
    if (this.checkInputTxt()) {
      return;
    }
    if (this.thane.grades < PlayerModel.OPEN_PET_SYSTEM_GRADE) {
      return;
    }
    if (!PlayerManager.Instance.currentPlayerModel.petSystemIsOpened) {
      return;
    }
    AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 0);
    // FrameCtrlManager.Instance.open(EmWindow.PET);
  }
}
