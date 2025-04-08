// @ts-nocheck
import Dictionary from "../../../../core/utils/Dictionary";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { ArmyPawn } from "../../../datas/ArmyPawn";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import FrameDataBase from "../../../mvc/FrameDataBase";

export default class ArmyModel extends FrameDataBase {

    private _currentOpenPanel: string;

    public curBagType: number;
    public curAcceptBagType: number;

    public oldEquip: SimpleDictionary;
    public tempId1: number;
    public count1: number;

    public dragEnable: boolean;

    public addStrength: number;
    public addAgility: number;
    public addAbility: number;
    public addPhysique: number;
    public addCaptain: number;

    public currentPage: number = 1;

    // public currentBag: BaseBagListView;
    public currentSortType: number;

    public get currentOpenPanel(): string {
        return this._currentOpenPanel;
    }

    public set currentOpenPanel(value: string) {
        this._currentOpenPanel = value;
    }

    public get uArmy(): BaseArmy {
        return ArmyManager.Instance.army;
    }
    private get playerIno(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
   
    public autoAllocate() {
        var arr: any[] = this.getCastlePawnByValue();
        if (arr.length == 0) return;

        var ap: ArmyPawn = this.uArmy.getPawnByIndex(0);
        var templateId: number = 0;
        var count: number = 0;
        if (ap && ap.ownPawns != 0) {
            if (ap.ownPawns >= this.thane.attackProrerty.totalConatArmy)
                return;
            templateId = ap.templateId;
            count = this.getPawnNumber(ap, null);
            if (count == 0) return;
            this.uArmy.addArmyPawnCountByIndex(0, count);
        }
        else {
            var armyPawn: ArmyPawn = arr[0] as ArmyPawn;
            count = this.getPawnNumber(null, armyPawn);
            templateId = armyPawn.templateId;
            this.uArmy.addNewPawnByIndex(0, armyPawn, count);
        }
        ArmyManager.Instance.removePawnCountById(templateId, count);
    }

    private getPawnNumber(pawn: ArmyPawn, newPawn: ArmyPawn): number {
        var oldNumber: number = pawn == null ? 0 : pawn.ownPawns;
        var number: number;
        var newPawnNumber: number;
        if (!newPawn) {
            newPawnNumber = this.getNewNumberByID(pawn.templateId);
            number = this.thane.attackProrerty.totalConatArmy / pawn.templateInfo.NeedPopulation;
        }
        else {
            newPawnNumber = this.getNewNumberByID(newPawn.templateId);
            number = this.thane.attackProrerty.totalConatArmy / newPawn.templateInfo.NeedPopulation;
        }
        return number - oldNumber >= newPawnNumber ? newPawnNumber : number - oldNumber;
    }

    public getCastlePawnByValue(): any[] {
        var arr: any[] = [];
        var dic: Dictionary = new Dictionary();
        var tempArr:any[] = ArmyManager.Instance.castlePawnList.getList();
        var pawn: ArmyPawn;
        for (let i: number = 0; i < tempArr.length; i++) {
            pawn = tempArr[i];
            if (pawn && pawn.ownPawns != 0) {
                var value: number = (pawn.attack + pawn.defence + pawn.magicAttack + pawn.magicDefence + pawn.live) * 50000 + parseInt(pawn.templateInfo.NeedBuilding.toString());
                arr.push(value);
                dic[value] = pawn;
            }
        }
        arr.sort((a:number,b:number)=>{
            if(a>b)
            {
                return 1;
            }
            else if(a<b)
            {
                return -1;
            }
            else 
            {
                return 0;
            }
        });
        var tempArr: any[] = [];
        var len: number = arr.length;
        for (var i: number = 0; i < len; i++) {
            tempArr.push(dic[arr[i]]);
        }
        return tempArr;
    }

    private getNewNumberByID(templateId: number): number {
        if (ArmyManager.Instance.getPawnById(templateId)) {
            return ArmyManager.Instance.getPawnById(templateId).ownPawns;
        }
        else {
            return 0;
        }
    }

    public hasEquipEffect(property: string): number {
        var goodsList: SimpleDictionary = GoodsManager.Instance.getHeroEquipListById(this.thane.id);
        var itemList:any[] = goodsList.getList();
        var info: GoodsInfo;
        for(let i:number = 0;i<itemList.length;i++)
        {
            info = <GoodsInfo>itemList[i];
            if (info.templateInfo[property] > 0) return 2;
        }
        return 1;
    }

    public hasAddedPoint(): boolean {
        if (this.thane.baseProperty.addAgilityPoint + this.addAgility > 0) return true;
        if (this.thane.baseProperty.addIntellectPoint + this.addAbility > 0) return true;
        if (this.thane.baseProperty.addPowerPoint + this.addStrength > 0) return true;
        if (this.thane.baseProperty.addPhysiquePoint + this.addPhysique > 0) return true;
        if (this.thane.baseProperty.addCaptainPoint + this.addCaptain > 0) return true;
        return false;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }
}