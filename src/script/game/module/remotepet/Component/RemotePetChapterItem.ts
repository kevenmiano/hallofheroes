import FUI_RemotePetChapterItem from "../../../../../fui/RemotePet/FUI_RemotePetChapterItem";
import LangManager from "../../../../core/lang/LangManager";

import { IconFactory } from "../../../../core/utils/IconFactory";
import { RemotePetTurnItemInfo } from "../../../mvc/model/remotepet/RemotePetTurnItemInfo";

export class RemotePetChapterItem extends FUI_RemotePetChapterItem {
    protected onConstruct(): void {
        super.onConstruct();
    }


    public set info(v: RemotePetTurnItemInfo) {
        this.levelLab.text = LangManager.Instance.GetTranslation("SinglePassCardItem.gradeTxt", v.tempInfo.IndexID);
        this.levelNameLab.text = v.tempInfo.NameLang;
        this._maskIcon.getChild("_icon").icon = IconFactory.getRemotePetIconPath(v.tempInfo.Icon2);
    }

    public set complate(v: boolean) {
        this.complateFlag.visible = v;
        this.lockImg.visible = !v;

    }

    public set fighting(v: boolean) {
        this.changleFlag.visible = v;
        if (v) {
            this.lockImg.visible = false;
        }

        let isgrayed = this.lockImg.visible;

        this.normal.grayed = isgrayed;
        this.select.grayed = isgrayed;
        this._maskIcon.grayed = isgrayed;
        this.levelLab.grayed = isgrayed;
        this.levelNameLab.grayed = isgrayed;
        this.circleB.grayed = isgrayed;
    }
}