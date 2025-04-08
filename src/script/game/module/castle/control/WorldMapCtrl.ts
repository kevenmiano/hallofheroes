import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { PlayerEffectInfo } from "../../../datas/playerinfo/PlayerEffectInfo";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import BuildingManager from "../../../map/castle/BuildingManager";
import { BuildInfo } from "../../../map/castle/data/BuildInfo";
import { MapInitData } from "../../../map/data/MapInitData";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { WorldMapHelper } from "../../../utils/WorldMapHelper";
import { t_s_mapData } from "../../../config/t_s_map";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { TempleteManager } from "../../../manager/TempleteManager";

export class WorldMapCtrl extends FrameCtrlBase {
    private _toMapId: number;

    protected show() {
        super.show();
    }

    protected hide() {
        super.hide();
    }

    protected addEventListener() {
        super.addEventListener();
    }

    protected delEventListener() {
        super.delEventListener();
    }

    public sendMap(mapId: number): boolean {//传送
        this._toMapId = mapId;
        if (!this.checkScene()) {
            return false;
        }
        if (!WorldMapHelper.chcekMapId(this._toMapId)) {
            return false;
        }
        let multi: number = 1;
        let Cfg = TempleteManager.Instance.getConfigInfoByConfigName("AddEnergy_Price");
        if (Cfg) {
            multi = Number(Cfg.ConfigValue);
        }

        let build: BuildInfo = BuildingManager.Instance.model.buildingListByID[-11];
        let max: number = this.playerEffect.getTransferPowerLimitAddition(build.templeteInfo.Property2);
        let current: number = build.property1;
        let recharge2: number = multi * Math.ceil((max - current) / 5);

        if (200 <= current) {
            PlayerManager.Instance.sendMoveCastle(this._toMapId, 0, 0, 1);
            return true;
        }
        let str: string = LangManager.Instance.GetTranslation("map.outercity.mediator.mapview.TransmitHandler.command02", recharge2);
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("map.internals.view.displaye.PhysicsMenu.PORTAL");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { point: recharge2, checkDefault: true }, prompt, str, confirm, cancel, this.transferBack.bind(this));
        return true;
    }

    public transferBack(result: boolean, flag: boolean, id: number = 0, type: number = 2): void {
        if (result) {
            if (!flag) {
                type = 1;
            }
            PlayerManager.Instance.sendMoveCastle(this._toMapId, 0, 0, type);
        }
    }

    public lookMap(mapId: number): boolean {//查看
        if (!this.checkScene()) {
            return false;
        }
        if (!WorldMapHelper.chcekMapId(mapId)) {
            return false;
        }
        let map: t_s_mapData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_map, mapId);
        if (map) {
            let init: MapInitData = new MapInitData();
            init.mapTempInfo = map;
            init.targetPoint = new Laya.Point(5000, 5000);
            SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE, init, true);
        }
        return true;
    }

    private checkScene(): boolean {
        if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            let str: string = LangManager.Instance.GetTranslation("worldmap.command01");
            MessageTipManager.Instance.show(str);
            return false;
        }
        return true;
    }

    private get playerEffect(): PlayerEffectInfo {
        return PlayerManager.Instance.currentPlayerModel.playerEffect;
    }
}