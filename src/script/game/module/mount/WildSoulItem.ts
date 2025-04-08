// @ts-nocheck
import FUI_WildSoulItem from "../../../../fui/Mount/FUI_WildSoulItem";
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from '../../../core/lang/LangManager';
import ResMgr from "../../../core/res/ResMgr";
import { UIFilter } from '../../../core/ui/UIFilter';
import StringHelper from "../../../core/utils/StringHelper";
import { MovieClip } from "../../component/MovieClip";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { t_s_mounttemplateData } from '../../config/t_s_mounttemplate';
import { ConfigType } from "../../constant/ConfigDefine";
import { EmWindow } from '../../constant/UIDefine';
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { AnimationManager } from "../../manager/AnimationManager";
import { ArmyManager } from "../../manager/ArmyManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { MountsManager } from "../../manager/MountsManager";
import { PathManager } from "../../manager/PathManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { ToolTipsManager } from "../../manager/ToolTipsManager";
import { VIPManager } from "../../manager/VIPManager";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceSocketOutManager } from "../../map/space/SpaceSocketOutManager";
import { TipsShowType } from "../../tips/ITipedDisplay";
import ComponentSetting from '../../utils/ComponentSetting';
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { MountInfo } from "./model/MountInfo";
import { MountType } from "./model/MountType";
import { WildSoulCollection } from "./model/WildSoulCollection";
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import { WildSoulInfo } from "./model/WildSoulInfo";
import { ArmyEvent } from "../../constant/event/NotificationEvent";
import { getDefaultLanguageIndex } from "../../../core/lang/LanguageDefine";

export default class WildSoulItem extends FUI_WildSoulItem {
    private _vData: t_s_mounttemplateData;
    private _isLock: boolean;
    private _mountMovieClip: MovieClip;
    private _scaleNumber: number = 0.6;
    public tipType: EmWindow = EmWindow.MountTips;
    public tipData: any = null;
    public showType: TipsShowType = TipsShowType.onLongPress;
    public startPoint: Laya.Point = new Laya.Point(0, 0);
    private _lastClickTime: number = 0;
    private cStarNum: fgui.Controller;
    protected onConstruct(): void {
        super.onConstruct();
        this.cStarNum = this.baseItem.comStar.getController("cStarNum");
        this.baseItem.language.selectedIndex=getDefaultLanguageIndex();
    }

    private addEvent() {
        this.changeBtn.onClick(this, this.changeBtnClick);
        this.activeBtn.onClick(this, this.activeBtnHandler);
        this.lianHuaBtn.onClick(this, this.lianHuaBtnHandler);
        this.mountBtn.onClick(this, this.mountBtnClick);
        this.restBtn.onClick(this, this.restBtnClick);
        ArmyManager.Instance.army.addEventListener(ArmyEvent.ARMY_INFO_CHANGE, this._onMountStateChange, this);
    }

    private removeEvent() {
        this.changeBtn.offClick(this, this.changeBtnClick);
        this.activeBtn.offClick(this, this.activeBtnHandler);
        this.lianHuaBtn.offClick(this, this.lianHuaBtnHandler);
        this.mountBtn.offClick(this, this.mountBtnClick);
        this.restBtn.offClick(this, this.restBtnClick);
        ArmyManager.Instance.army.removeEventListener(ArmyEvent.ARMY_INFO_CHANGE, this._onMountStateChange, this);
    }

