//@ts-expect-error: External dependencies
import ConfigMgr from "../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import LangManager from "../../../core/lang/LangManager";
import Dictionary from "../../../core/utils/Dictionary";
import { ConfigType } from "../../constant/ConfigDefine";
import { PlayerManager } from "../../manager/PlayerManager";
import SceneType from "../../map/scene/SceneType";
import StringUtils from "../../utils/StringUtils";
import { DialogConstInfo } from "./data/DialogConstInfo";
import { DialogMessageInfo } from "./data/DialogMessageInfo";

/**
 * @author yuanzhan.yu
 */
export class DialogModel extends GameEventDispatcher {
  public static QuickAutoTime: number = 2000;
  public static isQuickAuto: boolean = false;
  public isLoop: boolean;
  public scene: string;
  private _infos: DialogMessageInfo[];
  private _index: number;
  private _nextindex: number = 0;

  constructor() {
    super();
    this._infos = [];
    this._index = 0;
  }

  public hasNextInfo(): boolean {
    return this._infos.length > this._index;
  }

  public nextInfo(): DialogMessageInfo {
    if (this._infos.length > this._index) {
      return this._infos[this._index++] as DialogMessageInfo;
    }
    return null;
  }

  public preInfo(): DialogMessageInfo {
    if (this._index > 0) {
      if (this._infos.length > this._index - 1) {
        return this._infos[--this._index];
      }
    }
    return null;
  }

  public addInfo(value: DialogMessageInfo) {
    this._infos.push(value);
  }

  public get infos(): DialogMessageInfo[] {
    return this._infos;
  }

  public get rightRoles(): Dictionary {
    let dic: Dictionary = new Dictionary();
    this._infos.forEach((value) => {
      if (
        value.direction == DialogConstInfo.RIGHT &&
        StringUtils.isEmpty(value.event)
      ) {
        dic[value.roleId] = value;
      }
    });
    return dic;
  }

  public get leftRoles(): Dictionary {
    let dic: Dictionary = new Dictionary();
    this._infos.forEach((value) => {
      if (
        value.direction != DialogConstInfo.RIGHT &&
        StringUtils.isEmpty(value.event)
      ) {
        dic[value.roleId] = value;
      }
    });
    return dic;
  }

  public setXmlResources($nameId: string) {
    let list = ConfigMgr.Instance.getSync(ConfigType.t_s_novicedialogue);
    let storyXmlList = [];
    if (list) storyXmlList = list.mDataList;
    let currentXml: any = null;
    for (let i: number = 0; i < storyXmlList.length; i++) {
      if ($nameId == storyXmlList[i].nameId) {
        currentXml = storyXmlList[i];
        break;
      }
    }
    if (!currentXml) {
      return;
    }
    let itemXmlList = currentXml.txts.item;
    this.scene = SceneType.getSceneTypeById(currentXml.sceneType);
    for (let j: number = 0; j < itemXmlList.length; j++) {
      let info: DialogMessageInfo = new DialogMessageInfo();
      info.copy(itemXmlList[j]);
      if (itemXmlList[j].roleId == 0) {
        info.roleId = PlayerManager.Instance.currentPlayerModel.playerInfo.pics;
        if (
          PlayerManager.Instance.currentPlayerModel.playerInfo.nickName ==
          PlayerManager.Instance.currentPlayerModel.userInfo.userId + "$"
        ) {
          info.roleNameLang =
            LangManager.Instance.GetTranslation("public.nickName");
        } else {
          info.roleNameLang =
            PlayerManager.Instance.currentPlayerModel.playerInfo.nickName;
        }
      }
      this.addInfo(info);
    }
  }
}
