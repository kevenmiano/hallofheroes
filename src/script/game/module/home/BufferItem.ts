import FUI_BufferItem from "../../../../fui/Home/FUI_BufferItem";
import LangManager from '../../../core/lang/LangManager';
import { IconFactory } from "../../../core/utils/IconFactory";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { PlayerBufferInfo } from "../../datas/playerinfo/PlayerBufferInfo";
import { ToolTipsManager } from "../../manager/ToolTipsManager";
import { TipsShowType } from "../../tips/ITipedDisplay";
import FUIHelper from "../../utils/FUIHelper";
import { t_s_consortialevelData } from "../../config/t_s_consortialevel";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../manager/PlayerManager";
import TransportBufferInfo from "../../datas/playerinfo/TransportBufferInfo";
import { PlayerBufferType } from "../../constant/PlayerBufferType";

export default class BufferItem extends FUI_BufferItem {
    tipData: any;
    tipType: EmWindow;
    canOperate: boolean = false;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    private _type: number = 0;
    private _info: any;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public set info(value: any) {
        if (!value) {
            this.icon1.url = "";
            this.timeTxt.text = "";
            this.countTxt.text = "";
            return;
        }
        this._info = value;
        ToolTipsManager.Instance.register(this);
        if (this._info.type == 1 || this._info.type == 2 || this._info.type == 11 || this._info.type == 3 || this._info.type == 5) {
            this.tipType = EmWindow.CommonTips;
            this._type = this._info.type;
            let tecMerge: boolean = false;
            let dataArray: Array<any> = this._info.bufferData;
            var tecBuffer: Array<any> = [];
            var tecKey: string;
            var tecValue: number;
            var tecSuffix: string;
            var tecFlags: Object = {};
            var tecBufferInfo: Object = {};
            var tecBufferValue: Object = {};
            var tecBufferSuffix: Object = {};
            this.icon1.url = FUIHelper.getItemURL(EmPackName.Base, "asset.resourceBar.ExtraBufferIcon_" + this._type);
            let tipStr: string = "[color=#D32EDB][size=24]" + LangManager.Instance.GetTranslation("yishi.view.resourceBar.ExtraBufferTitle" + this._type) + "[/size][/color]";
            if (this._type == 6)  //世界繁荣度
            {
                tipStr = tipStr + "<br>";
                tipStr += LangManager.Instance.GetTranslation("yishi.view.resourceBar.ExtraBufferContent6", value[0]);
            } else if (this._type == 11) //英灵觉醒加速
            {
                tipStr = tipStr + "<br>";
                tipStr += LangManager.Instance.GetTranslation("yishi.view.resourceBar.ExtraBufferContent11");
            } else {
                tipStr = tipStr + "<br>";
                for (var i = 0; i < dataArray.length; i++) {
                    let item = dataArray[i];
                    if (item instanceof t_s_consortialevelData) {
                        tipStr += (item as t_s_consortialevelData).DescriptionLang + "<br>";
                    }
                    else if (item instanceof BuildInfo) {
                        if ((item as BuildInfo).templeteInfo.MasterType == 13) {
                            tecBuffer[0] = LangManager.Instance.GetTranslation("map.internals.view.frame.FieldInfoView.goldTextText");
                            tecBuffer[1] = (item as BuildInfo).templeteInfo.ActivityLang;
                            tecKey = tecBuffer[0];
                        }
                        else {
                            tecBuffer = (item as BuildInfo).templeteInfo.ActivityLang.split("+");
                            tecKey = tecBuffer[0];
                        }
                        if ((tecBuffer[1] as string).indexOf("/") != -1) {
                            tecBuffer = (tecBuffer[1] as string).split("/");
                            tecValue = parseInt(tecBuffer[0]);
                            tecSuffix = "/" + tecBuffer[1] + "<br>";
                        }
                        else {
                            tecValue = parseInt(tecBuffer[1]);
                            tecSuffix = "<br>";
                        }
                        if (!tecFlags[tecKey]) {
                            tecFlags[tecKey] = true;
                            tecBufferInfo[tecKey] = tecKey;
                            tecBufferValue[tecKey] = tecValue;
                            tecBufferSuffix[tecKey] = tecSuffix;
                        }
                        else {
                            tecBufferValue[tecKey] += tecValue;
                        }
                        if (!tecMerge) {
                            tecMerge = true;
                        }
                    }
                    else if (item instanceof TransportBufferInfo) {
                        tipStr += (item as TransportBufferInfo).infoContent + "<br>";
                    }
                    else {
                        if (item == 0) {
                            tipStr += LangManager.Instance.GetTranslation("yishi.view.resourceBar.ExtraBufferSeminary", this.playerInfo.seminaryEffect) + "\n";
                        } else {
                            tipStr += "<br>" + LangManager.Instance.GetTranslation("yishi.view.resourceBar.ExtraBufferSeminaryTips");
                        }
                    }
                }
                if (tecMerge) {
                    for (var key in tecBufferInfo) {
                        tipStr += tecBufferInfo[key] + "+" + tecBufferValue[key] + tecBufferSuffix[key];
                    }
                }
            }
            this.tipData = tipStr;
        }
        else if (this._info.type == 999) {
            this.tipType = EmWindow.PotionBufferTips;
            this.icon1.url = FUIHelper.getItemURL(EmPackName.Base, "asset.resourceBar.ExtraBufferIcon_" + this._info.type);
            this.tipData = this._info.bufferData;
        }else if(this._info.type == PlayerBufferType.REGRESS_PLAYER_BUFFER){
            this.tipType = EmWindow.BufferTips;
            this.icon1.url = IconFactory.getCommonIconPath(this._info.bufferData.template.Icon);
            this.tipData = this._info.bufferData;
        }
        else if (this._info instanceof PlayerBufferInfo) {
            if (this._info) {
                this._info.removeEventListener(Laya.Event.CHANGE, this.__changeHandler, this);
            }
            this._info.addEventListener(Laya.Event.CHANGE, this.__changeHandler, this);
            this.tipType = EmWindow.BufferTips;
            this.icon1.url = IconFactory.getCommonIconPath(this._info.icon);
            this.tipData = this._info;
            var leftTime: number = this._info.leftTime;
            if (leftTime > 0) {
                this.__changeHandler();
            }else{
                this.timeTxt.text = "";
            }
            if (this._info.lastCount > 0) {
                this.countTxt.text = this._info.lastCount.toString();
                this.countTxt.color = "#fefefe"
            }
            if (this._info.template && this._info.template.Types == 4) {
                this.countTxt.text = this._info.template.Grades;
                this.countTxt.color = "#fff390";
            }
        }
    }

    private __changeHandler() {
        this.timeTxt.text = "";
        var timeStr: string = "";
        if (!this._info || !this._info.leftTime) return;
        if (this._info.leftTime >= 3600 * 24)
            timeStr = parseInt((this._info.leftTime / (3600 * 24)).toString()) + LangManager.Instance.GetTranslation("public.day");
        else if (this._info.leftTime >= 3600)
            timeStr = parseInt((this._info.leftTime / 3600).toString()) + LangManager.Instance.GetTranslation("public.time.sigHour");
        else if (this._info.leftTime >= 60)
            timeStr = parseInt((this._info.leftTime / 60).toString()) + LangManager.Instance.GetTranslation("public.minute");
        else
            timeStr = parseInt((this._info.leftTime).toString()) + LangManager.Instance.GetTranslation("task.view.TaskMobilePhoneView.Text1");
        this.timeTxt.text = timeStr;
    }

    private get playerInfo(): PlayerInfo {
        return this.playerModel.playerInfo;
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    public dispose() {
        super.dispose();
    }
}