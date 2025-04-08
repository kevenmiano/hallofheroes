import ConfigMgr from "../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { t_s_uiplaybaseData } from "../../config/t_s_uiplaybase";
import { t_s_uiplaylevelData } from "../../config/t_s_uiplaylevel";
import { ConfigType } from "../../constant/ConfigDefine";
import { ArmyManager } from "../../manager/ArmyManager";
import { PetCampaignEvent } from "./enum/PetCampaignEnum";
import UserUiPlayInfoMsg = com.road.yishi.proto.uiplay.UserUiPlayInfoMsg;
import UserUiPlayListMsg = com.road.yishi.proto.uiplay.UserUiPlayListMsg;
import Logger from "../../../core/logger/Logger";

export default class PetCampaignModel extends GameEventDispatcher{
    baseDic: Map<number, t_s_uiplaybaseData>;
    levelDic: Map<number, t_s_uiplaylevelData>;
    tabListData: string[];

    //玩家所有玩法的通关信息
    userUiPlayListMsg: UserUiPlayListMsg;
    //玩家当前玩法的通关信息
    userUiPlayInfoMsg: UserUiPlayInfoMsg;
    // 当前选择关卡index
    treeSelectIndex: number;
    curPlayID: number;
    playIdIndex: number;
    playIdArrs: number[];
    curLevelData: t_s_uiplaylevelData;
    public static ENTER_BATTLE:number = 0;
    public static GET_REWARD:number = 1;
    public levelSort:number = 0;
    public leftRewardCount:number = 0;
    constructor() {
        super();
    }

    parseConfig() {
        this.baseDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_uiplaybase);
        this.levelDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_uiplaylevel);
        // 左边页签
        this.tabListData = [];
        this.playIdArrs = [];
        for (const key in this.baseDic) {
            if (Object.prototype.hasOwnProperty.call(this.baseDic, key)) {
                let data: t_s_uiplaybaseData = this.baseDic[key];
                this.tabListData.push(data.UiPlayNameLang);
                if (!this.playIdArrs.includes(data.UiPlayId)) {
                    this.playIdArrs.push(data.UiPlayId);
                }
            }
        }
        this.playIdArrs.sort(this.byValue);
    }

    /**
     * 按照排序字段排序
     * */
     private byValue(a:number, b:number): number {
        if (a < b) {
            return -1;
        } else if (a == b) {
            return 0;
        } else if (a > b) {
            return 1;
        }
        return 0;
    }

    /**
     * 获取玩法数据
     * @param index 
     * @returns 
     */
    getUiPlayBaseByIndex(index: number): t_s_uiplaybaseData {
        let playId = this.playIdArrs[index];
        return this.baseDic[playId];
    }

    getUIPlayLevel(levelId: number) {
        let heroTemp: t_s_uiplaylevelData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_uiplaylevel, levelId.toString());
        if (heroTemp) {
            Logger.log(heroTemp);
        }
    }

    setPlayId(id: number) {
        this.curPlayID = id;
        let item:UserUiPlayInfoMsg;
        this.userUiPlayInfoMsg = null;
        for(let i:number = 0;i<this.userUiPlayListMsg.uiPlayInfoList.length;i++){
            item = this.userUiPlayListMsg.uiPlayInfoList[i] as UserUiPlayInfoMsg;
            if(item && item.playId == this.curPlayID)
            {
                this.userUiPlayInfoMsg = item;
            }
        }
    }

    getPlayIdByIndex(index: number) {
        return this.playIdArrs[index];
    }

    public getUIPlayBaseDic() {
        return this.baseDic;
    }

    public getUIPlayLevelDic() {
        return this.levelDic;
    }

    getCurLevelList() {
        if (this.curPlayID) {
            return this.getUIPlayLevelListByType(this.curPlayID);
        }
        return [];
    }

    public getUIPlayLevelListByType(type: number) {
        let arrs = []
        for (const key in this.levelDic) {
            if (Object.prototype.hasOwnProperty.call(this.levelDic, key)) {
                const element = this.levelDic[key];
                if (this.levelDic[key].UiPlayId == type) {
                    arrs.push(this.levelDic[key]);
                }
            }
        }
        return arrs;
    }

    public getTabListData() {
        return this.tabListData;
    }

    setTreeSelectIndex(index: number) {
        // if (this.treeSelectIndex == index) {
        //     return;
        // }
        this.treeSelectIndex = index;
        this.curLevelData = this.getUIPlayLevelListByType(this.curPlayID)[this.treeSelectIndex];
    }

    getCurLevelData(): t_s_uiplaylevelData {
        return this.curLevelData;
    }

    // 玩法是否解锁
    getPlayLock(index: number): boolean {
        return this.getUiPlayBaseByIndex(index).Grade > ArmyManager.Instance.thane.grades;
    }

    // 关卡是否解锁
    getLevelLock(index: number): boolean {
        return index >= this.userUiPlayInfoMsg.levelSort;
    }
    
    public setUiPlay(index: number) {
        let playId = this.getPlayIdByIndex(index);
        // 玩法
        this.setPlayId(playId);
        if(this.userUiPlayInfoMsg){
            this.levelSort = this.userUiPlayInfoMsg.levelSort;
        }
        else{
            this.levelSort = 0;
        }
        this.dispatchEvent(PetCampaignEvent.PET_CAMPAIGN_JUMP_LEVEL);
    }

    public setInfo(playId:number){
        this.setPlayId(playId);
        if(this.userUiPlayInfoMsg){
            this.levelSort = this.userUiPlayInfoMsg.levelSort;
        }
        else{
            this.levelSort = 0;
        }
        this.dispatchEvent(PetCampaignEvent.PET_CAMPAIGN_JUMP_LEVEL);
    }

    public setSelectIndex(index: number) {
        this.setTreeSelectIndex(index);
        this.dispatchEvent(PetCampaignEvent.PET_CAMPAIGN_TREE_SELECT, index);
    }

    public sendUIPlayMopup() {
        // let msg: CampaignSweepReq = new CampaignSweepReq();
        // msg.sweepType = sweep_type;
        // msg.opType = op_type;
        // msg.campaignId = campaign_id;
        // msg.count = count;
        // msg.eIndex = eIndex;
        // msg.enterType = enterType
        // msg.openSilverBox = openSilverBox;
        // msg.openSecretBox = openSecretBox;
        // msg.payType = payType;
        // SocketManager.Instance.send(C2SProtocol.C_CAMPAIGN_SWEEP, msg);
    }
}