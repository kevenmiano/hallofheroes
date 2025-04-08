import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { IconFactory } from "../../../core/utils/IconFactory";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { RemotePetManager } from "../../manager/RemotePetManager";
import { RemotePetModel } from "../../mvc/model/remotepet/RemotePetModel";
import FUIHelper from "../../utils/FUIHelper";
import { PetData } from "../pet/data/PetData";
import { RemotePetAdjstPetItem } from "./Component/RemotePetAdjstPetItem";
import { RemotePetHeadItemView } from "./view/RemotePetHeadItemView";
import { RemotePetSkillItemView } from "./view/RemotePetSkillItemView";
import { SkillInfo } from "../../datas/SkillInfo";
import { TempleteManager } from "../../manager/TempleteManager";
import { RemoteSkillItemView } from "./view/RemoteSkillItemView";
import { RemotePetEvent } from "../../../core/event/RemotePetEvent";
import { MessageTipManager } from "../../manager/MessageTipManager";
import LangManager from "../../../core/lang/LangManager";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import UIButton from "../../../core/ui/UIButton";
import { EmPetSkillItemType, PetSkillItem } from "../common/pet/PetSkillItem";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { ShopManager } from "../../manager/ShopManager";
import { PetEvent } from "../../constant/event/NotificationEvent";
import Utils from "../../../core/utils/Utils";


export class RemotePetAdjustWnd extends BaseWindow {

    public frame: fgui.GLabel;
    public skillLab: fgui.GTextField;
    public petList: fgui.GList;
    public skillLibList: fgui.GList;
    public powerLab: fgui.GRichTextField;
    public petSkillLab: fgui.GTextField;
    public cShowSkillLib: fgui.Controller;
    public s1: RemotePetSkillItemView;
    public s2: RemotePetSkillItemView;
    public s3: RemotePetSkillItemView;
    public s4: RemotePetSkillItemView;
    public s5: RemotePetSkillItemView;
    public s6: RemotePetSkillItemView;
    // public saveBtn: UIButton;
    public remotePetSkillList: fgui.GList;
    public p4: RemotePetHeadItemView;
    public p5: RemotePetHeadItemView;
    public p6: RemotePetHeadItemView;
    public p1: RemotePetHeadItemView;
    public p2: RemotePetHeadItemView;
    public p3: RemotePetHeadItemView;

    private playerPetDatas: PetData[];
    private remotePetViews: RemotePetHeadItemView[];
    private petSkillViews: RemotePetSkillItemView[];
    private _remotePetSkills: SkillInfo[];

    private curPet: PetData;
    private skillDataTempArr: t_s_skilltemplateData[] = [];
    private petColorNumObj: { [key: number]: number };

    private defaultPos =
        [
            -1, -1, -1,
            -1, -1, -1,
            -1, -1, -1,
            -1, -1, -1,
        ];

    private posIndex = [2, 5, 8, 3, 6, 9];

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.addEvent();

        this.petColorNumObj = {};
        Utils.setDrawCallOptimize(this.skillLibList);
        this.skillLibList.displayObject["dyna"] = true;
        this.cShowSkillLib = this.getController("cShowSkillLib");
        this.remotePetViews = [this.p1, this.p2, this.p3, this.p4, this.p5, this.p6];
        this.petSkillViews = [this.s1, this.s2, this.s3, this.s4, this.s5, this.s6];
        for (let i = 0; i < this.petSkillViews.length; i++) {
            this.petSkillViews[i].on(fgui.Events.DRAG_START, this, this.onPetSkillDragStart);
            this.petSkillViews[i].on(fgui.Events.DROP, this, this.onPetSkillDrop);
            this.petSkillViews[i].draggable = true;
        }

