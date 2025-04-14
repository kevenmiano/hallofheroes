import LangManager from "../../../core/lang/LangManager";
import { PackageIn } from "../../../core/net/PackageIn";
import { PlayerManager } from "../../manager/PlayerManager";
import SceneType from "../../map/scene/SceneType";
import { DialogControl } from "../../module/dialog/DialogControl";
import { DialogModel } from "../../module/dialog/DialogModel";
import { DialogMessageInfo } from "../../module/dialog/data/DialogMessageInfo";
import { MapBaseAction } from "./MapBaseAction";

//@ts-expect-error: External dependencies
import PlotMsg = com.road.yishi.proto.gameplot.PlotMsg;
//@ts-expect-error: External dependencies
import PlotInfoMsg = com.road.yishi.proto.gameplot.PlotInfoMsg;

/**
 * @author yuanzhan.yu
 */
export class DialogAction extends MapBaseAction {
  private _pkg: PackageIn;

  constructor($pkg: PackageIn) {
    super();
    this._pkg = $pkg;
  }

  public prepare() {
    super.prepare();
    // NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE,false);
    // SceneManager.Instance.lockScene = false;
  }

  public update() {
    if (this._count == 1) {
      this.updateImp();
    }
    this._count++;
  }

  protected actionOver() {
    super.actionOver();
  }

  private updateImp() {
    var dialogCon: DialogControl = new DialogControl(
      this.actionOver.bind(this),
    );
    dialogCon.model = this.readPackage();
  }

  private readPackage(): DialogModel {
    var model: DialogModel = new DialogModel();
    var msg: PlotMsg = this._pkg.readBody(PlotMsg) as PlotMsg;
    model.isLoop = msg.loop;
    model.scene = SceneType.getSceneTypeById(msg.sceneType);
    for (var i: number = 0; i < msg.info.length; i++) {
      var dInfo: DialogMessageInfo = new DialogMessageInfo();

      dInfo.index = (msg.info[i] as PlotInfoMsg).index;
      dInfo.direction = (msg.info[i] as PlotInfoMsg).direction;
      dInfo.roleId = (msg.info[i] as PlotInfoMsg).roleId;
      if ((msg.info[i] as PlotInfoMsg).roleName == "%s") {
        (msg.info[i] as PlotInfoMsg).roleName =
          PlayerManager.Instance.currentPlayerModel.playerInfo.nickName;
        if (dInfo.roleId == 0) {
          dInfo.roleId =
            PlayerManager.Instance.currentPlayerModel.playerInfo.pics;
        }
      }
      if (
        (msg.info[i] as PlotInfoMsg).roleName ==
        PlayerManager.Instance.currentPlayerModel.userInfo.userId + "$"
      ) {
        dInfo.roleName = LangManager.Instance.GetTranslation("public.nickName");
      } else {
        dInfo.roleName = (msg.info[i] as PlotInfoMsg).roleName;
      }
      dInfo.event = (msg.info[i] as PlotInfoMsg).event;
      dInfo.param = (msg.info[i] as PlotInfoMsg).param;
      dInfo.txt = (msg.info[i] as PlotInfoMsg).text;
      dInfo.delayTime = (msg.info[i] as PlotInfoMsg).delayTime;

      var myPattern: RegExp = /%s/g;
      dInfo.txt = dInfo.txt.replace(myPattern, dInfo.roleName);

      model.addInfo(dInfo);
    }
    return model;
  }

  private transHtmlStr(source: string): string {
    var pattern: RegExp = /&lt;/g;
    var str: string = source.replace(pattern, "<");
    pattern = /&gt;/g;
    str = str.replace(pattern, ">");

    return str;
  }
}
