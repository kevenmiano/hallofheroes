
import FUI_RemotePetHeadSelectView from "../../../../../fui/RemotePet/FUI_RemotePetHeadSelectView";
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import { PetData } from "../../pet/data/PetData";
import { RemotePetHeadSelectItemView } from "./RemotePetHeadSelectItemView";

export class RemotePetHeadSelectView extends FUI_RemotePetHeadSelectView {


    protected onConstruct() {
        super.onConstruct();
        this.petList.setVirtual();
        this.petList.itemRenderer = Laya.Handler.create(this, this.onItemRender, null, false);
        this.petList.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
    }

    private petDatas: PetData[];
    private _callBack: Function;

    private onItemRender(index: number, box: RemotePetHeadSelectItemView) {
        box.petData = this.petDatas[index];
    }


    public show(list: PetData[], value: PetData, callBack: Function) {
        let petlist = this.model.petListInfo.petList;
        let petDatas: PetData[] = [];
        let flag = false;
        for (let i = 0; i < list.length; i++) {
            flag = false
            for (let p of petlist) {
                if (p && p.petId == list[i].petId) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                petDatas.push(list[i])
            }
        }

        this.petDatas = petDatas;
        this._callBack = callBack;
        this.petList.numItems = this.petDatas.length;
        this.visible = true;
    }

    public hide() {
        this.visible = false;
        if (this._callBack) {
            this._callBack(null);
        }
        this._callBack = null;
        this.petDatas = null;
    }

    private onClickItem(item: RemotePetHeadSelectItemView) {
        if (!this._callBack) return;
        if (!item.petData) return;
        if (item.petData.remoteDie) {      
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("remotepet.views.pet.die"));
            return;
        }
        this._callBack(item.petData);
        this.hide();
    }

    private get model(): RemotePetModel {
        return RemotePetManager.Instance.model;
    }
}