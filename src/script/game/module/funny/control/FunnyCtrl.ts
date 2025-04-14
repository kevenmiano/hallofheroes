import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import ResMgr from "../../../../core/res/ResMgr";
import StringHelper from "../../../../core/utils/StringHelper";
import XmlMgr from "../../../../core/xlsx/XmlMgr";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { PathManager } from "../../../manager/PathManager";
import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
/**
 * @author:pzlricky
 * @data: 2021-09-27 15:24
 * @description ***
 */
export default class FunnyCtrl extends FrameCtrlBase {
  private _needUpdate: boolean = true;
  private _funnyName: string = ""; //精彩活动规格的小图527*417

  constructor() {
    super();
    this.initEvent();
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_C_GAMETIMES_INFO,
      this,
      this.__updateHandler,
    );
  }

  private __updateHandler(pkg: PackageIn) {
    this._needUpdate = true;
  }

  public get funnyName(): string {
    if (StringHelper.isNullOrEmpty(this._funnyName)) {
      return "";
    }
    return this._funnyName;
  }

  get preLoad(): boolean {
    return this._needUpdate;
  }

  // startPreLoadData() {
  //     var args: Object = new Object();
  //     args['rnd'] = String(Math.random());
  //     var path: string = PathManager.timeStoryPath;
  //     ResMgr.Instance.loadRes(path, (info) => {
  //         if(!info) {
  //             this._needUpdate = false;
  //              super.preLoadDataComplete();
  //         } else {
  //             if (this._needUpdate) {
  //                 var xml = XmlMgr.Instance.decode(info);
  //                 this._funnyName = xml.funny.res ? xml.funny.res : "";
  //             }
  //             this._needUpdate = false;
  //             super.preLoadDataComplete();
  //         }
  //     });
  // }
}
