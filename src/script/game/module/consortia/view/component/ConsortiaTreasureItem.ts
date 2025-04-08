// @ts-nocheck
import FUI_ConsortiaTreasureItem from "../../../../../../fui/Consortia/FUI_ConsortiaTreasureItem";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import LangManager from "../../../../../core/lang/LangManager";
import ResMgr from "../../../../../core/res/ResMgr";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { MovieClip } from "../../../../component/MovieClip";
import { t_s_mapphysicpositionData } from "../../../../config/t_s_mapphysicposition";
import ColorConstant from "../../../../constant/ColorConstant";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { PlayerModel } from "../../../../datas/playerinfo/PlayerModel";
import { AnimationManager } from "../../../../manager/AnimationManager";
import { PathManager } from "../../../../manager/PathManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import TreasureInfo from "../../../../map/data/TreasureInfo";
import { OuterCityModel } from "../../../../map/outercity/OuterCityModel";

export default class ConsortiaTreasureItem extends FUI_ConsortiaTreasureItem {
    private _info: TreasureInfo;
    private _treasureMovieClip: MovieClip;
    private _path: string;
    private _preUrl: string;
    private _cacheName: string;
    private _countDown: number = 0;//倒计时
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public get info(): TreasureInfo {
        return this._info;
    }

    public set info(value: TreasureInfo) {
        this._info = value;
        let path: string = ""
        if (this._info) {
            let tempInfo: t_s_mapphysicpositionData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapphysicposition, this._info.templateId);
            if (tempInfo) {
                path = PathManager.solveMapPhysicsBySonType(tempInfo.SonType);
                if (path) {
                    this.updateAvatar(path);
                }
            }
            this.nameTxt.text = tempInfo.NameLang;
            this.occpuyNameTxt.text = this._info.info.occupyPlayerName;
            this.addDescTxt.text = LangManager.Instance.GetTranslation("OuterCityMapTreasureTips.resouceAddTxt", this._info.tempInfo.Property1);
            this.statusTxt.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.consortiaTreasure" + this.playerModel.treasureState);
            if(this.playerModel.treasureState == OuterCityModel.TREASURE_STATE1){
                this.statusTxt.color = this.leftTimeTxt.color = ColorConstant.BLUE_COLOR;
            }else if(this.playerModel.treasureState == OuterCityModel.TREASURE_STATE2){
                this.statusTxt.color = this.leftTimeTxt.color = ColorConstant.GREEN_COLOR;
            }else{
                this.statusTxt.color = this.leftTimeTxt.color = ColorConstant.RED_COLOR;
            }
            
            let curTime: number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;//当前时间
            let endTime: number = this.playerModel.stateEndTime;//截止时间
            this._countDown = endTime - curTime;//剩余的秒数
            if (this._countDown > 0) {
                this.leftTimeTxt.text = "(" + DateFormatter.getConsortiaCountDate(this._countDown) + ")";
                Laya.timer.loop(1000, this, this.updateCountDown);
            }
            else {
                Laya.timer.clear(this, this.updateCountDown)
                this.leftTimeTxt.text = "";
            }
        }
    }

    private updateCountDown() {
        this._countDown--;
        if (this._countDown > 0) {
            this.leftTimeTxt.text = "(" + DateFormatter.getConsortiaCountDate(this._countDown) + ")";
        }
        else {
            this.leftTimeTxt.text = "";
            Laya.timer.clear(this, this.updateCountDown);
        }
    }


    private updateAvatar(path: string) {
        if (this._path == path) {
            return;
        }
        this._path = path;
        ResMgr.Instance.loadRes(this._path, (res) => {
            this.loaderCompleteHandler(res);
        }, null, Laya.Loader.ATLAS);
    }

    private loaderCompleteHandler(res: any) {
        if (this._treasureMovieClip) {
            this._treasureMovieClip.stop();
            this._treasureMovieClip.parent && this._treasureMovieClip.parent.removeChild(this._treasureMovieClip);
        }
        if (!res) {
            return;
        }
        this._preUrl = res.meta.prefix;
        this._cacheName = this._preUrl;
        let aniName = "";
        AnimationManager.Instance.createAnimation(this._preUrl, aniName, undefined, "", AnimationManager.MapPhysicsFormatLen);
        this._treasureMovieClip = new MovieClip(this._cacheName);
        this.displayObject.addChild(this._treasureMovieClip);
        this._treasureMovieClip.gotoAndStop(1);
        let frames = res.frames;
        let offsetX: number = 0;
        let offsetY: number = 0;
        if (res.offset) {
            let offset = res.offset;
            offsetX = offset.footX;
            offsetY = offset.footY;
        }
        this._treasureMovieClip.scale(0.7, 0.7);
        let sourceSize = new Laya.Rectangle();
        for (let key in frames) {
            if (Object.prototype.hasOwnProperty.call(frames, key)) {
                let sourceItem = frames[key].sourceSize;
                sourceSize.width = sourceItem.w;
                sourceSize.height = sourceItem.h;
                break;
            }
        }
        this._treasureMovieClip.x = -sourceSize.width / 20;
        this._treasureMovieClip.y = -sourceSize.height / 18;
        this._treasureMovieClip.gotoAndPlay(1, true);
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel
    }

    public dispose() {
        super.dispose();
    }
}