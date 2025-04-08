// @ts-nocheck
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import { t_s_herotemplateData } from "../../config/t_s_herotemplate";
import { t_s_mapphysicpositionData } from "../../config/t_s_mapphysicposition";
import ColorConstant from "../../constant/ColorConstant";
import { ConfigType } from "../../constant/ConfigDefine";
import { GlobalConfig } from "../../constant/GlobalConfig";
import { EmOuterCityWarCastlePeriodType } from "../../constant/OuterCityWarDefine";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import NodeMapPhysics from "../../map/space/data/NodeMapPhysics";

/**
 * 外城城堡对应的数据
 */
export class BaseCastle extends NodeMapPhysics {
    public get nodeId(): number {
        return this.info && this.info.id
    }
    private _tempInfo: t_s_mapphysicpositionData;
    private _templateId: number;
    /** 防御剩余时间 */
    private _defenceLeftTime: number = 0;
    public set defenceLeftTime(value: number) {
        if (this._defenceLeftTime != value) {
            this._defenceLeftTime = value;
            this.dispatchEvent(PlayerEvent.CASTLE_DEFENCE_TIME, null);
        }
    }
    public get defenceLeftTime(): number {
        return this._defenceLeftTime;
    }

    public get tempInfo(): t_s_mapphysicpositionData {
        return this._tempInfo;
    }

    public set templateId(value: number) {
        this._templateId = value;
        this._tempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mapphysicposition, this._templateId.toString()) as t_s_mapphysicpositionData;
    }

    public get templateId(): number {
        return this._templateId;
    }



    ////////////////////////////// 城战更新 U_C_OUTCITYWAR_NODE_STATE ////////////////////////////////
    public state: EmOuterCityWarCastlePeriodType = EmOuterCityWarCastlePeriodType.None;
    public defencerGuildCnt: number = 0;
    public defencerGuildName: string = "";

    /** 城战 不参与争夺的城堡 */
    public get uncontestable(): boolean {
        return this._tempInfo && this._tempInfo.PhysicId == GlobalConfig.OuterCity.UncontestablePhysicId;
    }

    /** 城战 可争夺城堡的初始NPC */
    public get defenceNpcTemp(): t_s_herotemplateData {
        if (!this._tempInfo) return;

        let heroId: number = parseInt(this._tempInfo.Heroes);
        let heroTemplateData: t_s_herotemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_herotemplate, heroId);
        return heroTemplateData
    }

    /** 城战 宣战消耗的公会财富 */
    public get declareWarCost(): number {
        if (!this._tempInfo) return;

        return this._tempInfo.Property1
    }

    public static getCastleStateName(state: number) {
        let str
        switch (state) {
            case EmOuterCityWarCastlePeriodType.Peace: str = "OuterCity.castleStatus1"; break;
            case EmOuterCityWarCastlePeriodType.DeclareWar: str = "OuterCity.castleStatus2"; break;
            case EmOuterCityWarCastlePeriodType.DeclaringWar: str = "OuterCity.castleStatus3"; break;
            case EmOuterCityWarCastlePeriodType.Fighting: str = "OuterCity.castleStatus4"; break;
            case EmOuterCityWarCastlePeriodType.Protected: str = "OuterCity.castleStatus5"; break;
        }
        return LangManager.Instance.GetTranslation(str)
    }

    public static getCastleStateColor(state: number) {
        let str
        switch (state) {
            case EmOuterCityWarCastlePeriodType.Peace: str = ColorConstant.GREEN_COLOR; break;
            case EmOuterCityWarCastlePeriodType.DeclareWar: str = ColorConstant.BLUE_COLOR; break;
            case EmOuterCityWarCastlePeriodType.DeclaringWar: str = ColorConstant.BLUE_COLOR; break;
            case EmOuterCityWarCastlePeriodType.Fighting: str = ColorConstant.RED_COLOR; break;
            case EmOuterCityWarCastlePeriodType.Protected: str = ColorConstant.LIGHT_TEXT_COLOR; break;
        }
        return str
    }
    //////////////////////////////////////////////////////////////////////

}