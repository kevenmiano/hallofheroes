import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import { ShowPetAvatar } from "../../../avatar/view/ShowPetAvatar";
import { FilterFrameText, eFilterFrameText } from "../../../component/FilterFrameText";
import ColorConstant from "../../../constant/ColorConstant";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import FightingManager from "../../../manager/FightingManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { PetData } from "../../pet/data/PetData";
import FightingPetItem from "./FightingPetItem";

export default class FightingPetWnd extends BaseWindow {
    public frame: fgui.GLabel;
    public bg: fgui.GImage;
    public list: fgui.GList;
    public scoreTxt: fgui.GTextField;
    public scoreValueTxt: fgui.GTextField;
    public scoreNameTxt: fgui.GTextField;
    public returnBtn: fgui.GButton;
    public petNameTxt: fgui.GTextField;
    public imgFlag: fgui.GImage;
    public txtCapacity: fgui.GTextField;

    private _dataList: Array<Object> = [];
    private _type: number = 0;
    private _petView: ShowPetAvatar; //主英灵
    public OnInitWind() {
        super.OnInitWind();
        this.addEvent();
        this.setCenter();
        this.scoreTxt.text = LangManager.Instance.GetTranslation("FightingPetWnd.scoreTxt");
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation("FightingPetWnd.title");
        this.scoreNameTxt.text = LangManager.Instance.GetTranslation("public.minute");
        this.initData();
        this.refreshFightingView();
    }

    private initData() {
        var petData: PetData = FightingManager.Instance.getCurrPet();
        if (petData) {
            this.petNameTxt.text = petData.name;
            this.petNameTxt.color = FilterFrameText.Colors[eFilterFrameText.PetQuality][petData.quality-1];
            var score: number = FightingManager.Instance.getPetScore();
            this.scoreValueTxt.text = score + "";
            var showIndex: number = FightingManager.Instance.getIndexByScore(score);
            this.scoreValueTxt.color = this.scoreNameTxt.color = this.getDescTxtColor(showIndex);
            this.txtCapacity.text = petData.fightPower.toString();
            this._petView = new ShowPetAvatar();
            this._petView.width = 346;
            this._petView.height = 404;
            this._petView.x = 50;
            this._petView.y = 280;
            this.addChild(this._petView);
            this._petView.data = petData.template;
            
            this._dataList = [];
            var obj1:Object = new Object();
			obj1["index"] = 1 ;
			obj1["integral"] = FightingManager.Instance.getPetQualityScore();
			this._dataList.push(obj1);

			var obj2:Object = new Object();
			obj2["index"] = 2 ;
			obj2["integral"] = FightingManager.Instance.getQualificationScore();
			this._dataList.push(obj2);

			if(petData.grade >= 55)
			{
				var obj3:Object = new Object();
				obj3["index"] = 3 ;
				obj3["integral"] = FightingManager.Instance.getPetSkillScore();
				this._dataList.push(obj3);
			}
            this.list.numItems = 3;
        }
    }

    private onListItemRender(index: number, item: FightingPetItem) {
        if (index < this._dataList.length) {
            item.info = this._dataList[index];
        }
        else {
            item.info = null;
        }
    }

    private addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.onListItemRender, null, false);
        NotificationManager.Instance.addEventListener(NotificationEvent.REFRESH_FIGHT, this.refreshFightingView, this);
        this.returnBtn.onClick(this, this.returnBackBtnClickHandler);
    }

    private removeEvent() {
        // this.list.itemRenderer && this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        NotificationManager.Instance.removeEventListener(NotificationEvent.REFRESH_FIGHT, this.refreshFightingView, this);
        this.returnBtn.offClick(this, this.returnBackBtnClickHandler);
    }

    /**返回 */
    private returnBackBtnClickHandler() {
        FrameCtrlManager.Instance.exit(EmWindow.FightingPetWnd);
        // FrameCtrlManager.Instance.open(EmWindow.FightingWnd);
    }

    private refreshFightingView() {

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
        FightingManager.Instance.openPetWndFlag = false;
        super.dispose(dispose);
    }

}