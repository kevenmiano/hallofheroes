// @ts-nocheck
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import ResMgr from "../../../core/res/ResMgr";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../core/utils/StringHelper";
import { MovieClip } from "../../component/MovieClip";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { t_s_mounttemplateData } from '../../config/t_s_mounttemplate';
import { ConfigType } from "../../constant/ConfigDefine";
import { SwitchEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { AnimationManager } from "../../manager/AnimationManager";
import { ConfigManager } from "../../manager/ConfigManager";
import { MountsManager } from "../../manager/MountsManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PathManager } from "../../manager/PathManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { MountType } from "./model/MountType";
import { WildSoulCollection } from "./model/WildSoulCollection";
import { WildSoulInfo } from "./model/WildSoulInfo";
import WildSoulItem from "./WildSoulItem";

export default class MountInfoWnd extends BaseWindow {
    public frame: fgui.GLabel;
    public bgImg: fgui.GImage;
    public nameBg: fgui.GImage;
    public mountNameTxt: fgui.GRichTextField;
    public descTxt1: fgui.GRichTextField;
    public descTxt2: fgui.GRichTextField;
    // public mountDescTxt: fgui.GTextField;
    public willScoreTxt: fgui.GRichTextField;
    public attributeTxt: fgui.GRichTextField;
    public postBtn: fgui.GButton;
    private _wildSoulItem: WildSoulItem;
    private _mountData: t_s_mounttemplateData;
    private _isLock: boolean;
    private _preUrl: string;
    private _cacheName: string;
    private _mountMovieClip: MovieClip;
    private _resUrl: string;
    public date1: fgui.GTextField;
    public date2: fgui.GTextField;
    public specialTxt: fgui.GTextField;
    public img_star: fgui.GImage;
    public starGroup: fgui.GGroup;
    public OnInitWind() {
        this.setCenter();
        if (this.params) {
            this._wildSoulItem = this.params.frameData;
            if (this._wildSoulItem) {
                this._mountData = this._wildSoulItem.vData;
                this._isLock = this._wildSoulItem.isLock;
            }
        }
        this.initView();
        this.addEvent();
    }

    OnShowWind() {
        super.OnShowWind();
    }

    private clean() {
        this.attributeTxt.visible = false;
        this.date1.visible = false;
        this.date2.visible = false;
        this.specialTxt.visible = false;
        this.attributeTxt.text = ""
        this.date1.text = "";
        this.date2.text = "";
        this.specialTxt.text = "";
    }

    private initView() {
        this.clean();
        if (this._mountData) {
            this.mountNameTxt.text = this._mountData.TemplateNameLang;
            this.onSwitch();
            this.postBtn.enabled = !this._isLock;
            this.updateAvatar(this._mountData.AvatarPath);
            var item: WildSoulInfo = MountsManager.Instance.avatarList.getWildSoulInfo(this._mountData.TemplateId);
            var strArray: Array<string>;

            if (this._isLock || this._mountData.StarItem == 0) {
                strArray = LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips01").split("|");
            } else {
                strArray = LangManager.Instance.GetTranslation("mounts.WildsoulItem.Newtips01").split("|");
            }
            var tipStr: string = "";
            var speed: number = 0;
            if (this._mountData.MountType == MountType.MAGIC)
                speed = this._mountData.Speed;
            var valueArray: Array<number> = [this._mountData.Power, this._mountData.Intellect, this._mountData.Physique, this._mountData.Agility, this._mountData.ExpandLevel, speed];
            var addNumber: number = 0;
            if (item) {
                addNumber = item.starLevel * this._mountData.StarPower;
            }
            if (strArray.length >= valueArray.length) {
                for (var i: number = 0; i < valueArray.length; i++) {
                    if (valueArray[i] != 0) {
                        if (this._isLock) {
                            tipStr += StringHelper.format(strArray[i], valueArray[i]) + "<br/>";
                        } else {
                            tipStr += StringHelper.newFormat(strArray[i], valueArray[i], addNumber) + "<br/>";
                        }
                    }
                }
            }
            this.willScoreTxt.text = LangManager.Instance.GetTranslation("mountTip.soulscore", this._mountData.SoulScore);
            if (this._mountData.MountType == MountType.NORMAL) {//普通
                // this.mountDescTxt.text = this._mountData.DescriptionLang;
                this.attributeTxt.visible = false;
                this.willScoreTxt.y = 290
                if (item) {
                    if (this.isFlying(this._mountData.TemplateId)) {
                        this.date1.visible = true;
                        this.date1.text = LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips06");
                    }
                } else {
                    this.date1.text = LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips03", this._mountData.Property2);
                    this.date1.visible = true;
                }
            } else {
                this.mountNameTxt.text = this._mountData.TemplateNameLang;
                this.attributeTxt.visible = true;
                this.willScoreTxt.y = 400;
                this.attributeTxt.text = tipStr;
                // this.mountDescTxt.text = this._mountData.DescriptionLang;
                var needTips: Array<string> = [];
                if (this._mountData.NeedMountGrade > 0)
                    needTips.push(LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips.NeedGrade", this._mountData.NeedMountGrade));
                if (this._mountData.NeedItemId != 0) {
                    var goodTemplate: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._mountData.NeedItemId.toString());
                    if (goodTemplate) {
                        needTips.push(goodTemplate.TemplateNameLang);
                    }
                }
                if (item == null && needTips.length > 0) {
                    var needTipStr: string = needTips.join("\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
                    this.date1.text = LangManager.Instance.GetTranslation("mounts.MountTip.NeedGood", needTipStr);
                    this.date1.visible = true;
                }
                if (item && item.validity != 0) {
                    this.date1.visible = true;
                    if (item.validity < 0) {
                        this.date1.text = LangManager.Instance.GetTranslation("mounts.WildsoulItem.forever");
                    } else {
                        this.date1.text = LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips02", item.validity);
                    }
                }
                if (this.isFlying(this._mountData.TemplateId)) {
                    this.specialTxt.visible = true;
                    if (!StringHelper.isNullOrEmpty(this.specialTxt.text)) {
                        this.specialTxt.text += LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips06");
                    }
                    else {
                        this.specialTxt.text = LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips06");
                    }
                }
            }
            if (this._mountData.StarItem == 0) {
                this.starGroup.visible = false;
                this.mountNameTxt.y = 95;
            }
            else {
                var info: WildSoulInfo = this.wildSoulCollection.getWildSoulInfo(this._mountData.TemplateId);
                if (info) {
                    this.img_star.fillAmount = info.starLevel / 5;
                } else {
                    this.img_star.fillAmount = 0;
                }
                this.starGroup.visible = true;
                this.mountNameTxt.y = 83;
            }
        }
    }

    private onSwitch() {
        this.postBtn.visible = ConfigManager.info.MOUNT_SHARE;
    }

    private get wildSoulCollection(): WildSoulCollection {
        return MountsManager.Instance.avatarList;
    }

    private addEvent() {
        this.postBtn.onClick(this, this.postBtnHandler);
        NotificationManager.Instance.addEventListener(SwitchEvent.MOUNT_SHARE, this.onSwitch, this);
    }

    private removeEvent() {
        this.postBtn.offClick(this, this.postBtnHandler);
        NotificationManager.Instance.removeEventListener(SwitchEvent.MOUNT_SHARE, this.onSwitch, this);
    }

    /**打开分享界面 */
    postBtnHandler() {
        FrameCtrlManager.Instance.open(EmWindow.MountShareWnd, this._mountData);
    }

    private updateAvatar(path: string) {
        this._resUrl = this.getUrl(path);
        ResMgr.Instance.loadRes(this._resUrl, (res) => {
            this.loaderCompleteHandler(res);
        }, null, Laya.Loader.ATLAS);
    }

    private loaderCompleteHandler(res: any) {
        if (this._mountMovieClip) {
            this._mountMovieClip.stop();
            this._mountMovieClip.parent && this._mountMovieClip.parent.removeChild(this._mountMovieClip);
        }
        if (!res || this.bgImg.isDisposed) {
            return;
        }
        this._preUrl = res.meta.prefix;
        this._cacheName = this._preUrl;
        let aniName = "";
        AnimationManager.Instance.createAnimation(this._preUrl, aniName, undefined, "", AnimationManager.MapPhysicsFormatLen);
        this._mountMovieClip = new MovieClip(this._cacheName);
        this.bgImg.displayObject.addChild(this._mountMovieClip);
        this._mountMovieClip.gotoAndStop(1);
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
        this._mountMovieClip.pivotX = sourceSize.width >> 1;
        this._mountMovieClip.pivotY = sourceSize.height >> 1;
        // this._mountMovieClip.x = offsetX
        // this._mountMovieClip.y = offsetY

        let templateId = this._mountData.TemplateId;
        if (templateId == 8026 || templateId == 8053) {
            //8026（火箭飞艇） 8053（囚牛）位置调右一点
            offsetX = 80;
            offsetY = 30;
        } else if (templateId == 3041) {
            // 恩克2000（3041）
            offsetX = 60;
            offsetY = 30;
        } else if (templateId == 8233) {
            // 图腾魔像（8233）
            offsetX = 20;
            offsetY = -40;
        } else if (templateId == 3069) {
            // 梦幻鹿（3069）
            offsetX = 120;
            offsetY = -20;
        } else if (templateId == 8160) {
            // 白金刚（8160）
            offsetX = 0;
            offsetY = 0;
        } else if (templateId == 8215) {
            // 独轮车（8215）
            offsetX = 50;
            offsetY = -30;
        } else if (templateId == 8204) {
            // 白羽（8204）
            offsetX = 50;
            offsetY = 0;
        } else {
            offsetX = 0;
            offsetY = 30;
        }
        this._mountMovieClip.x = (this.bgImg.width >> 1) + offsetX;
        this._mountMovieClip.y = (this.bgImg.height >> 1) + offsetY;
        this._mountMovieClip.gotoAndPlay(1, true);
    }

    private getUrl(path: string): string {
        return PathManager.resourcePath + "equip_show" + path.toLocaleLowerCase() + "/2/2.json";
    }

    private isFlying(mountTemplateId: number): boolean {
        let mountArr: Array<number> = MountsManager.Instance.flyMountArr;
        let flag: boolean = false;
        for (let i: number = 0; i < mountArr.length; i++) {
            if (mountTemplateId == mountArr[i]) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose() {
        super.dispose();
        if (this._mountMovieClip) {
            this._mountMovieClip.stop();
            this._mountMovieClip = null;
        }
    }
}