    //上马
    private mountBtnClick(event: Laya.Event) {
        event.stopPropagation();
        var st: number = new Date().getTime();
        if (st - this._lastClickTime < 900) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return;
        }
        this.changeBtnClick(event);
        this._lastClickTime = st;
    }

    //下马
    private restBtnClick(event: Laya.Event) {
        event.stopPropagation();
        var st: number = new Date().getTime();
        if (st - this._lastClickTime < 900) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
            return;
        }
        MountsManager.Instance.dismount();
        this._lastClickTime = st;
        SpaceManager.Instance.checkIsOnObstacle();
    }

    private _onMountStateChange() {
        var tempId: number = ArmyManager.Instance.army.mountTemplateId;
        if (this._isLock) {
            this.restBtn.visible = false;
            this.mountBtn.visible = false;
            return;
        }
        if (tempId > 0 && tempId == this._vData.TemplateId) {
            this.restBtn.visible = true;//休息
            this.mountBtn.visible = false;//上马
        } else {
            this.restBtn.visible = false;
            this.mountBtn.visible = true;
        }
    }

    private activeBtnHandler(event: Laya.Event) {
        event.stopPropagation();
        let confirm: string;
        let cancel: string;
        let prompt: string;
        let content: string;
        //去掉类型判断
        if (this._vData && this.isLock) {
            if (this._vData.NeedMountGrade > this.curMountInfo.grade) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.UseGoodNeedGrade", this._vData.NeedMountGrade));
                return;
            }

            let type: number = 0;
            let value: number = 0;
            let goodTemplate: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._vData.NeedItemId.toString());
            if (goodTemplate) {
                //去背包中找解锁的物品
                let find: Array<GoodsInfo> = GoodsManager.Instance.getBagGoodsByTemplateId(goodTemplate.TemplateId);
                if (find && find.length > 0) {
                    //有则提示使用物品
                    let validity: string;
                    if (goodTemplate.Property2 > 0) {
                        validity = LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips.Day", goodTemplate.Property2);
                    } else {
                        validity = LangManager.Instance.GetTranslation("mounts.WildsoulItem.tips.Long");
                    }
                    content = LangManager.Instance.GetTranslation("mounts.command10", goodTemplate.TemplateNameLang, validity);
                    type = 1;
                    value = 1;
                } else {
                    if (this._vData.Property1 > 0) {
                        //能够使用钻石解锁, 提示使用钻石
                        content = LangManager.Instance.GetTranslation("mounts.command11", goodTemplate.TemplateNameLang, this._vData.Property1);
                        type = 2;
                        value = this._vData.Property1;
                    } else {
                        //没有解锁物品又不能用钻石 则提示物品来源
                        content = LangManager.Instance.GetTranslation("mounts.command12", goodTemplate.TemplateNameLang);
                        MessageTipManager.Instance.show(content);
                        return;
                    }
                }
            } else {
                if (this._vData.Property1 > 0) {
                    //提示 使用钻石
                    type = 2;
                    value = this._vData.Property1;
                    content = LangManager.Instance.GetTranslation("mounts.command11", this._vData.Property1);
                } else {
                    return;
                }
            }
            confirm = LangManager.Instance.GetTranslation("public.confirm");
            cancel = LangManager.Instance.GetTranslation("public.cancel");
            prompt = LangManager.Instance.GetTranslation("public.prompt");
            content = StringHelper.repHtmlTextToFguiText(content);
            if (type == 2) {
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { templateId: this._vData.TemplateId, paytype: type, count: value, point: this._vData.Property1 }, prompt, content, confirm, cancel, this.__resultHandler.bind(this));
            } else {
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, { templateId: this._vData.TemplateId, paytype: type, count: value }, prompt, content, confirm, cancel, this.__resultHandler.bind(this));
            }
        }
    }

    private __resultHandler(b: boolean, flag: boolean, data: any) {
        if (b) {
            if (data.paytype == 1) {
                MountsManager.Instance.activateMount(data.templateId, flag);
            } else if (data.paytype == 2) {
                MountsManager.Instance.activateMount(data.templateId, flag);
            }
        }
    }

    private changeBtnClick(event: Laya.Event) {
        event.stopPropagation();
        if (ArmyManager.Instance.thane.changeShapeId > 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.WildSoulFrame.CannotChangeMount"));
            return;
        }
        if (this.vData) {
            let templateId: number = this.vData.TemplateId;
            if (this._isLock) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("WildSoulItem.tips"));
                return;
            }
            if (SpaceManager.Instance.model && !SpaceManager.Instance.model.canLand(templateId)) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("map.space.CannotLand"));
                return;
            }
            if (SwitchPageHelp.isInCampaign && PlayerManager.Instance.currentPlayerModel.isOnObstacle) {
                SpaceSocketOutManager.Instance.resetSpacePosition();
            }
            MountsManager.Instance.changeMount(templateId);
            // UIManager.Instance.HideWind(EmWindow.WildSoulWnd);
        }
    }

    /**坐骑炼化 */
    private lianHuaBtnHandler(event: Laya.Event) {
        event.stopPropagation();
        if (!this.wildSoulCollection.isLightTemplate(this._vData.TemplateId)) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("WildSoulItem.lianHua.tips"));
            return;
        }
        FrameCtrlManager.Instance.open(EmWindow.MountRefiningWnd, { info: this._vData });
    }

    private get curMountInfo(): MountInfo {
        return MountsManager.Instance.mountInfo;
    }

    public get vData(): t_s_mounttemplateData {
        return this._vData;
    }

    public set vData(value: t_s_mounttemplateData) {
        this._vData = value;
        this.clear();
        if (this._vData) {
            this.addEvent();
            if (this._vData.MountType == MountType.NORMAL) {
                this.baseItem.nameTxt.text = this._vData.TemplateNameLang + " " + LangManager.Instance.GetTranslation("mounts.command01", this._vData.Property2);
                this.baseItem.nameTxt.color = ComponentSetting.setColor(2);
            } else {
                this.baseItem.nameTxt.text = this._vData.TemplateNameLang
            }
            if (this._vData.MountType == MountType.MAGIC || this.isLock) {
                this.tipType = EmWindow.MountTips;
            }
            this.tipData = this._vData;
            let url: string = "";
            url = PathManager.getSMountPath(this._vData.AvatarPath);
            MountsManager.Instance.mountResUrlMap.set(url, true);
            this.LoadSoulItem(url);
            if (this.wildSoulCollection.isLightTemplate(this._vData.TemplateId)) {
                this.unlock();
            }
            //可以炼化,显示炼化按钮
            this.lianHuaBtn.getChild("redDot").visible = this.getLianHuaEnable();
            if (this._vData.StarItem != 0) {
                //未激活 显示查看
                if (this.isLock) {
                    this.lianHuaBtn.visible = false;
                    this.lookViewBtn.visible = true;
                } else {
                    this.lianHuaBtn.visible = true;
                    //背包还有坐骑卡可以用来炼化
                    this.lookViewBtn.visible = false;
                }
                this.baseItem.comStar.visible = true;
            } else {//不显示炼化
                this.lianHuaBtn.visible = false;
                this.baseItem.comStar.visible = false;
                //不显示炼化的时候 显示查看
                this.lookViewBtn.visible = true;
            }
            this.baseItem.VipImg.visible = this.isVIPMount;
            this.baseItem.limitImg.visible = this._vData.Limited == 1 ? true : false;
            let info: WildSoulInfo = this.wildSoulCollection.getWildSoulInfo(this._vData.TemplateId);
            this.cStarNum.selectedIndex = info ? info.starLevel : 0;
        } else {
            this.tipType = EmWindow.CommonTips;
            this.tipData = LangManager.Instance.GetTranslation("mounts.WildsoulItem.tipsNoOpen");
        }
    }

    private get isVIPMount(): boolean {
        if (this.vData) {
            let isVIPMount = VIPManager.Instance.model.isVipMount(this.vData.TemplateId)
            return isVIPMount;
        }
        return false;
    }

    private async LoadSoulItem(url: string) {
        let self = this;
        ResMgr.Instance.loadRes(url, (res) => {
            self.loaderCompleteHandler(res);
        }, null, Laya.Loader.ATLAS);
    }

    private _preUrl: string;
    private _cacheName: string;

    private loaderCompleteHandler(res: any) {
        if (this.isDisposed) {
            return;
        }
        if (this._mountMovieClip) {
            this._mountMovieClip.stop();
            this._mountMovieClip.parent && this._mountMovieClip.parent.removeChild(this._mountMovieClip);
        }
        if (!res) {
            return;
        }
        this._preUrl = res.meta.prefix;
        this._cacheName = this._preUrl;
        let aniName = "";
        AnimationManager.Instance.createAnimation(this._preUrl, aniName, 0, "", AnimationManager.MapPhysicsFormatLen);
        this._mountMovieClip = new MovieClip(this._cacheName);
        MountsManager.Instance.mountCacheNameUrlMap.set(this._cacheName, true);
        this.baseItem.displayObject.addChildAt(this._mountMovieClip, 1);
        this._mountMovieClip.gotoAndStop(1);
        this._mountMovieClip.scale(this._scaleNumber, this._scaleNumber);
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

        let templateId = this.vData.TemplateId;
        if (templateId == 8026 || templateId == 8053) {
            //8026（火箭飞艇） 8053（囚牛）位置调右一点
            offsetX = 30;
            offsetY = 30;
        } else if (templateId == 3041) {
            // 恩克2000（3041）
            offsetX = 60;
            offsetY = 30;
        } else if (templateId == 8233) {
            // 图腾魔像（8233）
            offsetX = 10;
            offsetY = -10;
        } else if (templateId == 3069) {
            // 梦幻鹿（3069）
            offsetX = 60;
            offsetY = 0;
        } else if (templateId == 8160) {
            // 白金刚（8160）
            offsetX = 0;
            offsetY = 0;
        } else if (templateId == 8215) {
            // 独轮车（8215）
            offsetX = 0;
            offsetY = -30;
        } else if (templateId == 8204) {
            // 白羽（8204）
            offsetX = 50;
            offsetY = 0;
        } else if (templateId == 8334) {
            // 人马DJ
            offsetX = -20;
            offsetY = 0;
        } else if (templateId == 8201) {
            // 破坏炸弹
            offsetX = 30;
            offsetY = 30;
        } else if (templateId == 8217) {
            // 金色火龙
            offsetX = -40;
            offsetY = 30;
        } else {
            offsetX = 0;
            offsetY = 30;
        }

        this._mountMovieClip.gotoAndPlay(1, true);
        this._mountMovieClip.x = (this.displayObject.width >> 1) + offsetX;
        this._mountMovieClip.y = (this.displayObject.height >> 1) + offsetY - 20;
        // this.addWeakBreatheAction();
    }

    private addWeakBreatheAction() {
        if (!this._mountMovieClip || this._mountMovieClip.destroyed) return;


        Laya.Tween.to(this._mountMovieClip, { scaleX: this._scaleNumber + .01, scaleY: this._scaleNumber + .04 }, 800, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
            if (!this._mountMovieClip || this._mountMovieClip.destroyed) return;
            Laya.Tween.to(this._mountMovieClip, { scaleX: this._scaleNumber, scaleY: this._scaleNumber }, 800, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                this.addWeakBreatheAction()
            }));
        }));
    }

    private clear() {
        this.lock();
        ToolTipsManager.Instance.unRegister(this);
        this.baseItem.nameTxt.text = "";
        this.baseItem.VipImg.visible = false;
        this.baseItem.limitImg.visible = false;
        if (this._mountMovieClip) {
            this._mountMovieClip.stop();
            this._mountMovieClip.parent && this._mountMovieClip.parent.removeChild(this._mountMovieClip);
        }
    }

    public get isLock(): boolean {
        return this._isLock;
    }

    private lock() {
        this.baseItem.lockImg.visible = true;
        this._isLock = true;
        UIFilter.gray(this.baseItem);
        this.activeBtn.visible = true;
        this.activeBtn.getChild("redDot").visible = false;
        //是否可以激活
        if (this.wildSoulCollection.canActive(this._vData)) {
            UIFilter.normal(this.activeBtn);
            this.activeBtn.titleColor = '#FFF6B9';
            // @ts-ignore
            this.activeBtn._titleObject.strokeColor = '#7F2101';
            this.activeBtn.getChild("redDot").visible = true;
        } else {
            UIFilter.gray(this.activeBtn);
            // 按钮文字和描边直接设置为灰色, 但是能点击
            this.activeBtn.titleColor = '#aaaaaa';
            // @ts-ignore
            this.activeBtn._titleObject.strokeColor = '#666666';
        }
        this.changeBtn.visible = false;
        this._onMountStateChange();
        this.lianHuaBtn.visible = false;
        this.lianHuaBtn.getChild("redDot").visible = this.getLianHuaEnable();
        this.activeBtn.visible = true;
        this.lookViewBtn.visible = true;

    }

    private unlock() {
        this.baseItem.lockImg.visible = false;
        this._isLock = false;
        UIFilter.normal(this.baseItem);
        this.activeBtn.visible = false;
        this.changeBtn.visible = false;
        this._onMountStateChange();
        this.lianHuaBtn.visible = true;
        this.lianHuaBtn.getChild("redDot").visible = this.getLianHuaEnable();
        this.lookViewBtn.visible = false;
    }

    private getLianHuaEnable(): boolean {
        let flag2: boolean = false;
        let flag1: boolean = GoodsManager.Instance.getGoodsNumByTempId(this._vData.StarItem) > 0 ? true : false;
        var info: WildSoulInfo = this.wildSoulCollection.getWildSoulInfo(this._vData.TemplateId);
        if (info) {
            flag2 = info.starLevel < MountsManager.Instance.maxStarGrade;
        }
        return flag1 && flag2;
    }

    private get wildSoulCollection(): WildSoulCollection {
        return MountsManager.Instance.avatarList;
    }

    public getUrl(path: string): string {
        return PathManager.resourcePath + "equip_show" + path.toLocaleLowerCase() + "/2/2.json";
    }

    private get mountInfo(): MountInfo {
        return MountsManager.Instance.mountInfo;
    }

    public dispose() {
        this.removeEvent();
        ToolTipsManager.Instance.unRegister(this);
        if (this._vData) {
            let url: string = this.getUrl(this._vData.AvatarPath);
            ResMgr.Instance.cancelLoadByUrl(url);
        }
        if (this._mountMovieClip) {
            this._mountMovieClip.stop();
            this._mountMovieClip = null;
        }
        super.dispose();
    }
}
