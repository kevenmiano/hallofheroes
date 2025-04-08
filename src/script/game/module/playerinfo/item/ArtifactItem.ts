// @ts-nocheck
import FUI_ArtifactItem from "../../../../../fui/PlayerInfo/FUI_ArtifactItem";
import Utils from "../../../../core/utils/Utils";
import { BagType } from "../../../constant/BagDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import ArtifactTips from "../../../tips/ArtifactTips";
import { PetData } from "../../pet/data/PetData";

export default class ArtifactItem extends FUI_ArtifactItem{
    //@ts-ignore
    public petItem:PetItem;
     //@ts-ignore
	public art1:ArtifactCell;
     //@ts-ignore
	public art2:ArtifactCell;
    private _petData:PetData;
    private _type:number = 0;
    onConstruct() {
        Utils.setDrawCallOptimize(this);
        super.onConstruct();
    }

    public set type(value:number){
        this._type = value;
    }

    public set info(petData:PetData){
        this._petData = petData;
        if(this._petData){
            this.petItem.info = this._petData;
            this.art1.type = this.art2.type = ArtifactTips.OTHER_TYPE;
            if(this._type == 1){//别人的
                this.art1.info = this.getGoodsInfo(this._petData,6);
                this.art2.info = this.getGoodsInfo(this._petData,7);
            }else if(this._type == 2){//自己的
                this.art1.info = this.getSelfGoodsInfo(this._petData,6);
                this.art2.info = this.getSelfGoodsInfo(this._petData,7);
            }
        }else{
            this.petItem.info = null;
            this.art1.info = null;
            this.art2.info = null;
        }
    }

    private getSelfGoodsInfo(petData:PetData,pos:number):GoodsInfo{
        let target:GoodsInfo;
        let equipArr = GoodsManager.Instance.getGoodsByBagType(BagType.PET_EQUIP_BAG);
        for (let i = 0; i < equipArr.length; i++) {
            let goodsInfo = equipArr[i];
            //判断英灵是否有穿戴装备
            if (goodsInfo.objectId == petData.petId && goodsInfo.pos == pos) {
                target = goodsInfo;
                break;
            }
        }
        return target;
    }


    private getGoodsInfo(petData:PetData,pos:number):GoodsInfo{
        let target:GoodsInfo;
        for(let i:number = 0;i<petData.equipGoodsArr.length;i++){
            let goods = petData.equipGoodsArr[i];
            if(goods && goods.pos == pos){
                target = goods;
                break;
            }
        }
        return target;
    }
}