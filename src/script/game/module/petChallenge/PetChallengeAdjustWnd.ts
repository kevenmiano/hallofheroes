/*
 * @Author: jeremy.xu
 * @Date: 2023-06-12 11:26:11
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-09-21 21:30:16
 * @Description: v1.7  英灵阵型调整
 */

import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import FUIHelper from "../../utils/FUIHelper";
import { PetData } from "../pet/data/PetData";
import { MessageTipManager } from "../../manager/MessageTipManager";
import LangManager from "../../../core/lang/LangManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import PetChallengeCtrl from "./PetChallengeCtrl";
import { PetChallengeAdjustPetItem } from "./item/PetChallengeAdjustPetItem";
import { PetChallengeAdjustSkillItem } from "./item/PetChallengeAdjustSkillItem";
import { NotificationManager } from "../../manager/NotificationManager";
import { RemotePetEvent } from "../../../core/event/RemotePetEvent";
import { PetChallengeAdjustFormationItem } from "./item/PetChallengeAdjustFormationItem";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import UIButton from "../../../core/ui/UIButton";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { ShopManager } from "../../manager/ShopManager";
import Utils from "../../../core/utils/Utils";
import { EmPetSkillItemType, PetSkillItem } from "../common/pet/PetSkillItem";
import { PetEvent } from "../../constant/event/NotificationEvent";


export class PetChallengeAdjustWnd extends BaseWindow {
    public frame: fgui.GLabel;
    public skillLab: fgui.GTextField;
    public petList: fgui.GList;
    public skillLibList: fgui.GList;
    public powerLab: fgui.GRichTextField;
    public petSkillLab: fgui.GTextField;
    public cShowSkillLib: fgui.Controller;
    public s1: PetChallengeAdjustSkillItem;
    public s2: PetChallengeAdjustSkillItem;
    public s3: PetChallengeAdjustSkillItem;
    public s4: PetChallengeAdjustSkillItem;
    public s5: PetChallengeAdjustSkillItem;
    public s6: PetChallengeAdjustSkillItem;
    public p4: PetChallengeAdjustFormationItem;
    public p5: PetChallengeAdjustFormationItem;
    public p6: PetChallengeAdjustFormationItem;
    public p1: PetChallengeAdjustFormationItem;
    public p2: PetChallengeAdjustFormationItem;
    public p3: PetChallengeAdjustFormationItem;

    public saveFormationBtn: UIButton;
    private playerPetDatas: PetData[];
    private petFormationViews: PetChallengeAdjustFormationItem[];
    private petSkillViews: PetChallengeAdjustSkillItem[];
    private curPet: PetData;

