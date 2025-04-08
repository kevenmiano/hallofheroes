/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 10:43:29
 * @LastEditTime: 2024-04-22 17:47:51
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import AudioManager from "../../../../core/audio/AudioManager";
import LangManager from "../../../../core/lang/LangManager";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { DragObject, DragType } from "../../../component/DragObject";
import { eFilterFrameText, FilterFrameText } from "../../../component/FilterFrameText";
import { MovieClip } from "../../../component/MovieClip";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { SoundIds } from "../../../constant/SoundIds";
import { StarBagType, StarEvent } from "../../../constant/StarDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { AnimationManager } from "../../../manager/AnimationManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { StarManager } from "../../../manager/StarManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import { StarHelper } from "../../../utils/StarHelper";
import StarInfo from "../../mail/StarInfo";
import Logger from '../../../../core/logger/Logger';
import FUI_StarItem from "../../../../../fui/Star/FUI_StarItem";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { ResRefCountManager } from "../../../managerRes/ResRefCountManager";
import { NotificationManager } from "../../../manager/NotificationManager";

//FUI_StarItem
export default class StarItem extends FUI_StarItem implements DragObject, ITipedDisplay {
    tipData: any;
    extData: any;
    tipType: EmWindow = EmWindow.StarTip;
    canOperate: boolean = false;
    startPoint: Laya.Point = new Laya.Point(0, 0)
    showType: TipsShowType = TipsShowType.onClick
    dragType: DragType = null;
    dragEnable: boolean = true;
    moveDistance = 40;

    getDragType(): DragType {
        return this.dragType;
    }

    setDragType(value: DragType) {
        this.dragType = value;
    }

    getDragEnable(): boolean {
        return this.dragEnable;
    }

    setDragEnable(value: boolean) {
        this.dragEnable = value;
    }

    getDragData() {
        return this._info;
    }

    setDragData(value: any) {
        this._info = value;
    }

    public registerDrag() {
        // DragManager.Instance.registerDragObject(this, this.onDragComplete.bind(this));
    }

    /**
     * 
     * @param dstTarget 目标对象
     * @param srcTarget 原始对象
     */
    private onDragComplete(dstTarget, srcTarget) {
        if (dstTarget) {
            if (dstTarget instanceof StarItem && srcTarget.info) {
                if (srcTarget != dstTarget && srcTarget.opened && dstTarget.opened) {
                    this.swap(dstTarget, srcTarget);
                } else {
                    this.setItemBack(srcTarget)
                }
            }
        } else {//不处理交换
            this.setItemBack(srcTarget)
        }
    }

    private setItemBack(srcTarget) {
        let selfDragData = srcTarget.getDragData();
        this.setDragData(selfDragData);
    }

    /**逻辑处理 */
    private swap(dstTarget, srcTarget) {
        // let temp = srcTarget.getDragData();
        // srcTarget.setDragData(self.getDragData());
        // self.setDragData(temp);

        if (dstTarget.info != null) {
            this._beEatenStar = srcTarget;
            this._eatStar = dstTarget;
            if (srcTarget.info.template.Profile == 6) {
                this._beEatenStar = dstTarget;
                this._eatStar = srcTarget;
            }
            if (this._beEatenStar.locked) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("vicepassword.description11"));
                this.setItemBack(srcTarget)
                return;
            }
            var tempName: string = StarHelper.getStarHtmlName(this._eatStar.info.template);
            var tempExp: number = StarHelper.getStarTotalExp(this._beEatenStar.info);
            var tempLevel: number = StarHelper.checkCanUpGrade(tempExp, this._eatStar.info);
            var tempStr: string = LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.tempStr", tempName, tempExp);
            if (tempLevel > this._eatStar.info.grade) {
                tempStr += LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.Level.up", tempLevel);
            }