        this.initRemotePet();
        this.initPlayerPet();
        this.initRemoteSkill();
    }

    private addEvent() {
        this.petList.setVirtual();
        this.petList.on(fgui.Events.CLICK_ITEM, this, this.onPetClick)
        this.petList.itemRenderer = Laya.Handler.create(this, this.onPetRenderer, null, false);
        this.skillLibList.itemRenderer = Laya.Handler.create(this, this.onRenderListLibItem, null, false);
        this.remotePetSkillList.itemRenderer = Laya.Handler.create(this, this.onRemotePetSkillRenderer, null, false);
        this.contentPane.on(fgui.Events.DROP, this, this.onFastSkillDrop);
        this.model.addEventListener(RemotePetEvent.PET_CHANGE, this.petChangeHandler, this);
        this.playerInfo.addEventListener(PetEvent.PET_UPDATE, this.__petInfoUpdate, this);
        // this.saveBtn.onClick(this, this.saveData);
    }

    private removeEvent() {
        this.playerInfo.removeEventListener(PetEvent.PET_UPDATE, this.__petInfoUpdate, this);
        this.model.removeEventListener(RemotePetEvent.PET_CHANGE, this.petChangeHandler, this);
    }


    private __petInfoUpdate(petData: PetData) {
        this.updateLearnFlag();
    }

    private initRemoteSkill() {
        if (this._remotePetSkills) return;
        this._remotePetSkills = [];
        let remotePetSkills = TempleteManager.Instance.getRemotePetSkill();
        let skillInfo: SkillInfo = null;
        for (let temp of remotePetSkills) {
            skillInfo = new SkillInfo();
            skillInfo.grade = 0;
            skillInfo.templateId = temp.TemplateId;
            this._remotePetSkills.push(skillInfo);
        }

        let keyList = this.model.remotePetSkill;
        for (let i = 0; i < keyList.length; i++) {
            let temp = this._remotePetSkills[i];
            temp.templateId = +keyList[i];
            temp.grade = temp.templateInfo.Grades;
        }
        this.remotePetSkillList.numItems = this._remotePetSkills.length;
    }

    private initPlayerPet() {
        this.playerPetDatas = ArrayUtils.sortOn(this.playerInfo.petList, ["fightPower"], [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING])
        this.petList.numItems = this.playerPetDatas.length;
        if (this.playerPetDatas[0]) {
            this.selectedPet(this.playerPetDatas[0]);
            this.petList.selectedIndex = 0;
        }
    }

    private petChangeHandler(p: PetData) {
        if (!p) return;
        let arr = this.model.petListInfo.remotePetFormationOfArray;
        let pos = arr.indexOf(p.petId + "");
        //休息
        if (pos >= 0) {
            for (let item of this.remotePetViews) {
                if (item.petData && item.petData.petId == p.petId) {
                    item.petData = null;
                    item.corlorNum = 0;
                    this.petColorNumObj[p.petId] = 0;
                    // this.showFormationBtn(true);
                    break;
                }
            }

            this.formatRemotePet();
            this.petList.refreshVirtualList();
            return;
        }

        //添加或者替换第一个
        let counter = 0;
        let firstEmpty: RemotePetHeadItemView;
        let firstView: RemotePetHeadItemView;
        let usedColorNums: number[] = []
        for (let item of this.remotePetViews) {
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
            // this.showFormationBtn(true);
            for (let i = 1; i <= 3; i++) {
                if (usedColorNums.indexOf(i) < 0) {
                    firstEmpty.corlorNum = i;
                    break
                }
            }

            this.petColorNumObj[p.petId] = firstEmpty.corlorNum;
        }
        this.formatRemotePet();
        this.petList.refreshVirtualList();
    }

    public OnShowWind(): void {
        // this.s1.draggable = true;
        // this.s2.draggable = true;
        // this.s1.on(fgui.Events.DRAG_START, this, this.onDragStart);
        // this.s2.on(fgui.Events.DROP, this, this.onDrop);
    }


    private initRemotePet() {
        let petListInfo = this.model.petListInfo
        let arr = petListInfo.remotePetFormationOfArray;
        let formation = arr;
        let petId: number = 0;
        let petView: RemotePetHeadItemView;
        let colorNum = 1;
        for (let i = 0; i < this.remotePetViews.length; i++) {
            petView = this.remotePetViews[i];
            petView.pos = this.posIndex[i];
            petId = +formation[petView.pos]
            petView.petData = petListInfo.getPet(petId);
            if (petView.petData) {
                petView.corlorNum = colorNum;
                this.petColorNumObj[petView.petData.petId] = colorNum;
                colorNum++;
            }
            petView.on(fgui.Events.DRAG_START, this, this.onPetDragStart);
            petView.on(fgui.Events.DROP, this, this.onPetDrop);
            petView.draggable = true;
        }
    }

    private onPetRenderer(index: number, item: RemotePetAdjstPetItem) {
        item.info = this.playerPetDatas[index];
        item.colorNum = this.petColorNumObj[item.info.petId]
    }

    private onRemotePetSkillRenderer(index: number, item: RemoteSkillItemView) {
        item.dataChange(this._remotePetSkills[index]);
    }

    private onPetDragStart(evt: Laya.Event) {
        let btn: RemotePetHeadItemView = <RemotePetHeadItemView>fgui.GObject.cast(evt.currentTarget);
        //取消对原目标的拖动, 换成一个替代品
        btn.stopDrag();
        fgui.DragDropManager.inst.startDrag(btn, btn._icon.icon, btn);
    }

    private onPetDrop(otherView: RemotePetHeadItemView, evt: Laya.Event) {
        if (otherView instanceof RemotePetHeadItemView) {
            let btn: RemotePetHeadItemView = <RemotePetHeadItemView>fgui.GObject.cast(evt.currentTarget);
            let temp: PetData = otherView.petData;
            // if (!btn.petData || temp.petId != btn.petData.petId) {  
            //     this.showFormationBtn(true);
            // }
            otherView.petData = btn.petData;
            btn.petData = temp;

            let tempColor = otherView.corlorNum;
            otherView.corlorNum = btn.corlorNum;
            btn.corlorNum = tempColor;
            this.formatRemotePet();
        }
    }

    // 拖动丢弃快捷技能
    private onFastSkillDrop(sourceView: any, evt: Laya.Event) {
        if (sourceView instanceof RemotePetSkillItemView) {
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

    private onPetSkillDragStart(evt: Laya.Event) {
        let btn: RemotePetSkillItemView = <RemotePetSkillItemView>fgui.GObject.cast(evt.currentTarget);
        //取消对原目标的拖动, 换成一个替代品
        btn.stopDrag();
        if (!btn.info) return;
        fgui.DragDropManager.inst.startDrag(btn, btn._icon.icon, btn);
    }

    private onPetSkillDrop(otherView: any, evt: Laya.Event) {
        let btn = <RemotePetSkillItemView>fgui.GObject.cast(evt.currentTarget);
        if (otherView instanceof PetSkillItem) {
            this.emptyFastSkillItem(otherView.info)
            btn.info = otherView.info;
            FUIHelper.setTipData(btn,
                EmWindow.PetSkillTips,
                otherView.info
            )
        } else if (otherView instanceof RemotePetSkillItemView) {
            let temp = otherView.info;
            otherView.info = btn.info;
            btn.info = temp;
        }

        this.updateSkillFlagShow();
        this.updateFastSkill();
    }

    private onPetClick(view: RemotePetAdjstPetItem) {
        if (!view.info) return;
        this.selectedPet(view.info);
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
            PetData.FastSkillKeyTemp = this.curPet.remotePetSkillsOfString;
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
        let remotePetSkillList = this.curPet.remotePetSkillList;
        for (let i = 0; i < this.petSkillViews.length; i++) {
            this.petSkillViews[i].info = remotePetSkillList[i];
            FUIHelper.setTipData(this.petSkillViews[i],
                EmWindow.PetSkillTips,
                remotePetSkillList[i], null, null, this.curPet
            )
        }
    }

    private emptyFastSkillItem(info: t_s_skilltemplateData) {
        for (let index = 0; index < this.petSkillViews.length; index++) {
            const item = this.petSkillViews[index] as RemotePetSkillItemView;
            if (item.info == info) {
                item.info = null;
                return true;
            }
        }
        return false;
    }

    private updateSkillFlagShow() {
        if (!this.curPet) return;
        this.formatPetSkill();
        this.updateEquipedFlag();
    }

    private updateEquipedFlag() {
        if (!this.curPet) return;
        for (let index = 0; index < this.skillLibList.numChildren; index++) {
            const item: PetSkillItem = this.skillLibList.getChildAt(index) as PetSkillItem;
            if (item) {
                let idx = this.curPet.changeSkillTemplates.indexOf(item.info);
                let arr: string[] = this.curPet.remotePetSkillsOfString.split(",");
                item.equiped = idx == -1 ? false : arr.indexOf(idx.toString()) > -1;
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

        let tempArr: string[] = []
        for (let item of this.petSkillViews) {
            if (item.info) {
                tempArr.push(this.curPet.changeSkillTemplates.indexOf(item.info) + "")
            } else {
                tempArr.push("-1");
            }
        }
        this.curPet.remotePetSkillsOfString = tempArr.join(",");


        // PetData.FastSkillKeyTemp = "";
        // for (let index = 0; index < this.petSkillViews.length; index++) {
        //     const item = this.petSkillViews[index] as RemotePetSkillItemView;

        //     if (item && item.info) {
        //         PetData.FastSkillKeyTemp += this.curPet.changeSkillTemplates.indexOf(item.info) + ",";
        //     } else {
        //         PetData.FastSkillKeyTemp += "-1,";
        //     }

        //     // if (item) {
        //     // 	item.showEquipingAni(!Boolean(item.info));
        //     // }
        // }

        this.saveData();
    }

    private savePetSkill() {
        if (this.curPet.remotePetSkillsOfString != PetData.FastSkillKeyTemp) {
            this.curPet.remotePetSkillsOfString = PetData.FastSkillKeyTemp;
            RemotePetManager.sendPetSkills(this.curPet.petId, PetData.FastSkillKeyTemp);
        }
    }

    private formatRemotePet() {
        let arr = this.defaultPos.concat();
        let i = 1;
        this.model.petListInfo.petList = [];
        for (let item of this.remotePetViews) {
            if (item.petData) {
                arr[item.pos] = item.petData.petId;
                this.model.petListInfo.petList[i++] = item.petData;
            }
        }

        this.model.petListInfo.formationString = arr.join(",");
    }

    private saveData() {
        RemotePetManager.Instance.saveRemotePetInfo();
    }

    // private showFormationBtn(v:boolean = true) {
    //     this.saveBtn.visible = v;
    // }

    public OnHideWind(): void {
        PetData.FastSkillKeyTemp = "";
        this.removeEvent();
        this.saveData();
        super.OnHideWind();
    }

    private btnResetClick() {
        this.cShowSkillLib.setSelectedIndex(0);
    }

    private btnSetClick() {
        this.cShowSkillLib.setSelectedIndex(1);
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public get model(): RemotePetModel {
        return RemotePetManager.Instance.model;
    }

    onDestroy(): void {

    }
}