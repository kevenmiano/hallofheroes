import ResMgr from "../../../core/res/ResMgr";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { MovieClip } from "../../component/MovieClip";
import { AnimationManager } from "../../manager/AnimationManager";
import { MountsManager } from "../../manager/MountsManager";
import { PathManager } from "../../manager/PathManager";
import { MountInfo } from "./model/MountInfo";
import { MessageTipManager } from '../../manager/MessageTipManager';
import LangManager from '../../../core/lang/LangManager';
import MountRefiningItem from "./MountRefiningItem";
import { t_s_mounttemplateData } from '../../config/t_s_mounttemplate';
import { GoodsManager } from "../../manager/GoodsManager";
import { WildSoulCollection } from "./model/WildSoulCollection";
import { WildSoulInfo } from "./model/WildSoulInfo";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { UpgradeType } from "../../constant/UpgradeType";
import { TempleteManager } from "../../manager/TempleteManager";
import { MountsEvent, NotificationEvent } from '../../constant/event/NotificationEvent';
import { BaseItem } from '../../component/item/BaseItem';
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { NotificationManager } from "../../manager/NotificationManager";
import { BagType } from "../../constant/BagDefine";
import ColorConstant from "../../constant/ColorConstant";
import UIButton from "../../../core/ui/UIButton";
import Utils from "../../../core/utils/Utils";
/**
 * 坐骑炼化
 */
export default class MountRefiningWnd extends BaseWindow {
    public state: fgui.Controller;
    public bgImg: fgui.GImage;
    public img_star1: fgui.GImage;
    public img_star2: fgui.GImage;
    public descTxt3: fgui.GTextField;
    public countTxt: fgui.GTextField;
    public baseItem: BaseItem;
    public trainBtn: UIButton;
    public progressTxt: fgui.GTextField;
    public maxGradeTxt: fgui.GTextField;
    public itemList: fgui.GList;
    public mountNameTxt: fgui.GRichTextField;
    public descTxt1: fgui.GTextField;
    public descTxt2: fgui.GTextField;
    private _mountMovieClip: MovieClip;
    private _preUrl: string;
    private _cacheName: string;
    private _path: string;
    private _resUrl: string;
    private _vData: t_s_mounttemplateData;
    private _arr: t_s_upgradetemplateData[];
    private _isReceiveMax: boolean = false;//是否达到最大星级
    private _currentStarLevel: number = 0;
    public progress: fgui.GProgressBar;

    private _costTemplateId: number = 208051;//消耗道具模板id
    private _totalCoinCount: number = 0;//拥有的道具数量
    private _totalMountCardCount: number = 0;//拥有的坐骑卡数量
    private _needCardCount: number = 1;//需要的坐骑卡数量
    private _type: number = 0;
    public OnInitWind() {
        this.addEvent();
        this.setCenter();
        this._vData = this.frameData.info;
    }

    OnShowWind() {
        super.OnShowWind();
        this.descTxt1.text = LangManager.Instance.GetTranslation("MountRefiningWnd.descTxt1");
        this.descTxt2.text = LangManager.Instance.GetTranslation("MountRefiningWnd.descTxt2");
        this.descTxt3.text = LangManager.Instance.GetTranslation("MountRefiningWnd.descTxt3");
        this.maxGradeTxt.text = LangManager.Instance.GetTranslation("MountRefiningWnd.maxGradeTxt");
        this._arr = TempleteManager.Instance.getTemplatesByType(UpgradeType.MOUNT_REFINING);
        this.state = this.contentPane.getController("state");
        this.refreshView();
    }

    private addEvent() {
        this.itemList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.trainBtn.onClick(this, this.trainBtnHandler);
        this.mountInfo.addEventListener(MountsEvent.MOUNT_STAR_UP, this.mountStarInfoUpdate, this);
    }

    private removeEvent() {
        this.trainBtn.offClick(this, this.trainBtnHandler);
        this.mountInfo.removeEventListener(MountsEvent.MOUNT_STAR_UP, this.mountStarInfoUpdate, this);
    }

