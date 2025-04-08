import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import LangManager from "../../core/lang/LangManager";
import { CampaignManager } from "../manager/CampaignManager";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import { PosType } from "../map/space/constant/PosType";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
import { CampaignMapView } from "../map/campaign/view/CampaignMapView";

export class WorldBossHelper {
    constructor() {
    }

    public static checkIsNoTeamChatMap(mapId: number): boolean {
        if (WorldBossHelper.checkWorldBoss(mapId)) {
            return true;
        }
        if (WorldBossHelper.checkCrystal(mapId)) {
            return true;
        }
        if (WorldBossHelper.checkHoodRoom(mapId)) {
            return true;
        }
        if (WorldBossHelper.checkPetLand(mapId)) {
            return true;
        }
        if (WorldBossHelper.checkMineral(mapId)) {
            return true;
        }
        if ((mapId >= 5000 && mapId <= 5100) || (mapId > 6000 && mapId < 7000) || (mapId > 7000 && mapId < 8000)) {
            return true;
        }
        return false;
    }

    public static checkFogMap(mapId: number): boolean {
        if ((mapId == 10001 || mapId == 10002) ||
            (mapId >= 4000 && mapId <= 5000) ||
            (mapId >= 5000 && mapId <= 5100) ||
            (mapId > 6000 && mapId < 7000) ||
            (mapId > 7000 && mapId < 8000) ||
            (mapId >= 8000 && mapId < 9000) ||
            (mapId > 20000 && mapId <= 25000) ||
            mapId == 30000) {
            return true;
        }
        return false;
    }


    public static checkShowRoomTeam(): boolean {
        let currentScene: String = SceneManager.Instance.currentType;
        let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
        if ((currentScene == SceneType.CAMPAIGN_MAP_SCENE
            && mapModel && mapModel.campaignTemplate
            && mapModel.campaignTemplate.Capacity > 1
            && mapModel.campaignTemplate.Types == 0) ||
            currentScene == SceneType.PVE_ROOM_SCENE ||
            currentScene == SceneType.PVP_ROOM_SCENE) {
            return true;
        }
        else {
            return false;
        }
    }

    public static fogNoExits(mapId: number): boolean {
        if ((mapId > 6000 && mapId < 7000) || (mapId > 7000 && mapId < 8000)) {
            return true;
        }
        return false;
    }

    /**
     *检查是否为世界BOSS地图 和矿场
     *
     */
    public static checkMapId(mapId: number): boolean {
        if ((mapId >= 5000 && mapId <= 5100) || (mapId > 6000 && mapId < 7000)) {
            return true;
        }
        return false;
    }

    /**
     *世界Boss
     *
     */
    public static checkWorldBoss(mapId: number): boolean {
        if (mapId >= 5000 && mapId <= 5100) {
            return true;
        }
        return false;
    }

    /**
     *修行神殿
     *
     */
    public static checkHoodRoom(mapId: number): boolean {
        if (mapId >= 7000 && mapId <= 7100) {
            return true;
        }
        return false;
    }

    /**
     * 矿场
     *
     */
    public static checkCrystal(mapId: number): boolean {
        if (mapId >= 6000 && mapId <= 7000) {
            return true;
        }
        return false;
    }

    /**
     *地下迷宫
     *
     */
    public static checkMaze(mapId: number): boolean {
        if (mapId >= 8000 && mapId <= 8100) {
            return true;
        }
        return false;
    }

    /**
     * 深渊迷宫
     *
     */
    public static checkMaze2(mapId: number): boolean {
        if (mapId >= 8101 && mapId <= 8130) {
            return true;
        }
        return false;
    }

    /**
     *战场
     *
     */
    public static checkPvp(mapId: number): boolean {
        if (mapId >= 4000 && mapId < 4500) {
            return true;
        }
        return false;
    }

    /**
     * 公会战
     */
    public static checkGvg(mapId: number): boolean {
        if (mapId >= 4500 && mapId < 4999) {
            return true;
        }
        return false;
    }

    /**
     *
     * 公会秘境
     *
     */
    public static checkConsortiaSecretLand(mapId: number): boolean {
        if (mapId == 7501) {
            return true;
        }
        return false;
    }

    /**
     *公会祭坛
     *
     */
    public static checkConsortiaDemon(mapId: number): boolean {
        if (mapId == 7601) {
            return true;
        }
        return false;
    }

    /**
     *试炼之塔
     *
     */
    public static checkTrailTower(mapId: number): boolean {
        if (mapId == 8201) {
            return true;
        }
        return false;
    }

    public static consortiaCampaign(mapId: number): boolean {
        if (this.checkConsortiaSecretLand(mapId)) {
            return true;
        }
        else if (this.checkConsortiaDemon(mapId)) {
            return true;
        }
        else if (this.checkGvg(mapId)) {
            return true;
        }
        return false;
    }

