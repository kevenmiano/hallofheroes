/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-26 10:49:19
 * @LastEditTime: 2024-01-11 15:05:41
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import FUI_TeamFormationItemDrag from "../../../../../../fui/BaseCommon/FUI_TeamFormationItemDrag";
import LangManager from "../../../../../core/lang/LangManager";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { DragObject, DragType } from "../../../../component/DragObject";
import { ArmyState } from "../../../../constant/ArmyState";
import { IconType } from "../../../../constant/IconType";
import { JobType } from "../../../../constant/JobType";
import { RoomEvent } from "../../../../constant/RoomDefine";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { CampaignManager } from "../../../../manager/CampaignManager";
import DragManager from "../../../../manager/DragManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { NotificationManager } from "../../../../manager/NotificationManager";

export default class TeamFormationItemDrag extends FUI_TeamFormationItemDrag implements DragObject {
    dragType: DragType = null;
    dragEnable: boolean = true;

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
        return this.hero;
    }

    setDragData(value: any) {
        this.hero = value;
    }

    public pos: number = -1
    public serverName: string = "";
    protected _hero: ThaneInfo;

    public bg: fgui.GLoader;
    public imgIcon: fgui.GLoader;
    public txtTitle: fgui.GLabel;

    onConstruct() {
        super.onConstruct()
        this.resetItem()
    }

    public get hero(): ThaneInfo {
        return this._hero;
    }

    public set hero(value: ThaneInfo) {
        this._hero = value;
        this.refresh();
    }

    public refresh() {
        if (this._hero) {
            this.imgLevelBg.visible = true
            this.img_nameBg.visible = true
            this.txtLevel.text = this._hero.grades + "";
            this.icon = IconFactory.getHeadIcon(this._hero.headId, IconType.HEAD_ICON);
            this.txt_name.text = this._hero.nickName;
            this.icon_job.url = JobType.getJobIcon(this._hero.job);
        } else {
            this.resetItem()
        }
    }

    public registerDrag() {
        DragManager.Instance.registerDragObject(this, this.onDragComplete.bind(this));
    }

    private onDragComplete(dstTarget, srcTarget) {
        if (dstTarget) {
            if (dstTarget instanceof TeamFormationItemDrag) {//目标对象存在
                //父容器为原始对象,则还原
                if (srcTarget != dstTarget) {//两者交换
                    let mapModel = CampaignManager.Instance.mapModel
                    let canSwap = true
                    if (mapModel) {
                        let srcArmy
                        let dstArmy
                        let srcThane = srcTarget.getDragData()
                        let dstThane = dstTarget.getDragData()
                        if (dstThane) {
                            dstArmy = mapModel.getBaseArmyByUserId(dstThane.userId, dstThane.serviceName)
                        }
                        if (srcThane) {
                            srcArmy = mapModel.getBaseArmyByUserId(srcThane.userId, srcThane.serviceName)
                        }
                        if (srcArmy && !dstArmy) {
                            if (srcArmy.state == ArmyState.STATE_FIGHT) {
                                canSwap = false
                                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("TeamFormationWnd.cannotAdjustedDuringFight"))
                            }
                        }
                        else if (srcArmy && dstArmy) {
                            if (srcArmy.state == ArmyState.STATE_FIGHT || dstArmy.state == ArmyState.STATE_FIGHT) {
                                canSwap = false
                                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("TeamFormationWnd.cannotAdjustedDuringFight"))
                            }
                        }
                    }
                    if (canSwap) {
                        this.swap(dstTarget, srcTarget);
                    }
                }
            }
        } else {//不处理交换
            let selfDragData = srcTarget.getDragData();
            this.setDragData(selfDragData);
        }
    }

    /**交换数据 */
    private swap(self, target) {
        let temp = target.getDragData();
        target.setDragData(self.getDragData());
        self.setDragData(temp);
        NotificationManager.Instance.sendNotification(RoomEvent.EDIT_TEAM_FIGHT_POS);
    }

    public resetItem() {
        this.icon = ""
        this.icon_job.icon = ""
        // this.txtTitle.text = ""
        this.txtLevel.text = ""
        this.txt_name.text = ""
        this.imgLevelBg.visible = false
        this.img_nameBg.visible = false
    }
}