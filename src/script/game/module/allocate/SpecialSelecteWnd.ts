// @ts-nocheck
import Resolution from '../../../core/comps/Resolution';
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import UIManager from '../../../core/ui/UIManager';
import { NotificationEvent } from '../../constant/event/NotificationEvent';
import { EmWindow } from '../../constant/UIDefine';
import { ArmyPawn } from '../../datas/ArmyPawn';
import { ArmyManager } from '../../manager/ArmyManager';
import { NotificationManager } from '../../manager/NotificationManager';
import SpecialSelectedItem from './SpecialSelecteItem';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { TempleteManager } from '../../manager/TempleteManager';

export default class SpecialSelecteWnd extends BaseWindow {
    private n1: fgui.GComponent;
    private contentlist: fgui.GList = null;
    private Btn_Confirm: UIButton;
    private locationPoint: Laya.Point;
    private param:any;
    private itemList: any[] = [];
    private selectedItem:ArmyPawn;
    private newPawn:ArmyPawn;
    public OnInitWind() {
        this.n1.getChild('closeBtn').visible = false;
        this.n1.getChild('title').text = LangManager.Instance.GetTranslation("SpecialSelecteWnd.title");
        this.param = this.params;
        if(this.param)
        {
            this.locationPoint = this.param.postion;
            this.newPawn = this.param.pawn;
        }
        if (this.locationPoint) {
            this.x = this.locationPoint.x;
            this.y = (Resolution.gameHeight - this.contentPane.sourceHeight) / 2;
        }
        this.addEvent();
    }

    OnShowWind() {
        super.OnShowWind();
        this.initList();
    }

    private addEvent() {
        this.Btn_Confirm.onClick(this, this.__BtnConfirmHandler.bind(this));
        NotificationManager.Instance.addEventListener(NotificationEvent.UPDATE_SPECIALSELECTITEM, this.__refreshViewHandler, this);
    }

    private removeEvent() {
        this.Btn_Confirm.offClick(this, this.__BtnConfirmHandler.bind(this));
        NotificationManager.Instance.removeEventListener(NotificationEvent.UPDATE_SPECIALSELECTITEM, this.__refreshViewHandler, this);
    }

    private __refreshViewHandler(data: ArmyPawn, selected: boolean) {
        if (selected)//把其他的设置成没有选中
        {
            for (let i: number = 0; i < this.itemList.length; i++) {
                let item: SpecialSelectedItem = this.itemList[i];
                if (item.vData != data) {
                    item.getSelectBtn().selected = false;
                }
            }
        }
    }

    private __BtnConfirmHandler() {
        let flag:boolean;
        for (let i: number = 0; i < this.itemList.length; i++) {
            let item: SpecialSelectedItem = this.itemList[i];
            if(item.getSelectBtn().selected == true)
            {
                flag = true;
                this.selectedItem = item.vData;
                break;
            }
        }
        if(!flag)
        {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("SpecialSelecteWnd.selected.property"));
            return;
        }
        NotificationManager.Instance.dispatchEvent(NotificationEvent.UPDATE_CONFIRM_SPECIALSELECTITEM,this.selectedItem);
        this.OnBtnClose();
    }

    private initList() {
        for (let i: number = 0; i < this.tempArr.length; i++) {
            let element:ArmyPawn = this.tempArr[i];
            if(!TempleteManager.Instance.getPawnSpecialTemplateByID(parseInt(this.tempArr[i].specialAbility)))continue;
            let specialSelectedItem: SpecialSelectedItem = <SpecialSelectedItem>this.contentlist.addItemFromPool();
            specialSelectedItem.vData = element;
            if(this.newPawn.templateId == element.templateId)
            {
                specialSelectedItem.selected = true;
            }
            else
            {
                specialSelectedItem.selected = false;
            }
            this.itemList.push(specialSelectedItem);
        }
        this.contentlist.ensureBoundsCorrect();
    }

    private get tempArr(): Array<ArmyPawn> {
        var arr: Array<ArmyPawn>;
        arr = ArmyManager.Instance.casernPawnList.getList();
        arr.sort(this.sortByNeedBuild);
        return arr;
    }

    private sortByNeedBuild(pawn1: any, pawn2: any): number {
        var needBuild1: number = parseInt(pawn1.templateInfo.NeedBuilding.toString());
        var needBuild2: number = parseInt(pawn2.templateInfo.NeedBuilding.toString());
        if (needBuild1 > needBuild2)
            return 1;
        else if (needBuild1 < needBuild2)
            return -1;
        else
            return 0;
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CLOSE_SPECIALSELECTWND);
    }

}