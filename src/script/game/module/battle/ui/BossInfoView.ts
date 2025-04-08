/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-07 21:17:30
 * @LastEditTime: 2024-02-02 14:39:22
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import FUI_BossInfoView from "../../../../../fui/CampaignCommon/FUI_BossInfoView";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import Logger from "../../../../core/logger/Logger";
import UIButton, { UIButtonChangeType } from "../../../../core/ui/UIButton";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { HeroRoleInfo } from "../../../battle/data/objects/HeroRoleInfo";
import { StripUIView } from "../../../component/StripUIView";
import { t_s_herotemplateData } from "../../../config/t_s_herotemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { BattleEvent, NativeEvent } from "../../../constant/event/NotificationEvent";
import { IStrip } from "../../../interfaces/IStrip";
import { BossBufferContainer } from './buffer/BossBufferContainer';
import ResMgr from '../../../../core/res/ResMgr';
import Resolution from "../../../../core/comps/Resolution";
import { NotificationManager } from "../../../manager/NotificationManager";

export class BossInfoView extends FUI_BossInfoView {
    public static UIName: string = "BossInfoView";

    protected tempEffectList: any[] = [];
    
    protected _stripNum: number = 0;
    public get stripNum(): number { return this._stripNum; }
    protected _headUrl: string;
    protected _hpStrip: IStrip;
    protected _info: HeroRoleInfo;
    protected _buffContainer: BossBufferContainer;

    protected r_hp: fgui.GTextField; // unuse
    protected r_name: fgui.GTextField;
    protected r_grade: fgui.GTextField;
    protected r_title: fgui.GTextField; // 称谓
    protected hpProgress: fgui.GComponent;
    protected uibtnHead: UIButton;

    onConstruct() {
        super.onConstruct();
        this.uibtnHead = new UIButton(this.btnHead);
        this.uibtnHead.changeType = UIButtonChangeType.Light;
        this.showTrail(0);
        if (this.battleModel){
            this.showTrail(this.battleModel.isTrail() ? this.battleModel.trialLayer : 0);
        }
        this._buffContainer = new BossBufferContainer(this);
        this.addEvent();
    }

    public get bossBufferContainer(): BossBufferContainer {
        return this._buffContainer;
    }

    setParent(target) {
        if (!this.parent) {
            if (target instanceof Laya.Sprite) {
                target.addChild(this.displayObject)
            } else {
                target.addChild(this);
            }
            this.x = target.width - this.width - Resolution.deviceStatusBarHeightR;
            this.y = 0;
        }
    }

    private addEvent() {
        NotificationManager.Instance.addEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
        if (this.battleModel) {
            this.battleModel.addEventListener(BattleEvent.TRAIL_LAYER_CHANGE, this.__layerChangeHandler.bind(this), this);
        }
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
        if (this.battleModel) {
            this.battleModel.removeEventListener(BattleEvent.TRAIL_LAYER_CHANGE, this.__layerChangeHandler.bind(this), this);
        }
    }

    protected onAfterStatusBarChange() {
        if (this.parent) {
            this.x = this.parent.width - this.width - Resolution.deviceStatusBarHeightR;
        }
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }


    private __layerChangeHandler() {
        this.showTrail(this.battleModel.trialLayer)
    }

    // 试炼之塔层数
    private showTrail(level: number = 0) {
        this.trail.visible = level != 0
        this.txtTrailLevel.setVar("level",level.toString()).flushVars();
    }

    /**
     * BOSS信息.需包含以下值.
     * info.heroInfo.grades;
     * info.heroInfo.nickName;
     * info.heroInfo.templateId
     */
    public setInfo(info: HeroRoleInfo) {
        if (this._info && this._info.heroInfo.grades > info.heroInfo.grades) {
            return;
        }
        this._info = info;
        this.initView();
    }

    protected initView() {
        this.initBossHead();
        this.initBossHp()
        this.hpProgress = this.progBossHp.getChild('progress').asCom;
        let template: t_s_herotemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_herotemplate, (this._info.heroInfo.templateId).toString());
        if (!template) {
            return
        }
        this.r_grade.text = String(template.Grades);
        this.r_name.text = String(this._info.heroInfo.nickName);

        if (template.AddNameLang && template.AddNameLang != "undefined") {
            this.r_title.text = "<" + template.AddNameLang + ">";
        }
    }

    public initBossHead(info?: HeroRoleInfo) {
        if (info) {
            this._info = info;
        }
        if (this._info.playerIconId == 0) {//如果是非玩家,则使用英雄的icon
            this._headUrl = IconFactory.getHeroIconByPics(this._info.heroInfo.templateInfo.Icon);
        } else {//使用领主的icon
            this._headUrl = IconFactory.getHeroIconByPics(this._info.heroInfo.templateInfo.Icon);
        }
        this.uibtnHead.icon = this._headUrl;
    }

    private initBossHp() {
        this._stripNum = BattleModel.getBossHpStripNum(this._info.heroInfo.templateId)

        Logger.battle("[BossInfoView]initBossHp", this._info.heroInfo.templateId, this._stripNum)

        this.r_name = this.txtRBossName;
        this.r_grade = this.txtRBossGrade;
        this.r_title = this.txtRBossTitleName;

        let asset = []
        let comp = this.progBossHp;
        let transGImg = comp.getChild("transitionBar") as fgui.GImage
        if (this._stripNum <= 1) {
            asset.push(comp.getChild("level4"))
        } else {
            for (let i = 1; i <= this._stripNum; i++) {
                asset.push(comp.getChild("level" + i))
            }
        }

        this._hpStrip = new StripUIView(asset, undefined, undefined, transGImg);
    }

    /**
     * 总血量值.
     */
    public setTotalHp(value: number) {
        Logger.battle("[BossInfoView]setTotalHp", value)
        this._hpStrip.maxValue = value;
    }
    /**
     * 当前血量值.
     */
    public setCurrentHp(value: number) {
        this._hpStrip.currentValue = value;
    }
    public setCurrentIndex(value: number) {
        this._hpStrip.currentIndex = value;
    }

    /**
     * 更新世界BOSS的血量.
     */
    public updateWorldBossHp(updated: number) {
        if (updated == 0) {
            return;
        }
        Logger.battle("[BossInfoView]updateWorldBossHp", updated)
        this.setCurrentHp(this._hpStrip.currentValue + updated);
        this.playWorldBossHpEffect(updated);
    }

    /**
     * BOSS掉血特效 TODO
     * @param updated 
     */
    private playWorldBossHpEffect(updated: number) {
       
    }

    public dispose() {
        if (this.tempEffectList) this.tempEffectList.length = 0;
        ResMgr.Instance.cancelLoadByUrl(this._headUrl);
        if (this._hpStrip) this._hpStrip.dispose();
        if (this._buffContainer) this._buffContainer.dispose();
        this.removeEvent();
        super.dispose();
    }
}