    /**炼化 */
    private trainBtnHandler() {
        if (this._type == 3) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("MountRefiningWnd.train.tips"))
            return;
        }
        if (this._vData) {
            if (this._type == 2) {//使用材料
                MountsManager.Instance.refining(this._vData.TemplateId, 1);
            }
            else {
                MountsManager.Instance.refining(this._vData.TemplateId, 0);
            }
        }
    }

    private mountStarInfoUpdate() {
        this.refreshView();
    }

    private helpBtnClick() {
        let title: string = LangManager.Instance.GetTranslation("mountRefiningWnd.help.title");
        let content: string = LangManager.Instance.GetTranslation("mountRefiningWnd.help.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private renderListItem(index: number, item: MountRefiningItem) {
        item.index = index;
        item.isMax = this._isReceiveMax;
        item.starLevel = this._currentStarLevel
        item.vData = this._vData;
    }

    private refreshView() {
        var info: WildSoulInfo = this.wildSoulCollection.getWildSoulInfo(this._vData.TemplateId);
        if (info) {
            this.updateAvatar(info.template.AvatarPath);
            this.mountNameTxt.text = info.template.TemplateNameLang;
            this.img_star1.fillAmount = this.img_star2.fillAmount = info.starLevel / 5;
            this._currentStarLevel = info.starLevel;
            let goodsInfo: GoodsInfo = new GoodsInfo();
            this._totalCoinCount = GoodsManager.Instance.getBagCountByTempId(BagType.Player, this._costTemplateId);
            this._totalMountCardCount = GoodsManager.Instance.getGoodsNumByTempId(this._vData.StarItem);
            let soulMonsterCount = Math.ceil(this._vData.Power / 5);
            let view = this.trainBtn.getView();
            let dot;
            if (view) {
                dot = view.getChild('redDot');
                if (dot) dot.visible = false;
            }
            if (this._totalMountCardCount >= this._needCardCount) {//坐骑卡数量足够
                this.countTxt.text = this._totalMountCardCount.toString() + "/" + this._needCardCount;
                goodsInfo.templateId = this._vData.StarItem;
                this.baseItem.info = goodsInfo;
                this.countTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
                this._type = 1;
                if (dot) dot.visible = false;
            }
            else if (this._totalCoinCount >= soulMonsterCount) {//道具数量足够
                this.countTxt.text = this._totalCoinCount.toString() + "/" + soulMonsterCount;
                goodsInfo.templateId = this._costTemplateId;
                this.baseItem.info = goodsInfo;
                this.countTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
                this._type = 2;
            }
            else {
                this.countTxt.text = this._totalCoinCount.toString() + "/" + soulMonsterCount;
                goodsInfo.templateId = this._costTemplateId;
                this.baseItem.info = goodsInfo;
                this.countTxt.color = ColorConstant.RED_COLOR;
                this._type = 3;
            }
            if (info.starLevel >= MountsManager.Instance.maxStarGrade) {//达到最大等级
                this.state.selectedIndex = 1;
                this._isReceiveMax = true;
            }
            else {
                this.state.selectedIndex = 0;
                this._isReceiveMax = false;
                this.progressTxt.text = info.blessing + "/" + this.getCurrentTotalBlessValue(info.starLevel);
            }
            this.progress.value = info.blessing * 100 / this.getCurrentTotalBlessValue(info.starLevel);
        }
        this.baseItem.setIsActiveVisible();
        this.itemList.numItems = 5;
    }

    private updateAvatar(path: string) {
        if (this._path == path) {
            return;
        }
        this._path = path;
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

        let templateId = this._vData.TemplateId;
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

    private get mountInfo(): MountInfo {
        return MountsManager.Instance.mountInfo;
    }

    private getUrl(path: string): string {
        return PathManager.resourcePath + "equip_show" + path.toLocaleLowerCase() + "/2/2.json";
    }

    private get wildSoulCollection(): WildSoulCollection {
        return MountsManager.Instance.avatarList;
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }



    /**升级到下一星级需要的祝福值 */
    private getCurrentTotalBlessValue(grade: number): number {
        let startData: number = 0;
        let item: t_s_upgradetemplateData;
        for (let i = 0; i < this._arr.length; i++) {
            item = this._arr[i];
            if (item.Grades == grade + 1) {
                startData = item.Data;
            }
        }
        return startData;
    }

    dispose() {
        super.dispose();
        this.itemList && this.itemList.selectNone();
        // this.itemList && this.itemList.itemRenderer && this.itemList.itemRenderer.recover();
        Utils.clearGListHandle(this.itemList);
        if (this._mountMovieClip) {
            this._mountMovieClip.stop();
            this._mountMovieClip = null;
        }
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CLOSE_MOUNT_REFINING_WND);
    }
}