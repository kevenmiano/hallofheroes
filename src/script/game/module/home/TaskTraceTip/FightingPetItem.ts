import FUI_FightingPetItem from "../../../../../fui/Home/FUI_FightingPetItem";
import LangManager from '../../../../core/lang/LangManager';
import ColorConstant from "../../../constant/ColorConstant";
import { EmWindow } from "../../../constant/UIDefine";
import FightingManager from "../../../manager/FightingManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";

export default class FightingPetItem extends FUI_FightingPetItem {
    private _info: Object;
    private _index: number;//得分在某个区间
    protected onConstruct() {
        super.onConstruct();
        this.typeNameTxt.text = LangManager.Instance.GetTranslation("public.minute");
        this.addEvent();
    }

    private addEvent() {
        this.gotoBtn.onClick(this, this.gotoBtnHandler);
    }

    private removeEvent() {
        this.gotoBtn.offClick(this, this.gotoBtnHandler);
    }

    private gotoBtnHandler() {
        FrameCtrlManager.Instance.exit(EmWindow.FightingPetWnd);
        switch (this._info["index"]) {
            case 1: //英灵品质
                FightingManager.Instance.toPetadvanceBtn();
                break;
            case 2: //英灵资质
                FightingManager.Instance.toPetstrength();
                break
            case 3: //英灵技能
                FightingManager.Instance.topetSkill();
                break;
        }
    }

    get info(): Object {
        return this._info;
    }

    set info(value: Object) {
        if (!value) {
            this.typeNameTxt.text = "";
            this.descTxt.text = "";
            this.gotoBtn.visible = false;
            return;
        }
        this.gotoBtn.visible = true;
        this._info = value;
        if (value["index"] == 3) //英灵技能
        {
            this.gotoBtn.title = LangManager.Instance.GetTranslation("FightingPetItem.gotoBtn.titleTxt")
        }
        else {
            this.gotoBtn.title = LangManager.Instance.GetTranslation("fashion.FashionSwitchItem.operationBtnTxt2");
        }
        this.setText();
    }

    private setText() {
        var getIndex: number = FightingManager.Instance.getIndexByScore(this._info["integral"]);
        this.typeNameTxt.text = LangManager.Instance.GetTranslation("FightingPetItem.typeNameTxt"+this._info["index"]);
        switch (this._info["index"]) {
            case 1: //品质
                this.descTxt.text = LangManager.Instance.GetTranslation("fighting.FightingItem.desction10_" + this._info["integral"]);
                break;
            case 2: //资质
                this.descTxt.text = LangManager.Instance.GetTranslation("fighting.FightingItem.desction11_" + getIndex);
                break;
            case 3: //技能
                if (getIndex == 4) {
                    this.descTxt.text = LangManager.Instance.GetTranslation("fighting.FightingItem.desction12_3")
                }
                else if (getIndex == 3) {
                    this.descTxt.text = LangManager.Instance.GetTranslation("fighting.FightingItem.desction12_2");

                } else {
                    this.descTxt.text = LangManager.Instance.GetTranslation("fighting.FightingItem.desction12_1");
                }
                break;
        }
        this.descTxt.color = this.getDescTxtColor(getIndex);
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

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}