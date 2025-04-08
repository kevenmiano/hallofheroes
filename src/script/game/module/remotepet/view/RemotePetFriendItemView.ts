// @ts-nocheck
import FUI_RemotePetFriendItemView from "../../../../../fui/RemotePet/FUI_RemotePetFriendItemView";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { TempleteManager } from "../../../manager/TempleteManager";
import { RemotePetFriendInfo } from "../../../mvc/model/remotepet/RemotePetFriendInfo";


export class RemotePetFriendItemView extends FUI_RemotePetFriendItemView {
    protected onConstruct(): void {
        super.onConstruct();
    }

    private _data: RemotePetFriendInfo;

    private updateView() {
        this._nameTxt.text = this._data.friendName;
        this._fightTxt.text = this._data.petFight.toString();
        let iconurl = IconFactory.getPetHeadSmallIcon(this._data.petTempId);
        this._icon.url = iconurl;
        // _petInfoTxt.text = _data.petName+"("+petTypeLanguage+")";
        // var i:int=0;
        // if(_data.petQuality < 26)
        // {
        //     i = (_data.petQuality-1)/5+1;
        // }
        // else
        // {
        //     i = (_data.petQuality-1)/5;
        // }
        // if(i<1)i=1;
        // _petInfoTxt.setFrame(i);
    }

    public set info(v: RemotePetFriendInfo) {
        this._data = v;
        this.updateView();
    }

    public get info() {
        return this._data;
    }

}