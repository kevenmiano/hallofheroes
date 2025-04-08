import FUI_WarlordRoomPlayerItem from "../../../../../../fui/Warlords/FUI_WarlordRoomPlayerItem";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import { ShowAvatar } from "../../../../avatar/view/ShowAvatar";
import { AppellView } from "../../../../avatar/view/AppellView";
import { eFilterFrameText, FilterFrameText } from "../../../../component/FilterFrameText";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { BaseArmy } from "../../../../map/space/data/BaseArmy";

export default class WarlordRoomPlayerItem extends FUI_WarlordRoomPlayerItem {
    private _info: BaseArmy;
    private _heroFigure: ShowAvatar;
    private _heroFigureCon: fgui.GComponent;
    private _appellId: number = 0;
    private _honerView: AppellView;
    private _petNameTxt: FilterFrameText;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this._heroFigureCon = new fgui.GComponent()
        this.addChild(this._heroFigureCon)
        this._heroFigure = new ShowAvatar(false, this.onCompleteHandler.bind(this));
        this._heroFigureCon.displayObject.addChild(this._heroFigure);
        this._heroFigure.pos(-35, 160);
        this.setChildIndex(this._heroFigureCon, 1);
        this._petNameTxt = new FilterFrameText(100, 30, undefined, 18);
    }

    public set info(value: BaseArmy) {
        this.removeArmyEvent();
        this.clean();
        this._info = value;
        this.addArmyEvent();
        if (this._info) {
            this.txtGuildName.text = this._info.baseHero.consortiaName ? "<" + this._info.baseHero.consortiaName + ">" : "";
            this.txtPlayerName.text = this._info.baseHero.nickName;
            this._heroFigure.data = value.baseHero;
            this.setHonerName();
            this.setPetName();
        }
    }

    private setPetName() {
        var petName: string = this._info.baseHero.petName ? this._info.baseHero.petName : "";
        if (this._petNameTxt) {
            this._petNameTxt.text = "";
            if (!this._petNameTxt.parent) {
                // this.displayObject.addChild(this._petNameTxt);
            }
            this._petNameTxt.text = petName;
            if (this._info.baseHero.petQuaity > 0) {
                this._petNameTxt.color = FilterFrameText.Colors[eFilterFrameText.PetQuality][this._info.baseHero.petQuaity];
            }
            if (this._heroFigure.petAvatar) {
                this._petNameTxt.x = this._heroFigure.x + this._heroFigure.petAvatar.x - this._petNameTxt.width / 2;
                this._petNameTxt.y = this._heroFigure.y + this._heroFigure.petAvatar.y - 110;
            }
        }
    }

    private clean() {
        this.txtPlayerName.text = "";
        this._petNameTxt.text = "";
        this.txtGuildName.text = "";
        if (this._honerView && this._honerView.parent) this._honerView.parent.removeChild(this._honerView);
        this._heroFigure.data = null;
    }

    private addArmyEvent() {
        if (this._info) {
            this._info.baseHero.addEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__heroInfoChangeHandler, this);
            this._info.baseHero.addEventListener(PlayerEvent.APPELL_CHANGE, this.__heroInfoChangeHandler, this);
        }
    }
    private removeArmyEvent() {
        if (this._info) {
            this._info.baseHero.removeEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__heroInfoChangeHandler, this);
            this._info.baseHero.removeEventListener(PlayerEvent.APPELL_CHANGE, this.__heroInfoChangeHandler, this);
        }
    }

    private __heroInfoChangeHandler() {
        this._heroFigure.data = this._info.baseHero;
        this.setHonerName();
        this.setPetName();
    }

    private setHonerName() {
        if (this._appellId == this._info.baseHero.appellId && (this._honerView && this._honerView.parent)) {
            return;
        }
        this._appellId = this._info.baseHero.appellId;
        if (this._honerView && this._honerView.parent) this._honerView.parent.removeChild(this._honerView);
        ObjectUtils.disposeObject(this._honerView);
        this._honerView = null;
        if (this.isHoner) {
            this._honerView = new AppellView(this._info.baseHero.appellInfo.ImgWidth, this._info.baseHero.appellInfo.ImgHeight, this._info.baseHero.appellId);
            this._honerView.x = this.txtPlayerName.x;
            let imgHeight: number = this._info.baseHero.appellInfo.ImgHeight;
            this._honerView.y = this._info.baseHero.consortiaName ? this.txtGuildName.y - imgHeight / 2 : this.txtPlayerName.y - imgHeight / 2 - 20;
            this.showHoner();
        }
    }

    private showHoner() {
        if (this._heroFigureCon && this._heroFigureCon.displayObject) this._heroFigureCon.displayObject.addChild(this._honerView);
    }

    private onCompleteHandler() {
        this.setHonerName();
        this.setPetName();
    }

    private get isVip(): boolean {
        return this._info.baseHero.IsVipAndNoExpirt;
    }

    private get isHoner(): boolean {
        return this._info.baseHero.appellId != 0;
    }

    dispose() {
        ObjectUtils.disposeObject(this._heroFigure);
        this.removeArmyEvent();
        super.dispose();
    }
}