            SimpleAlertHelper.Instance.Show(null, srcTarget, null, tempStr, null, null, this.__composeResponse.bind(this));
            this.setItemBack(srcTarget)
        } else {
            if (srcTarget.bagType == StarBagType.PLAYER && dstTarget.bagType == StarBagType.THANE) {
                if (srcTarget.info.template.Profile == 6) {
                    let str = LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.command01");
                    MessageTipManager.Instance.show(str);
                    this.setItemBack(srcTarget)
                    return;
                }
                var infoList: SimpleDictionary = StarManager.Instance.getStarListByBagType(StarBagType.THANE);
                let arr: any[] = infoList.getList();
                let len: number = arr.length;
                for (let index = 0; index < len; index++) {
                    const info = arr[index] as StarInfo;
                    if (info.template.MasterType == srcTarget.info.template.MasterType) {
                        let str = LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.command02");
                        MessageTipManager.Instance.show(str);
                        this.setItemBack(srcTarget)
                        return;
                    }
                }
            }
            AudioManager.Instance.playSound(SoundIds.STAR_EQUIP_SOUND);
            StarManager.Instance.starMove(srcTarget.bagPos, srcTarget.bagType, dstTarget.bagPos, dstTarget.bagType);
        }
    }

    private __composeResponse(boolean: boolean, flag: boolean, target: StarItem) {
        if (boolean && this._info && target && target.info) {
            var tempTarget: StarItem;
            var tempBag: StarItem;
            if (target.info.template.Profile == 6) {
                tempTarget = this;
                tempBag = target;
            }
            else {
                tempTarget = target;
                tempBag = this;
            }
            var maxGrade: number = StarHelper.getStarMaxGradeByProfile(this._eatStar.info.template.Profile);
            if (tempTarget.info.grade >= maxGrade) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.command03"));
                return;
            }
            if (this._beEatenStar.info.template.Profile >= 5 && this._beEatenStar.info.template.Profile != 6) {
                let content: string = LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.confirmComposeTip", StarHelper.getStarHtmlName(this._beEatenStar.info.template))
                // + "\n" + LangManager.Instance.GetTranslation("yishi.view.ConfirmSellFrame.content.htmlText02") 
                // +"<font color='#01ccff'>[YES]</font>" + LangManager.Instance.GetTranslation("cell.view.starbag.StarBagCell.confirmComposeTip2");
                SimpleAlertHelper.Instance.Show(null, this._eatStar, null, content, null, null, this.composeCall.bind(this));
                return;
            }
            this.composeCall(boolean, true, this._eatStar);
        }
    }

    private composeCall(b: boolean, flag: boolean, target: StarItem) {
        if (b && this._info && target) {
            AudioManager.Instance.playSound(SoundIds.STAR_COMPOSE_SOUND);
            StarManager.Instance.starMove(this._beEatenStar.info.pos, this._beEatenStar.info.bagType, this._eatStar.bagPos, this._eatStar.bagType, true);
        }
    }

    //////////////////////////////////////////////////////////
    private _info: StarInfo;
    private _movie: MovieClip = new MovieClip();
    private _eatStar: StarItem;
    private _beEatenStar: StarItem;

    public index: number = -1;
    public bagType = StarBagType.RECYCLE;
    public bagPos: number = -1;
    public opened: boolean = true;
    public static STAR_SCALE: number = 1.6;

    private _locked: boolean = false;
    public set locked(value: boolean) {
        this._locked = value
        this.imgLock.visible = value;
    }
    public get locked(): boolean {
        return this._locked
    }

    onConstruct() {
        super.onConstruct()
        this.displayObject.addChildAt(this._movie, 0);
        this._movie.scale(StarItem.STAR_SCALE, StarItem.STAR_SCALE);
        this.addEvent();
    }

    private addEvent() {
        NotificationManager.Instance.addEventListener(StarEvent.STAR_EXCHANGE, this.lockHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.EXIT_STAR_EXCHANGE, this.unlockHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.EXIT_STAR_LEFT_EXCHANGE, this.unlockHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.STAR_LEFT_EXCHANGE, this.lockHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.STAR_COMPOSE, this.lockHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.STAR_COMPOSE_COMPLETE, this.unlockHandler, this);
        NotificationManager.Instance.addEventListener(StarEvent.STAR_NEW_COMPOSE, this.lockHandler, this);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(StarEvent.STAR_EXCHANGE, this.lockHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.EXIT_STAR_EXCHANGE, this.unlockHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.EXIT_STAR_LEFT_EXCHANGE, this.unlockHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.STAR_LEFT_EXCHANGE, this.lockHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.STAR_COMPOSE, this.lockHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.STAR_COMPOSE_COMPLETE, this.unlockHandler, this);
        NotificationManager.Instance.removeEventListener(StarEvent.STAR_NEW_COMPOSE, this.lockHandler, this);
    }

    private lockHandler() {
        ToolTipsManager.Instance.unRegister(this);
    }

    private unlockHandler() {
        ToolTipsManager.Instance.register(this);
    }

    public set info(data: StarInfo) {
        this.resetItem()
        this._info = data
        this.locked = false;
        if (data) {
            //
            this.tipData = data;
            ToolTipsManager.Instance.register(this);

            // 加载、播放、记录动画
            if (data.template) {


                let realPath = IconFactory.getStarIconPath(data.template.Icon)
                ResRefCountManager.loadRes(realPath, (res) => {
                    if (!res) {
                        Logger.warn("[StarItem]info realPath assets is null", realPath)
                        return
                    }
                    if (!res.meta) {
                        Logger.warn("[StarItem]info realPath assets meta is null", realPath)
                        return
                    }

                    let prefix = res.meta.prefix;
                    let frames = res.frames;
                    let sourceSize = new Laya.Rectangle();
                    for (let key in frames) {
                        if (Object.prototype.hasOwnProperty.call(frames, key)) {
                            let sourceItem = frames[key].sourceSize;
                            sourceSize.width = sourceItem.w;
                            sourceSize.height = sourceItem.h;
                            break;
                        }
                    }
                    let cacheName = prefix + String(data.template.Icon);
                    let aniCahce = AnimationManager.Instance.getCache(cacheName)
                    let success: boolean = true
                    if (!aniCahce) {
                        success = AnimationManager.Instance.createAnimation(cacheName, "", 0)
                    }

                    this._movie.visible = true
                    this._movie.gotoAndPlay(0, true, cacheName)
                    this._movie.pos((this.width - sourceSize.width * StarItem.STAR_SCALE) / 2, (this.height - sourceSize.height * StarItem.STAR_SCALE) / 2)

                    ResRefCountManager.setAniCacheName(realPath, cacheName)
                    ResRefCountManager.getRes(realPath)
                })
            }

            let nameStr = data!.template!.TemplateNameLang;
            this.txtName.text = nameStr;
            let color = FilterFrameText.Colors[eFilterFrameText.StarQuality][data.template.Profile - 1];
            this.txtName.color = color

            if (this.bagType == StarBagType.PLAYER || this.bagType == StarBagType.THANE) {
                // nameStr += " " + LangManager.Instance.GetTranslation("public.level2", data.grade);
                // this.txtLevel.color = color
                this.txtLevel.text = LangManager.Instance.GetTranslation("public.level2", data.grade);
            }

            this.locked = data.composeLock;
        }
    }

    public get info() {
        return this._info
    }

    public gray() {
        this._movie.filters = [UIFilter.grayFilter];
    }

    public normal() {
        this._movie.filters = [UIFilter.normalFilter];
    }

    public resetItem() {
        if (this._info) {
            let realPath = IconFactory.getStarIconPath(this._info.template.Icon)
            ResRefCountManager.clearRes(realPath)
            ToolTipsManager.Instance.unRegister(this);
        }
        this._movie.stop()
        this._movie.visible = false
        this.tipData = null
        this.txtName.text = "";
        this.txtLevel.text = "";
        this.imgLock.visible = false
    }

    public dispose() {
        this.removeEvent();
        this.resetItem()
        super.dispose();
    }
}