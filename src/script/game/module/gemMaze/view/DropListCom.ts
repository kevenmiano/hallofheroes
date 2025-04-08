// @ts-nocheck
import FUI_DropList from "../../../../../fui/GemMaze/FUI_DropList";
import FUI_DropListItem from "../../../../../fui/GemMaze/FUI_DropListItem";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_dropconditionData } from "../../../config/t_s_dropcondition";
import { t_s_dropitemData } from "../../../config/t_s_dropitem";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { TempleteManager } from "../../../manager/TempleteManager";
import DropListItem from "./item/DropListItem";

/**
 * 奖励预览
 */
 export default class DropListCom extends FUI_DropList{
    private dropArr:Array<GoodsInfo>;
    private _gemLevel:number=-1;

    protected onConstruct() {
        super.onConstruct();
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderList, null, false);
        this.dropArr = [];
        this.click_rect.onClick(this, this.onClose);
        this.txt.text = LangManager.Instance.GetTranslation('gemMaze.str3');
    }

    updateView(gemLevel:number){
        if(this._gemLevel != gemLevel){
            this.dropArr.length = 0;
            let idArr = [];
            let goodsInfo:GoodsInfo;
            let array:t_s_dropconditionData[] = TempleteManager.Instance.getDropConditionByType(101);
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.Para1[0] == gemLevel){
                    let goodsIdArr:Array<t_s_dropitemData> = TempleteManager.Instance.getDropItemssByDropId(element.DropId);
                    for (let j = 0; j < goodsIdArr.length; j++) {
                        const dropData = goodsIdArr[j];
                        if(idArr.indexOf(dropData.ItemId) == -1){
                            goodsInfo = new GoodsInfo();
                            goodsInfo.templateId = dropData.ItemId;
                            this.dropArr.push(goodsInfo);
                            idArr.push(dropData.ItemId);
                        }
                    }
                }
            }
            this.list.numItems = this.dropArr.length;
        }
    }

    private onRenderList(index: number, item: DropListItem){
        if(item){
            let goodsInfo:GoodsInfo = this.dropArr[index];    
            (item.goodsItem as BaseItem).info = goodsInfo;
            item.txt_name.text = goodsInfo.templateInfo.TemplateNameLang
            item.txt_name.color = GoodsSonType.getColorByProfile(goodsInfo.templateInfo.Profile);    
        }  
    }

    onClose(){
        this.visible = false;
    }

    dispose(): void {
        // if(this.list){
        //     this.list.itemRenderer.recover();
        // }
        Utils.clearGListHandle(this.list);
        this.click_rect.offClick(this, this.onClose);
        this.dropArr.length = 0;
        super.dispose();
    }

 }