// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import ColorConstant from "../../../constant/ColorConstant";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import FightingType from "../../../constant/FightingType";
import { EmWindow } from "../../../constant/UIDefine";
import { ArmyManager } from "../../../manager/ArmyManager";
import FightingManager from "../../../manager/FightingManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import FightingDescribleItem from "./FightingDescribleItem";

/**
 *实力提升详情
 */
export default class FightingDescribleWnd extends BaseWindow {

    public frame: fgui.GLabel;
    public list: fgui.GList;
    public scoreTxt: fgui.GTextField;
    public scoreValueTxt: fgui.GTextField;
    public scoreNameTxt: fgui.GTextField;
    public returnBtn: fgui.GButton;
    private _dataList: Array<Object> = [];
    private _type: number = 0;
    public OnInitWind() {
        super.OnInitWind();
        this.addEvent();
        this.setCenter();
        let frameData = this.frameData;
        if (frameData && frameData["tabIndex"]) {
            this._type = frameData["tabIndex"];
            if (this._type == FightingType.F_EQUIP) {//装备
                this.scoreTxt.text = LangManager.Instance.GetTranslation("FightingDescribleWnd.scoreTxt1");
                this.frame.getChild('title').text = LangManager.Instance.GetTranslation("FightingDescribleWnd.title1");
            } else {//宝石
                this.scoreTxt.text = LangManager.Instance.GetTranslation("FightingDescribleWnd.scoreTxt2");
                this.frame.getChild('title').text = LangManager.Instance.GetTranslation("FightingDescribleWnd.title2");
            }
        }
        this.scoreNameTxt.text = LangManager.Instance.GetTranslation("public.minute");
        this.refreshFightingView();
    }

    private onListItemRender(index: number, item: FightingDescribleItem) {
        if(index<this._dataList.length){
            item.info = this._dataList[index];
        }
        else
        {
            item.info = null;
        }
    }

    private addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.onListItemRender, null, false);
        NotificationManager.Instance.addEventListener(NotificationEvent.REFRESH_FIGHT, this.refreshFightingView, this);
        this.returnBtn.onClick(this,this.returnBackBtnClickHandler);
    }

    private removeEvent() {
        // this.list.itemRenderer && this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        NotificationManager.Instance.removeEventListener(NotificationEvent.REFRESH_FIGHT, this.refreshFightingView, this);
        this.returnBtn.offClick(this,this.returnBackBtnClickHandler);
    }

    /**返回 */
    private returnBackBtnClickHandler(){
        FrameCtrlManager.Instance.exit(EmWindow.FightingDescribleWnd);
    }

    private refreshFightingView() {
        let lv: number = ArmyManager.Instance.thane.grades;
        this._dataList = [];
        let showIndex: number;
        if (this._type == 1) //装备
        {
            if (lv >= 10 && lv < 19) {
                let data01: Object = new Object();
                data01["type"] = this._type;
                data01["index"] = 1;
                data01["integral"] = FightingManager.Instance.getEquipStrengScore();
                this._dataList.push(data01);
            }
            else if (lv >= 19 && lv < 20) {

                let data02: Object = new Object();
                data02["type"] = this._type;
                data02["index"] = 1;
                data02["integral"] = FightingManager.Instance.getEquipStrengScore();
                this._dataList.push(data02);

                let data03: Object = new Object();
                data03["type"] = this._type;
                data03["index"] = 2;
                data03["integral"] = FightingManager.Instance.getEquipRefreshScore();
                this._dataList.push(data03);
            }
            else if (lv >= 20) {
                let data11: Object = new Object();
                data11["type"] = this._type;
                data11["index"] = 1;
                data11["integral"] = FightingManager.Instance.getEquipStrengScore();
                this._dataList.push(data11);

                let data12: Object = new Object();
                data12["type"] = this._type;
                data12["index"] = 2;
                data12["integral"] = FightingManager.Instance.getEquipRefreshScore();
                this._dataList.push(data12);

                let data13: Object = new Object();
                data13["type"] = this._type;
                data13["index"] = 3;
                data13["integral"] = FightingManager.Instance.getEquipQualityScore();
                this._dataList.push(data13);
            }
            this.scoreValueTxt.text = FightingManager.Instance.getEquipScore() + "";
            showIndex = FightingManager.Instance.getIndexByScore(FightingManager.Instance.getEquipScore());
        }
        else if (this._type == 2) //宝石
        {
            this._dataList = [];
            let data04: Object = new Object();
            data04["type"] = this._type;
            data04["index"] = 1;
            data04["integral"] = 40;
            this._dataList.push(data04);
            if (lv >= 35) {
                let data05: Object = new Object();
                data05["type"] = this._type;
                data05["index"] = 2;
                data05["integral"] = FightingManager.Instance.getMarkingScore();
                this._dataList.push(data05);
            }
            this.scoreValueTxt.text = FightingManager.Instance.getGemAndMarkingScore() + "";
            showIndex = FightingManager.Instance.getIndexByScore(FightingManager.Instance.getGemAndMarkingScore());
        }
        this.scoreValueTxt.color = this.scoreNameTxt.color = this.getDescTxtColor(showIndex);
        this.list.numItems = 3;
    }

    private getDescTxtColor(value: number): string {
        switch (value) {
            case FightingManager.FIRST_GRADE:
                return ColorConstant.Q_RED_COLOR;
            case FightingManager.SECOND_GRADE:
                return ColorConstant.Q_GREEN_COLOR;
            case FightingManager.THIRD_GRADE:
            case FightingManager.FOUR_GRADE:
                return ColorConstant.Q_GOLD_COLOR;
        }
        return "";
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
       
    }

    dispose(dispose?: boolean) {
        this.removeEvent();
        super.dispose(dispose);
    }
}