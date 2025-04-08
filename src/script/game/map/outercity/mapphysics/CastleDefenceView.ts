// @ts-nocheck
import { BaseCastle } from "../../../datas/template/BaseCastle";
import FUI_CastleDefenceView from "../../../../../fui/OuterCity/FUI_CastleDefenceView";
import { PlayerManager } from "../../../manager/PlayerManager";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import ColorConstant from "../../../constant/ColorConstant";
import StringHelper from "../../../../core/utils/StringHelper";
import { EmOuterCityWarCastlePeriodType } from "../../../constant/OuterCityWarDefine";

/**
 * @description    外城城堡显示防御时间
 * @author yuanzhan.yu
 * @date 2021/11/19 17:05
 * @ver 1.0
 */
export class CastleDefenceView extends FUI_CastleDefenceView {
    private _info: BaseCastle;

    onConstruct() {
        super.onConstruct();
    }

    public set info(value: BaseCastle) {
        this._info = value;
        this.setFlag(false);
        if (value) {
            if (!this._info.uncontestable) {
                // this._info.defencerGuildName = ""
                let hasGuild = !StringHelper.isNullOrEmpty(this._info.defencerGuildName)
                if (hasGuild) {
                    this.consortiaNameTxt.text = "<" + this._info.defencerGuildName + ">";
                    let pModel: PlayerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
                    if (pModel.consortiaID > 0 && pModel.consortiaName == this._info.defencerGuildName) {
                        this.consortiaNameTxt.color = ColorConstant.GREEN_COLOR;
                    }
                    else {
                        this.consortiaNameTxt.color = ColorConstant.RED_COLOR;
                    }
                } else {
                    this.consortiaNameTxt.text = "";
                }

                switch (this._info.state) {
                    case EmOuterCityWarCastlePeriodType.DeclaringWar:
                    case EmOuterCityWarCastlePeriodType.Fighting:
                        this.status.selectedIndex = 1;
                        break;
                    case EmOuterCityWarCastlePeriodType.Protected:
                        this.status.selectedIndex = 2;
                        break;
                    default:
                        this.status.selectedIndex = 0;
                        break;
                }
                let flag: boolean = this.status.selectedIndex != 0;
                this.setFlag(flag, hasGuild);
            }
            if (this._info.tempInfo) {
                this.cityNameTxt.text = this._info.tempInfo.NameLang;
            }
        } else {
            this.consortiaNameTxt.text = "";
        }
    }

    private setFlag(visible: boolean, hasGuild?: boolean) {
        if (!visible) {
            this.imgFlag2.visible = false;
            this.imgFlag.visible = false;
        } else {
            this.imgFlag2.visible = !hasGuild;
            this.imgFlag.visible = hasGuild;
        }
    }

    public dispose(): void {
        this._info = null;
        super.dispose();
    }
}