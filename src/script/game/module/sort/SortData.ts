import { BaseArmy } from "../../map/space/data/BaseArmy";
import MagicCardFightInfo from "../card/MagicCardFightInfo";
import { PetData } from "../pet/data/PetData";

/**
* @author:pzlricky
* @data: 2021-08-20 11:06
* @description *** 
*/
export default class SortData {

    public userId: number = 0;
    public orderId: number = 0;
    public grades: number = 0;
    public HideFashion: boolean = false;
    public gp: number = 0;
    public consortiaLevel: number = 0;
    public consortiaFightPower: number = 0;
    public fightCapacity: number = 0;
    public offer: number = 0;
    public nickName: string = "";
    public consortiaName: string = "";
    public selfHonour: number = 0;
    public honorEquipStage: number = 0;
    public charms: number = 0;  //魅力值
    public soulScore: number = 0;//积分
    public army: BaseArmy;
    public pvpScore: number = 0;
    public serverName: string = "";
    public mainSite: string = "";
    public headId: number = 0;
    public frameId: number = 0;
    public job: number = 0;
    public petData: PetData;
    public cardFightInfoList: Array<MagicCardFightInfo>;
    public point:Laya.Point;
    constructor() {
        this.army = new BaseArmy();
    }

    public getCellHeight(): number {
        return 33;
    }

}

