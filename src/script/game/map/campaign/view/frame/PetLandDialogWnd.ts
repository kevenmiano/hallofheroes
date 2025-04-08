import BaseWindow from '../../../../../core/ui/Base/BaseWindow';
import { BaseItem } from '../../../../component/item/BaseItem';
import { CampaignManager } from '../../../../manager/CampaignManager';
import { CampaignNode } from '../../../space/data/CampaignNode';
import { CampaignArmy } from '../../data/CampaignArmy';
import AudioManager from '../../../../../core/audio/AudioManager';
import { SoundIds } from '../../../../constant/SoundIds';
import { MapSocketOuterManager } from '../../../../manager/MapSocketOuterManager';
import LangManager from '../../../../../core/lang/LangManager';
import { NotificationEvent } from '../../../../constant/event/NotificationEvent';
import { NotificationManager } from '../../../../manager/NotificationManager';
import RingTaskManager from '../../../../manager/RingTaskManager';
import { WorldBossHelper } from '../../../../utils/WorldBossHelper';
import { IconFactory } from '../../../../../core/utils/IconFactory';
import { RewardConditionType } from '../../../../constant/RewardConditionType';
import { TaskManage } from '../../../../manager/TaskManage';
import Tiles from '../../../space/constant/Tiles';
import CampaignDialogOptionItem from './CampaignDialogOptionItem';
import UIManager from "../../../../../core/ui/UIManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { FrameCtrlManager } from '../../../../mvc/FrameCtrlManager';
import DialogOptionItemTwo from '../../../../module/dialog/data/DialogOptionItemTwo';
import DialogItemInfo from '../../../../module/dialog/data/DialogItemInfo';

/**
* @author:pzlricky
* @data: 2021-11-04 19:22
* @description 英灵宠物对话框 
*/
export default class PetLandDialogWnd extends BaseWindow {

    public npcView: fgui.GLoader;
    public list: fgui.GList;
    public npcName: fgui.GTextField;
    public content: fgui.GTextField;
    public closebtn: fgui.GRichTextField;
    public ringTaskDropItem_50: BaseItem;
    public ringTaskDropItem_200: BaseItem;

    protected _itemList: CampaignDialogOptionItem[];
    protected _itemList1: DialogOptionItemTwo[];
    protected _nodeInfo: CampaignNode;
    public list1: fgui.GList;
    protected resizeContent: boolean = true;
    protected _mapId: number = 0;
    private _timer: number = 0;
    private _selfArmy: CampaignArmy;
    public click_rect: fgui.GComponent;
    private _list1Data: Array<DialogItemInfo> = [];
    public OnInitWind() {
        super.OnInitWind();
        this.initEvent();
        this.initData();
        this.initView();
    }

