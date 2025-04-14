//@ts-expect-error: External dependencies
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import Logger from "../../../core/logger/Logger";
import UIManager from "../../../core/ui/UIManager";
import { Disposeable } from "../../component/DisplayObject";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { NotificationManager } from "../../manager/NotificationManager";
import { SceneManager } from "../../map/scene/SceneManager";
import StringUtils from "../../utils/StringUtils";
import { DialogMessageInfo } from "./data/DialogMessageInfo";
import DialogManager from "./DialogManager";
import { DialogModel } from "./DialogModel";

/**
 * @author yuanzhan.yu
 */
export class DialogControl extends GameEventDispatcher implements Disposeable {
  private _view: any;
  private _id: string = "";
  private _model: DialogModel;
  private _callBack: Function;
  private _showBg: boolean;
  private static PAGE_SIZE: number = 100;

  constructor($callBack: Function, showBg: boolean = true) {
    super();
    this._callBack = $callBack;
    this._showBg = showBg;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get id(): string {
    return this._id;
  }

  public set model($m: DialogModel) {
    this._model = $m;
    // this.DialogTextHandle(this._model);
    this.show();
  }

  // private DialogTextHandle($m: DialogModel) {
  //     let count: number = $m.infos.length;
  //     for (let i: number = 0; i < count; i++) {
  //         let info: DialogMessageInfo = $m.infos[i];
  //         // this.TxtArray(info, i);
  //     }
  // }

  private async show() {
    if (
      this._model &&
      this._model.hasNextInfo() &&
      SceneManager.Instance.currentType == this._model.scene
    ) {
      NotificationManager.Instance.addEventListener(
        NotificationEvent.SWITCH_SCENE,
        this.__switchSceneHandler,
        this,
      );
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.UI_OUT_SCENE,
      );
      this.gotoAndNextMessage();
    } else {
      this.hide();
    }
  }

  private __switchSceneHandler(evt: Event) {
    if (SceneManager.Instance.currentType != this._model.scene) {
      this.hide();
    }
  }

  private hide() {
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SWITCH_SCENE,
      this.__switchSceneHandler,
      this,
    );
    if (this._model && SceneManager.Instance.currentType != this._model.scene) {
      Logger.log(
        this._model,
        "dialog scene : " +
          this._model.scene +
          " current scene : " +
          SceneManager.Instance.currentType,
      );
    }
    if (this._view) {
      this.dispose();
    }
    this._callBack && this._callBack();
    this._callBack = null;
  }

  public async gotoAndNextMessage() {
    if (
      this._model &&
      this._model.hasNextInfo() &&
      SceneManager.Instance.currentType == this._model.scene
    ) {
      let msg: DialogMessageInfo = this._model.nextInfo();
      if (StringUtils.isEmpty(msg.event)) {
        if (!this._view) {
          let dataObj = {
            contro: this,
            isAuto: true,
            showBg: this._showBg,
            rightRoles: this._model.rightRoles,
            leftRoles: this._model.leftRoles,
          };
          await UIManager.Instance.ShowWind(EmWindow.Dialog, dataObj).then(
            (ret) => {
              this._view = ret;
            },
          );
        }
        this._view.showMessage(msg);
      } else {
        this.dispatchDialogEvent(msg);
      }
    } else {
      this.hide();
    }
  }

  private dispatchDialogEvent(info: DialogMessageInfo) {
    let data: object = {
      callBack: this.gotoAndNextMessage.bind(this),
      data: info,
    };
    NotificationManager.Instance.sendNotification(info.event, data);
  }

  public dispose() {
    // KeyBoardRegister.Instance.keyEnable = true;
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.UI_ENTER_SCENE,
    );
    this._model = null;
    if (this._view) {
      UIManager.Instance.HideWind(EmWindow.Dialog);
    }
    this._view = null;
    DialogManager.hideDialog(this.id);
    this.id = "";
  }
}
