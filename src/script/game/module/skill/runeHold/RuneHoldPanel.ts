import FUI_RuneHoldComponet from "../../../../../fui/Skill/FUI_RuneHoldComponet";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import SkillWndCtrl from "../SkillWndCtrl";
import SkillWndData from "../SkillWndData";
import { RuneHoldEffectLock2 } from "./RuneHoldEffectLock2";
import { RuneHoldList } from "./RuneHoldList";
import { RuneHoldListItem } from "./RuneHoldListItem";
import { RuneHoldOption } from "./RuneHoldOption";
import { RuneHoldRune } from "./RuneHoldRune";
import { RuneHoldValueLock2 } from "./RuneHoldValueLock2";

export class RuneHoldPanel extends FUI_RuneHoldComponet {
    constructor() {
        super();
    }

    declare public holdListComp: RuneHoldList;

    declare public holdRuneComp: RuneHoldRune;

    declare public optionComp: RuneHoldOption;

    declare public hel: RuneHoldEffectLock2;
    declare public hvl: RuneHoldValueLock2;


    private skillData: SkillWndData;

    private runeHoles: RuneHoleInfo[];

    protected onConstruct() {
        super.onConstruct();
        this.skillData = this.controler.data;
        this.holdListComp.list.on(fairygui.Events.CLICK_ITEM, this, this.onHoleListClick)
        this.holdRuneComp.setItemClick(this.onHoldRuneCompClick.bind(this));
    }


    public init() {
        this.runeHoles = this.skillData.runeHoles;
        this.holdListComp.setListData(this.runeHoles);
        this.updateView();
        this.curInfo = this.runeHoles[0];
        this.changeHoleData(this.runeHoles[0]);
        this.addEvent();
        this.optionComp.updateRuneReddot();
    }

    private addEvent() {
        this.skillData.addEventListener(SkillWndData.UPDATE_RUNEHOLE_INFO, this.updateView, this);
        this.hel.onClick(this, this.onHoldEffectClick);
        this.hvl.onClick(this, this.onHoldValueClick);
        this.optionComp.backBtn.onClick(this, this.onBackToHold)
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.updateView, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.RUNE_GEM_ENERGY, this.updateRuneReddot, this);
    }

    private updateView() {
        this.holdListComp.refresh();
        this.holdRuneComp.updateView();
        this.optionComp.updateView();
        this.hel.updateView();
        this.hvl.updateView();
    }


    public get runeHoleInfo(): RuneHoleInfo {
        return this.curInfo
    }

    private curInfo: RuneHoleInfo;
    private onHoleListClick(item: RuneHoldListItem) {
        this.curInfo = item.info;
        this.changeHoleData(this.curInfo);
    }

    private changeHoleData(info: RuneHoleInfo) {
        this.holdRuneComp.info = info;
        this.optionComp.info = info;
        this.hel.info = info;
        this.hvl.info = info;
        this.RadioGroup.selectedIndex = -1;
        this.holdRuneComp.RadioGroup.selectedIndex = -1;
    }

    //info 符石信息,pos 位置
    private onHoldRuneCompClick(info: GoodsInfo | number, pos: number) {

        this.optionComp.showRune(pos);
        this.RadioGroup.selectedIndex = -1;
        if (info instanceof GoodsInfo) {

            return;
        }
        //锁定
        if (info == 0) {
            return;
        }

        //未装备
        if (info == -1) {
            // UIManager.Instance.ShowWind(EmWindow.RuneHoldEquipWnd, [this.holdRuneComp.info, pos]);
        }
    }

    private onHoldValueClick() {
        this.optionComp.showValue();
        this.holdRuneComp.RadioGroup.selectedIndex = -1;
    }


    private onHoldEffectClick() {
        this.optionComp.showEffect();
        this.holdRuneComp.RadioGroup.selectedIndex = -1;
    }

    private updateRuneReddot() {
        this.optionComp.updateRuneReddot();
    }

    private onBackToHold() {
        this.changeHoleData(this.curInfo);
    }

    private get controler(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }

    private deleteEvent() {
        this.skillData.removeEventListener(SkillWndData.UPDATE_RUNEHOLE_INFO, this.updateView, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.updateView, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.RUNE_GEM_ENERGY, this.updateRuneReddot, this);
    }


    dispose(): void {
        this.deleteEvent();
    }

}