    private petColorNumObj: { [key: number]: number };
    private skillDataTempArr: t_s_skilltemplateData[] = [];
    private defaultPos = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    private posIndex = [2, 5, 8, 3, 6, 9];

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
    }

    public OnShowWind() {
        super.OnShowWind();
        this.addEvent();

        Utils.setDrawCallOptimize(this.skillLibList);
        this.skillLibList.displayObject["dyna"] = true;
        this.cShowSkillLib = this.getController("cShowSkillLib");
        this.control.data.formationString = this.playerInfo.petChallengeFormation;
        this.petColorNumObj = {};
        this.petFormationViews = [this.p1, this.p2, this.p3, this.p4, this.p5, this.p6];
        this.petSkillViews = [this.s1, this.s2, this.s3, this.s4, this.s5, this.s6];
        this.initPlayerPet();
        this.initChallengePet();

        for (let i = 0; i < this.petSkillViews.length; i++) {
            let item = this.petSkillViews[i]
            item.on(fgui.Events.DRAG_START, this, this.onPetSkillDragStart);
            item.on(fgui.Events.DROP, this, this.onPetSkillDrop);
            item.draggable = true;
        }
        this.skillLibList.on(fairygui.Events.CLICK_ITEM, this, this.onSkillLibListClickItem);
        this.skillLibList.itemRenderer = Laya.Handler.create(this, this.onRenderListLibItem, null, false);
        this.showFormationBtn(false);
    }

    public OnHideWind() {
        PetData.FastSkillKeyTemp = "";
        this.savePetFormation();
        this.removeEvent();
        super.OnHideWind();
    }

    private addEvent() {
        this.petList.setVirtual();
        this.petList.on(fgui.Events.CLICK_ITEM, this, this.onPetClick)
        this.petList.itemRenderer = Laya.Handler.create(this, this.onRenderPetList, null, false);
        this.contentPane.on(fgui.Events.DROP, this, this.onFastSkillDrop);
        this.playerInfo.addEventListener(PetEvent.PET_UPDATE, this.__petInfoUpdate, this);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_PET_LIST_CHANGE, this.__petformationChangeHandler, this);
        NotificationManager.Instance.addEventListener(RemotePetEvent.PET_CHANGE, this.petChangeHandler, this);
    }

    private removeEvent() {
        this.playerInfo.removeEventListener(PetEvent.PET_UPDATE, this.__petInfoUpdate, this);
        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_PET_LIST_CHANGE, this.__petformationChangeHandler, this);
        NotificationManager.Instance.removeEventListener(RemotePetEvent.PET_CHANGE, this.petChangeHandler, this);
    }

    private __petformationChangeHandler() {
        this.control.data.formationString = this.playerInfo.petChallengeFormation;

        this.updateInTeam();
    }

    private __petInfoUpdate(petData: PetData) {
        this.updateLearnFlag();
    }

    private initPlayerPet() {
        this.playerPetDatas = ArrayUtils.sortOn(this.playerInfo.petList, ["fightPower"], [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING])
        this.petList.numItems = this.playerPetDatas.length;
        if (this.playerPetDatas[0]) {
            Laya.timer.once(100, this, () => {
                if (this.destroyed) return;
                this.selectedPet(this.playerPetDatas[0]);
                this.petList.selectedIndex = 0;
            })
        }
    }

    private initChallengePet() {
        let arr: any[] = this.control.data.petChallengeFormationOfArray;// 1.4.7.3.6.9

        let formation = [-1,
        -1, arr[0], arr[3],
        -1, arr[1], arr[4],
        -1, arr[2], arr[5]];

        let petId: number = 0;
        let petView: PetChallengeAdjustFormationItem;
        let colorNum = 1;
        for (let i = 0; i < this.petFormationViews.length; i++) {
            petView = this.petFormationViews[i];
            petView.pos = this.posIndex[i];
            petId = formation[petView.pos]
            petView.petData = this.playerInfo.getPet(petId);
            if (petView.petData) {
                petView.corlorNum = colorNum;
                this.petColorNumObj[petView.petData.petId] = colorNum;
                colorNum++;
            }
            petView.on(fgui.Events.DRAG_START, this, this.onPetChallengeDragStart);
            petView.on(fgui.Events.DROP, this, this.onPetDrop);
            petView.draggable = true;
        }
    }

    private petChangeHandler(p: PetData) {
        if (!p) return;
        let arr = this.control.data.petChallengeFormationOfArray;
        let pos = arr.indexOf(p.petId + "");
        //休息
        if (pos >= 0) {
            let count: number = 0;
            arr.forEach((ele) => {
                if (ele > 0) count++;
            });
            if (count <= 1) {
                let tip: string = LangManager.Instance.GetTranslation("PetFormationFrame.noPetInFormation");
                MessageTipManager.Instance.show(tip);
                return
            }

            for (let item of this.petFormationViews) {
                if (item.petData && item.petData.petId == p.petId) {
                    item.petData = null;
                    item.corlorNum = 0;
                    this.petColorNumObj[p.petId] = 0;
                    this.showFormationBtn(true);
                    break;
                }
            }

            this.formatPetFormation();
            this.petList.refreshVirtualList();
            return;
        }

        //添加或者替换第一个
        let counter = 0;
        let firstEmpty: PetChallengeAdjustFormationItem;
        let firstView: PetChallengeAdjustFormationItem;
        let usedColorNums: number[] = []
        for (let item of this.petFormationViews) {
            if (item.petData) {
                counter++;
                !firstView && (firstView = item);
                usedColorNums.push(item.corlorNum);

            } else {
                !firstEmpty && (firstEmpty = item);
            }
        }
        //不做替换, 弹提示
        if (counter >= 3) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("remotepet.adjust.replace"));
            return;

        } else {
            //增加 
            firstEmpty.petData = p;
            this.showFormationBtn(true);

            for (let i = 1; i <= 3; i++) {
                if (usedColorNums.indexOf(i) < 0) {
                    firstEmpty.corlorNum = i;
                    break
                }
            }

            this.petColorNumObj[p.petId] = firstEmpty.corlorNum;
        }
        this.formatPetFormation();
        this.petList.refreshVirtualList();
    }

    private onRenderPetList(index: number, item: PetChallengeAdjustPetItem) {
        item.info = this.playerPetDatas[index];
        item.colorNum = this.petColorNumObj[item.info.petId]
        let b = this.inChallengeTeam(item.info);
        item.updateInTeam(b);
    }

    private onPetChallengeDragStart(evt: Laya.Event) {
        let btn: PetChallengeAdjustFormationItem = <PetChallengeAdjustFormationItem>fgui.GObject.cast(evt.currentTarget);
        //取消对原目标的拖动, 换成一个替代品
        btn.stopDrag();
        fgui.DragDropManager.inst.startDrag(btn, btn._icon.icon, btn);
    }

    private onPetDrop(otherView: PetChallengeAdjustFormationItem, evt: Laya.Event) {
        if (!(otherView instanceof PetChallengeAdjustFormationItem)) return;

        let btn: PetChallengeAdjustFormationItem = <PetChallengeAdjustFormationItem>fgui.GObject.cast(evt.currentTarget);
        let temp: PetData = otherView.petData;
        if (!btn.petData || temp.petId != btn.petData.petId) {
            this.showFormationBtn(true);
        }
        otherView.petData = btn.petData;
        btn.petData = temp;

        let tempColor = otherView.corlorNum;
        otherView.corlorNum = btn.corlorNum;
        btn.corlorNum = tempColor;
        this.formatPetFormation();
    }

    // 拖动丢弃快捷技能
    private onFastSkillDrop(sourceView: any, evt: Laya.Event) {
        if (sourceView instanceof PetChallengeAdjustSkillItem) {
            sourceView.info = null
            this.updateSkillFlagShow()
        }
    }

    // 开始拖动技能库中技能
    private onPetSkillLibDragStart(evt: Laya.Event) {
        let item: PetSkillItem = <PetSkillItem>fgui.GObject.cast(evt.currentTarget);
        item.stopDrag();
        if (!item.info) return;
        if (!item.isLearned) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.unstudy'));
            return;
        }
        if (item.isPasssive) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('skill.unequip'))
            return;
        }
        fgui.DragDropManager.inst.startDrag(item, item.icon, item);
    }
    // 开始拖动快捷技能
    private onPetSkillDragStart(evt: Laya.Event) {
        let btn: PetChallengeAdjustSkillItem = <PetChallengeAdjustSkillItem>fgui.GObject.cast(evt.currentTarget);
        btn.stopDrag();
        if (!btn.info) return;
        fgui.DragDropManager.inst.startDrag(btn, btn._icon.icon, btn);
    }

    private onPetSkillDrop(otherView: any, evt: Laya.Event) {
        let btn = <PetChallengeAdjustSkillItem>fgui.GObject.cast(evt.currentTarget);
        if (otherView instanceof PetSkillItem) {
            this.emptyFastSkillItem(otherView.info)
            btn.info = otherView.info;
        } else if (otherView instanceof PetChallengeAdjustSkillItem) {
            let temp = otherView.info;
            otherView.info = btn.info;
            btn.info = temp;
        }
        this.updateSkillFlagShow();
        this.updateFastSkill();
    }

    private onPetClick(view: PetChallengeAdjustPetItem) {
        if (!view.info) return;
        this.selectedPet(view.info);
    }

    private onSkillLibListClickItem(item: PetSkillItem) {
        if (!item.info) return;
    }

    private onRenderListLibItem(index: number, item: PetSkillItem) {
        let itemData = this.skillDataTempArr[index]
        if (!itemData) {
            item.info = null;
            return
        }

        item.type = EmPetSkillItemType.SkillLib;
        item.extData = this.curPet;
        item.info = itemData;
        item.cShowSelect.setSelectedIndex(0);
        item.on(fgui.Events.DRAG_START, this, this.onPetSkillLibDragStart);
        item.draggable = true;
    }

    private selectedPet(petData: PetData) {
        if (!petData) {
            return;
        }
        this.curPet = petData;
        this.initSkillDataTemp();
        this.initFastKeyTemp();
        this.updateFastSkill();
        this.updateSkillLib();
        this.updateEquipedFlag();
    }

    private initSkillDataTemp() {
        if (this.curPet) {
            this.skillDataTempArr = ShopManager.Instance.model.petSkill[this.curPet.template.PetType]
            if (this.skillDataTempArr.length) {
                this.skillDataTempArr.sort((skillTempA, skillTempB) => {
                    let a1 = skillTempA.UseWay == 2 ? 0 : 100
                    let a2 = this.curPet.checkSkillIsLearned(skillTempA.TemplateId) ? 10 : 0
                    let sumA = a1 + a2

                    let b1 = skillTempB.UseWay == 2 ? 0 : 100
                    let b2 = this.curPet.checkSkillIsLearned(skillTempB.TemplateId) ? 10 : 0
                    let sumB = b1 + b2
                    return sumB - sumA
                })
            }
        }
    }

    // 缓存快捷键
    private initFastKeyTemp() {
        if (this.curPet) {
            PetData.FastSkillKeyTemp = this.curPet.petChallengeSkillsOfString;
        } else {
            PetData.FastSkillKeyTemp = "";
        }
    }

    private updateSkillLib() {
        if (this.skillDataTempArr) {
            this.skillLibList.numItems = this.skillDataTempArr.length;
        }
    }

    private updateFastSkill() {
        let petChallengeSkillList = this.curPet.petChallengeSkillList;
        for (let i = 0; i < this.petSkillViews.length; i++) {
            this.petSkillViews[i].info = petChallengeSkillList[i];
            FUIHelper.setTipData(this.petSkillViews[i],
                EmWindow.PetSkillTips,
                petChallengeSkillList[i], null, null, this.curPet
            )
        }
    }

    private emptyFastSkillItem(info: t_s_skilltemplateData) {
        for (let index = 0; index < this.petSkillViews.length; index++) {
            const item = this.petSkillViews[index] as PetChallengeAdjustSkillItem;
            if (item.info == info) {
                item.info = null;
                return true;
            }
        }
        return false;
    }

    private updateSkillFlagShow() {
        if (!this.curPet) return;
        this.formatPetSkill()
        this.updateEquipedFlag();
    }

    private updateEquipedFlag() {
        for (let index = 0; index < this.skillLibList.numChildren; index++) {
            const item: PetSkillItem = this.skillLibList.getChildAt(index) as PetSkillItem;
            if (item) {
                let idx = this.curPet.changeSkillTemplates.indexOf(item.info);
                item.equiped = idx == -1 ? false : PetData.inFastSkillKeyTemp(idx);
            }
        }
    }

    private updateLearnFlag() {
        if (!this.curPet) return;
        for (let index = 0; index < this.skillLibList.numChildren; index++) {
            const item: PetSkillItem = this.skillLibList.getChildAt(index) as PetSkillItem;
            if (item && item.info) {
                item.lack(!this.curPet.checkSkillIsLearned(item.info.TemplateId))
            }
        }
    }

    private formatPetSkill() {
        if (!this.curPet) return;
       
        PetData.FastSkillKeyTemp = "";
        for (let index = 0; index < this.petSkillViews.length; index++) {
            const item = this.petSkillViews[index] as PetChallengeAdjustSkillItem;

            if (item && item.info) {
                PetData.FastSkillKeyTemp += this.curPet.changeSkillTemplates.indexOf(item.info) + ",";
            } else {
                PetData.FastSkillKeyTemp += "-1,";
            }

            // if (item) {
            // 	item.showEquipingAni(!Boolean(item.info));
            // }
        }
        this.savePetSkill();
    }

    private savePetSkill() {
        if (this.curPet.petChallengeSkillsOfString != PetData.FastSkillKeyTemp) {
            this.curPet.petChallengeSkillsOfString = PetData.FastSkillKeyTemp;
            this.control.sendPetSkills(this.curPet.petId, PetData.FastSkillKeyTemp);
        }
    }

    private formatPetFormation() {
        let arr = this.defaultPos.concat();
        for (let item of this.petFormationViews) {
            if (item.petData) {
                arr[item.pos] = item.petData.petId;
            }
        }

        let res: number[] = [arr[2], arr[5], arr[8], arr[3], arr[6], arr[9]];
        this.control.data.formationString = res.join(",");
    }

    private savePetFormation() {
        let model = this.control.data
        if (this.playerInfo.petChallengeFormation != model.formationString) {
            this.playerInfo.beginChanges();
            this.playerInfo.petChallengeFormation = model.formationString;
            this.playerInfo.commit();
            this.control.sendPetFormation(model.formationString);
        }
    }

    private updateInTeam() {
        for (let index = 0; index < this.petList.numItems; index++) {
            const item = this.petList.getChildAt(index) as PetChallengeAdjustPetItem;
            if (item && item.info) {
                let b = this.inChallengeTeam(item.info);
                item.updateInTeam(b);
            }
        }
    }

    public inChallengeTeam(petData: PetData) {
        if (petData.petId <= 0) return false;

        return this.control.data.formationString.indexOf(petData.petId.toString()) != -1
    }

    private saveFormationBtnClick() {
        this.savePetFormation()
    }

    private showFormationBtn(v: boolean = true) {
        this.saveFormationBtn.visible = v;
    }

    private btnResetClick() {
        this.cShowSkillLib.setSelectedIndex(0);
    }

    private btnSetClick() {
        this.cShowSkillLib.setSelectedIndex(1);
    }

    public get control() {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.PetChallenge) as PetChallengeCtrl
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
}