    private initEvent() {
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.__onClickHandler);
        this.list1.on(fairygui.Events.CLICK_ITEM, this, this.__onClickHandler);
        this.list1.itemRenderer = Laya.Handler.create(this, this.renderList1Item, null, false);
        this.click_rect.onClick(this, this.onClickBg);
    }

    private renderList1Item(index: number, item: DialogOptionItemTwo) {
        if (item && !item.isDisposed) {
            item.info = this._list1Data[index];
        }
    }

    private onClickBg() {
        this.OnBtnClose();
    }

    private initData() {
        this._nodeInfo = this.frameData.node;//地图节点
        this._mapId = this.frameData.mapId;//地图ID
    }

    private initView() {
        this.npcView.url = IconFactory.getNPCIcon(this._nodeInfo.nodeId);
        this._selfArmy = CampaignManager.Instance.mapModel.selfMemberData;
        this.refresh();
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        CampaignManager.Instance.mapModel.selectNode = null;//清空选中 防止下次移动触发
    }

    protected refresh() {
        if (this._nodeInfo) {
            this.npcName.text = LangManager.Instance.GetTranslation("public.colon", this._nodeInfo.info.names);
            this._itemList = [];
            this._itemList1 = [];
            if (this._nodeInfo.param3) {
                var contents: Array<string> = this._nodeInfo.param3.split("|");
                var options: Array<string> = contents[0].split(",");
                this.initOptions(options);
                this.content.text = contents[1];
            }
        } else {
            this.npcName.text = "";
            this.content.text = "";
        }
    }

    private removeBoxChildren() {
        this.list.numItems = 0;
    }

    OnHideWind() {
        if (this._timer) {
            clearInterval(this._timer);
        }
        this.list.off(fairygui.Events.CLICK_ITEM, this, this.__onClickHandler);
        this.click_rect.offClick(this, this.onClickBg);
        if (this._itemList) this._itemList.length = 0; this._itemList = null;
        this._nodeInfo = null;
        this._selfArmy = null;
        super.OnHideWind();
    }

    protected __onClickHandler(targetItem: any) {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        if (this._nodeInfo) {
            if (targetItem == this.leaveItem) {
                MapSocketOuterManager.sendFrameCallBack(this._mapId, this._nodeInfo.nodeId, false);
            } else if (targetItem instanceof DialogOptionItemTwo) {
                if (targetItem.textStr == LangManager.Instance.GetTranslation("map.space.view.frame.SpaceDialogFrame.RingTask")) {
                    this.changeDialogContext();
                    return;
                }
                else if (this._nodeInfo.param4 == "1" && TaskManage.Instance.cate.hasTaskAndNotCompleted(TaskManage.PET_SYSTEM_OPEN_TASK02)) {
                    FrameCtrlManager.Instance.open(EmWindow.PetFirstSelectWnd);
                } else if (targetItem.title == LangManager.Instance.GetTranslation("PetLandDialogWnd.targetItem.title")) {
                    RingTaskManager.Instance.updataState();
                    NotificationManager.Instance.dispatchEvent(NotificationEvent.TALKRINGTASK_COMPLETE);
                } else {
                    MapSocketOuterManager.sendFrameCallBack(this._mapId, this._nodeInfo.nodeId, true);
                    this.doSomething(this._nodeInfo);
                }
            }
            else if (targetItem instanceof CampaignDialogOptionItem) {
                if (targetItem.title == LangManager.Instance.GetTranslation("map.space.view.frame.SpaceDialogFrame.RingTask")) {
                    this.changeDialogContext();
                    return;
                }
                // 体验英灵觉醒改为选择英灵
                else if (this._nodeInfo.param4 == "1" && TaskManage.Instance.cate.hasTaskAndNotCompleted(TaskManage.PET_SYSTEM_OPEN_TASK02)) {
                    FrameCtrlManager.Instance.open(EmWindow.PetFirstSelectWnd);
                } else if (targetItem.title == LangManager.Instance.GetTranslation("PetLandDialogWnd.targetItem.title")) {
                    RingTaskManager.Instance.updataState();
                    NotificationManager.Instance.dispatchEvent(NotificationEvent.TALKRINGTASK_COMPLETE);
                } else {
                    MapSocketOuterManager.sendFrameCallBack(this._mapId, this._nodeInfo.nodeId, true);
                    this.doSomething(this._nodeInfo);
                }
            }
        }
        this.hide();
    }

    OnClose(e: Laya.Event) {
        //改为点击对话框内任意地方（除了按钮）关闭界面
        let ishit = this.list.displayObject.hitTestPoint(e.stageX, e.stageY);
        if (!ishit) {
            this.OnBtnClose();
        }
    }

    protected doSomething(node: CampaignNode) {
        if (!node) return;
        var tId: number = CampaignManager.Instance.mapId;
        if (WorldBossHelper.checkPetLand(tId)) {
            this.petLandLogic(node);
        }
    }

    //宠物岛
    private petLandLogic(node: CampaignNode) {
        if (node.param4 == "2") {
            UIManager.Instance.ShowWind(EmWindow.PetExchangeShopWnd);
        }
    }

    private closeDialog(param?: Object) {
        this.OnBtnClose();
    }

    protected initOptions(options: Array<string>) {
        this.removeBoxChildren();
        this._itemList = [];
        var tmapId: number = CampaignManager.Instance.mapId;
        if (WorldBossHelper.checkPetLand(tmapId)) {
            this.initOptionsPetLand(options);
        }

        if (RingTaskManager.Instance.getRingTaskType() == RewardConditionType.TALKTASK) {
            if (this._nodeInfo.nodeId == RingTaskManager.Instance.getTalkTaskNPCNode()) { //跑环对话任务 完成NPC
                var str: string = LangManager.Instance.GetTranslation("map.space.view.frame.SpaceDialogFrame.RingTask");
                var ringTaskItem: CampaignDialogOptionItem = new CampaignDialogOptionItem(this._mapId, this._nodeInfo.nodeId, str, this._itemList.length);
                this._itemList.push(ringTaskItem);
                this.addToBox(ringTaskItem);
            }
        }
    }


    protected leaveItem: CampaignDialogOptionItem;

    private initOptionsPetLand(options: Array<string>) {
        if (!this._nodeInfo) return;
        if (this._nodeInfo.param4 == "1") {//要有921任务才能显示
            var flag: boolean = TaskManage.Instance.cate.hasTaskAndNotCompleted(TaskManage.PET_SYSTEM_OPEN_TASK02);
            if (!flag) {
                return;
            }
        }
        var optionItem: any;
        this._list1Data = [];
        for (var i: number = 0; i < options.length; i++) {
            if (options[i] == LangManager.Instance.GetTranslation("petLandDialogWnd.optionTitle")) {
                optionItem = new CampaignDialogOptionItem(this._mapId, this._nodeInfo.nodeId, options[i], i);
                this._itemList.push(optionItem);
                this.addToBox(optionItem);
            }
            else {
                optionItem = new DialogOptionItemTwo();
                let dialogItemInfo: DialogItemInfo = new DialogItemInfo();
                dialogItemInfo.title = options[i];
                dialogItemInfo.param = i;
                this._list1Data.push(dialogItemInfo);
                this.list1.numItems = this._list1Data.length;
            }
        }
    }

    protected addToBox(optionItem: CampaignDialogOptionItem) {
        this.list.addChild(optionItem);
        this.list.resizeToFit();
        this.list.ensureBoundsCorrect();
    }

    private __timeTickHandler(evt) {
        // 检测距离 自动销毁
        var armyView = CampaignManager.Instance.controller.getArmyView(this._selfArmy);
        if (!this._selfArmy || !armyView || !this._nodeInfo || !this._nodeInfo.nodeView) {
            this.dispose();
            return;
        }

        var armyPos: Laya.Point = new Laya.Point(armyView.x, armyView.y);
        var nodePos: Laya.Point = new Laya.Point(this._nodeInfo.nodeView.x, this._nodeInfo.nodeView.y);
        var handlerRange: number = 4;
        if (this._nodeInfo.handlerRange > 0) {
            handlerRange = this._nodeInfo.handlerRange;
        }
        var distance: number = armyPos.distance(nodePos.x, nodePos.y);
        if (distance > handlerRange * Tiles.WIDTH) {
            this.dispose();
            return;
        }
    }

    private changeDialogContext() {
        this.content.text = LangManager.Instance.GetTranslation("map.space.view.frame.SpaceDialogFrame.talkTask02");
        var completeItem: CampaignDialogOptionItem = new CampaignDialogOptionItem(this._mapId, this._nodeInfo.nodeId, "完成", 0);
        this.list.removeChildren()
        this.list.addChild(completeItem);

    }


}