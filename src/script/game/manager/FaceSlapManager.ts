// @ts-nocheck
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { EmWindow } from "../constant/UIDefine";
import FaceSlapInfo, { faceSlapImgInfoMsg } from "../datas/faceslap/FaceSlapInfo";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { PlayerManager } from "./PlayerManager";
import { SharedManager } from "./SharedManager";
import FaceImgMsg = com.road.yishi.proto.active.FaceImgMsg;
import FaceImgInfoMsg = com.road.yishi.proto.active.FaceImgInfoMsg;
import ImgMsg = com.road.yishi.proto.active.ImgMsg;

/**
 * 打脸图
 */
export default class FaceSlapManager {

    private static _instance: FaceSlapManager;

    public faceSlapAtyId: string = "";

    private showAtyDts: Map<string, boolean> = new Map();

    private _slapData: FaceSlapInfo = new FaceSlapInfo();

    public static get Instance(): FaceSlapManager {
        if (this._instance == null) this._instance = new FaceSlapManager();
        return this._instance;
    }

    public setup() {
        this.initEvent();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_FACEIMG_LIST, this, this.__faceSlapHandler);
    }

    public showNext() {
        if (this.canShow) {
            FrameCtrlManager.Instance.open(EmWindow.FaceSlappingWnd);
        }
    }

    public getAtyData(): faceSlapImgInfoMsg {
        let count = this._slapData.datas.length;
        let nowServerTime: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
        for (let index = 0; index < count; index++) {
            let dataItem = this._slapData.datas[index];
            let startTime = new Date(dataItem.beginTime.replace(/-/g, "/"));
            let endTime = new Date(dataItem.endTime.replace(/-/g, "/"));
            let state = this.getShowAtyState(dataItem.activeId);
            let notInDate = this.isTodayDate(dataItem.activeId)
            if (nowServerTime > startTime && nowServerTime < endTime && !state && !notInDate) {
                return dataItem;
            }
        }
        return null;
    }

    /** */
    private isTodayDate(atyId: string): boolean {
        let slapData = SharedManager.Instance.faceSlappingDate;
        let slapDate = slapData[atyId];
        if (!slapDate || slapDate == undefined) return false;
        let isExpire: boolean = false;
        slapDate = new Date(slapDate);
        let today: Date = new Date();
        if (today.getFullYear() == slapDate.getFullYear() &&
            today.getMonth() == slapDate.getMonth() &&
            today.getDate() == slapDate.getDate()) {
            isExpire = true;
        }
        return isExpire;
    }

    /**是否在时间段内 */
    public get canShow(): boolean {
        if (!this._slapData || PlayerManager.Instance.isExistNewbieMask) return false;
        let showAtyData = this.getAtyData();
        return showAtyData != null;
    }

    /**打脸图 */
    private __faceSlapHandler(pkg: PackageIn) {
        let msg: FaceImgMsg = pkg.readBody(FaceImgMsg) as FaceImgMsg;
        let infoMsg = msg.faceImgInfos;
        this._slapData.onUpdate(infoMsg);
        let count = this._slapData.datas.length;
        if (count > 0) {
            this.faceSlapAtyId = this._slapData.datas[0].activeId;
        }
    }

    public setShowAtyId(atyId: string, value: boolean) {
        if (!this.showAtyDts) {
            this.showAtyDts = new Map();
        }
        this.showAtyDts.set(atyId, value);
    }

    public getShowAtyState(atyId: string): boolean {
        if (!this.showAtyDts || !this.showAtyDts.has(atyId)) {
            return false;
        }
        return Boolean(this.showAtyDts.get(atyId));
    }

}