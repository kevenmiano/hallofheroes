// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 21:31:47
 * @LastEditTime: 2023-09-21 10:42:58
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import GTabIndex from "../../../constant/GTabIndex"
import FrameDataBase from "../../../mvc/FrameDataBase"
import { t_s_composeData } from '../../../config/t_s_compose';
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo"
import { TempleteManager } from "../../../manager/TempleteManager"
import { PetData } from "./PetData"
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ShowPetAvatar } from "../../../avatar/view/ShowPetAvatar";
import { EmWindow } from "../../../constant/UIDefine";
import FightingManager from "../../../manager/FightingManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ComponentSetting from "../../../utils/ComponentSetting";
import { EmPetType } from "../../../constant/Const";
import SimpleAlertHelper, { AlertBtnType } from "../../../component/SimpleAlertHelper";
import UIManager from "../../../../core/ui/UIManager";


export default class PetModel extends FrameDataBase {
    public static PetListInit: boolean = false;
    public static needSaveFormation: boolean = false;
    public static saveFormationStr:string;
    public static saveFormationArray:Array<number> = [];
    public static saveFormationIndexStr:string;
    public static isClickPetList:boolean = false;
    public static potencyActiveTempIdArr = [208067,208068,208069,208070,208071];//英灵潜能激活的五种道具
    public static TabIndex = {
        Pet_AttrAdvance: Math.floor(GTabIndex.Pet_AttrAdvance / 1000),
        Pet_AttrIntensify: Math.floor(GTabIndex.Pet_AttrIntensify / 1000),
        Pet_Skill: Math.floor(GTabIndex.Pet_Skill / 1000),
        Pet_Refining: Math.floor(GTabIndex.Pet_Refining / 1000),
        Pet_Equip: Math.floor(GTabIndex.Pet_Euip / 1000),
        Pet_Exchange: Math.floor(GTabIndex.Pet_Exchange / 1000),
        Pet_Formation: Math.floor(GTabIndex.Pet_Formation / 1000),
        Pet_Potency: Math.floor(GTabIndex.Pet_Potency / 1000),
        Pet_Artifact: Math.floor(GTabIndex.Pet_Artifact / 1000),
    }

    public static HelpIndex = {
        [PetModel.TabIndex.Pet_AttrAdvance]: 2,
        [PetModel.TabIndex.Pet_AttrIntensify]: 4,
        [PetModel.TabIndex.Pet_Skill]: 5,
        [PetModel.TabIndex.Pet_Refining]: 6,
        [PetModel.TabIndex.Pet_Equip]: 7,
        [PetModel.TabIndex.Pet_Exchange]: 9,
        [PetModel.TabIndex.Pet_Formation]: 10,
    }

    public static isHighestStagePet(petData: PetData): boolean {
        if (!petData) return false;
        if (!petData.template) return false;

        if (petData.template.Property2 == ComponentSetting.PetRefiningMaxStage) {
            return true;
        }
        return false;
    }

    private static _petCompose100CostPoint: number = 0;
    public static get petCompose100CostPoint(): number {
        if (this._petCompose100CostPoint == 0) {
            this._petCompose100CostPoint = 200;
            var temp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("fuse_pet_points");
            if (temp) {
                this._petCompose100CostPoint = parseInt(temp.ConfigValue);
            }
        }
        return this._petCompose100CostPoint;
    }
    private static _composePetTemplateList: t_s_composeData[];
    public static getComposePetTemplateList(): t_s_composeData[] {
        if (!this._composePetTemplateList) {
            this._composePetTemplateList = [];
            //优化标记 根据原逻辑 修改
            // var composeTemplateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_compose)
            let composeTemplateDic = TempleteManager.Instance.getComposeByType(7)
            if (composeTemplateDic) {
                this._composePetTemplateList = composeTemplateDic.concat();
            }
            // for (const key in composeTemplateDic) {
            //     if (composeTemplateDic.hasOwnProperty(key)) {
            //         const info = composeTemplateDic[key];
            //         if (info.Types == 7) {
            //             this._composePetTemplateList.push(info);
            //         }
            //     }
            // }
        }
        return this._composePetTemplateList;
    }


    /**  在放入英灵时检测 */
    public static checkCanComposeAndTip(petData: PetData): boolean {
        let result: boolean;
        let msg: string;

        if (!petData || !petData.template) return;

        if (!this.isOpenComposed(petData)) {
            msg = LangManager.Instance.GetTranslation("petCompose.cannotCompose2");
        }
        // if (this.isHighestStagePet(petData)) {
        //     msg = LangManager.Instance.GetTranslation("petCompose.cannotCompose1");
        // }

        // if (petData.isEnterWar) {
        //     msg = LangManager.Instance.GetTranslation("petCompose.isEnterWar");
        // }
        // else if (petData.isPractice) {
        //     msg = LangManager.Instance.GetTranslation("petCompose.isPractice");
        // }
        // else if (PlayerManager.Instance.currentPlayerModel.playerInfo.petChallengeFormationOfArray.indexOf(petData.petId + "") >= 0) {
        //     msg = LangManager.Instance.GetTranslation("pet.inPetChanglle3");
        // }else if(petData.isRemote){
        //     msg = LangManager.Instance.GetTranslation("pet.inRemotePet3");
        // }

        if (msg) {
            result = false;
            MessageTipManager.Instance.show(msg);
        } else {
            result = true;
        }
        return result;
    }

    private static isOpenComposed(petData: PetData): boolean {
        return true;
    }

    public static get hasPet(): boolean {
        let playInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        return playInfo && playInfo.petList && playInfo.petList.length > 0;
    }
   
    public static hasSamePet():boolean{
        for (let i = 101; i < 107; i++) {
            let arr = this.getSamePetType(i);
            if(arr.length>1){
                return true;
            }
        }
        return false;
    }

    /**
     * 打开英灵界面、英灵远征界面、英灵竞技界面、使用英灵封印珠时，若同系有多只英灵，会先弹提示
     */
    public static  checkSamePetType(){
        if(PetModel.hasSamePet()){
            PetModel.showPrompt();
            return true;
        }
        return false;
    }

    /**
     * 同系有多只英灵
     */
    public static  getSamePetType(petType:EmPetType): any {
        let result:any = [];
        let playInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        if(playInfo && playInfo.petList && playInfo.petList.length > 0){
            let array = playInfo.petList;
            for (let i = 0; i < array.length; i++) {
                const petData:PetData = array[i];
                if(petData.template.PetType == petType){
                    result.push(petData);
                }
            }
        }
        return result;
    }

    //打开英灵界面、英灵远征界面、英灵竞技界面、使用英灵封印珠时，若同系有多只英灵，会先弹提示“由于英灵系统变更，同系英灵只可保留1只，请前往新界面选择需要保留的英灵”（此窗口只能点确定，不能取消）
    public static showPrompt(){
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation("PetSave.txt5");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, (b:boolean)=>{
            if(b)
            {
                SimpleAlertHelper.Instance.Hide();
                //点击确认后关闭当前界面，弹出选择保留英灵界面
                UIManager.Instance.ShowWind(EmWindow.PetSaveWnd);
            }
        },AlertBtnType.O,false,true);
    }

    public dispose() {
        ShowPetAvatar.releaseAllRes();
        if (FightingManager.Instance.openPetWndFlag) {
            FrameCtrlManager.Instance.open(EmWindow.FightingPetWnd);
        }
        PetModel.PetListInit = false;
        super.dispose();
    }
}