    /**新手副本*/
    public static checkIsNoviceMap(mapId: number): boolean {
        if (mapId == 10001 || mapId == 10002) {
            return true;
        }
        return false;
    }

    public static checkIsNoviceMapLayer1(mapId: number): boolean {
        if (mapId == 10001) {
            return true;
        }
        return false;
    }
    public static checkIsNoviceMapLayer2(mapId: number): boolean {
        if (mapId == 10002) {
            return true;
        }
        return false;
    }
    
    public static checkVehicleMap(mapId: number): boolean {
        return mapId == 3001;
    }
    /**
     * 云端历险（大富翁）
     */		
    public static checkMonopoly(mapId : number) : boolean
    {
        return mapId == 5201;
    }

    /**
     * 英灵岛
     * @param mapId
     * @return
     *
     */
    public static checkPetLand(mapId: number): boolean {
        return (mapId > 20000 && mapId <= 25000);
    }

    /**
     * 紫晶矿场
     * @param mapId
     * @return
     *
     */
    public static checkMineral(mapId: number): boolean {
        return (mapId == 30000);
    }

    /**
         * 公会boss副本
         */
    public static checkConsortiaBoss(mapId: number): boolean {
        return mapId == 5301;
    }


    public static single(mapId:number):boolean{
        return (mapId >= 1001 && mapId<=1602);
    }

    /**
     * 秘境类副本 
     */
    public static checkSecretFb(mapId: number) {
        return this.checkSecret(mapId) || this.checkMultiSecret(mapId) || this.checkPetSecret(mapId) 
    }

    /**
     * 单人秘境  
     */
    public static checkSecret(mapId: number): boolean {
        if (mapId >= 100 && mapId < 200) {
            return true;
        }
        return false;
    }
    /**
     * 多人秘境  
     */
    public static checkMultiSecret(mapId: number): boolean {
        if (mapId >= 200 && mapId < 300) {
            return true;
        }
        return false;
    }
    /**
     * 英灵秘境  
     */
    public static checkPetSecret(mapId: number): boolean {
        if (mapId >= 300 && mapId < 400) {
            return true;
        }
        return false;
    }

    /**
     * 副本地图：切片地图
     * @param mapId 
     * @returns 
     */
    public static checkSliceBgMap(mapId: number): boolean {
        return CampaignMapModel.sliceBgMapId.indexOf(mapId) != -1;
    }
    
    /**
     * 副本地图：单张背景地图
     * 秘境副本 || 
     * @param mapId 
     * @returns 
     */
    public static checkSingleBgMap(mapId: number): boolean {
        return this.checkSecretFb(mapId)
    }

    public static isOutecityNPCNode(type:number):boolean{
        if(type == PosType.OUTERCITY_BOSS_NPC
            ||type == PosType.OUTERCITY_COMMON_JINGYING
            || type == PosType.OUTERCITY_COMMON_NPC){
                return true;
            }
            return false;
    }
    /**
     * 英灵岛boss战
     */		
    public static checkInPetBossFloor(mapId:number):Boolean {
        return mapId == CampaignManager.Instance.petBossModel.mapId && CampaignManager.Instance.petBossModel.isOpen;
    }

    public static checkInOuterCityWarMap():Boolean {
        return FrameCtrlManager.Instance.isOpen(EmWindow.OuterCityWarWnd);
    }

    public static checkInConsortiaScretTree(mapId:number):Boolean {
        return mapId == 7501;
    }

    public static getCampaignTips(): string {
        let tip: string = "";

        let currentType = SceneManager.Instance.currentType
        if (currentType != SceneType.CAMPAIGN_MAP_SCENE) {
            return tip;
        }
        let mapId: number = CampaignManager.Instance.mapModel.mapId;
        if (WorldBossHelper.checkCrystal(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip01");
        }
        else if (WorldBossHelper.checkHoodRoom(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip02");
        }
        else if (WorldBossHelper.checkMaze(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip03");
        }
        else if (WorldBossHelper.checkWorldBoss(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip04");
        }
        else if (WorldBossHelper.checkPvp(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip05");
        }
        else if (WorldBossHelper.checkGvg(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip07");
        }
        else if (WorldBossHelper.checkConsortiaSecretLand(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip08");
        }
        else if (WorldBossHelper.checkConsortiaDemon(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip09");
        }
        else if (WorldBossHelper.checkMineral(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip10");
        }
        else if (WorldBossHelper.checkSecret(mapId)) {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip11");
        }
        else {
            tip = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip06");
        }

        return tip;
    }
}