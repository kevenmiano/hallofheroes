// @ts-nocheck
import ConfigMgr from "../../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import Dictionary from "../../../../core/utils/Dictionary";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { t_s_mounttemplateData } from "../../../config/t_s_mounttemplate";
import { t_s_wishingpoolData } from "../../../config/t_s_wishingpool";
import { ConfigType } from "../../../constant/ConfigDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";

export default class WishPoolModel extends GameEventDispatcher {
    public allDic: Dictionary = new Dictionary();
    public allWishPoolArr: Array<t_s_wishingpoolData>
    public static FASHION_CLOTHES: number = 1;
    public static MOUNT: number = 2;

    public allGoodsDic: Dictionary;
    constructor() {
        super();
        this.init();
    }

    private init() {
        let templateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_wishingpool);
        this.allWishPoolArr = [];
        this.allGoodsDic = new Dictionary();
        for (const dicKey in templateDic) {
            if (templateDic.hasOwnProperty(dicKey) && parseInt(dicKey) > 0) {
                let wishingpoolData: t_s_wishingpoolData = templateDic[dicKey];
                if (wishingpoolData) {
                    this.allWishPoolArr.push(wishingpoolData);
                    if (wishingpoolData.Type == WishPoolModel.FASHION_CLOTHES) {
                        this.initFashionGoods(wishingpoolData);
                    } else {
                        this.initMountGoods(wishingpoolData);
                    }
                }
            }
        }
        this.allWishPoolArr = ArrayUtils.sortOn(this.allWishPoolArr, "Id", ArrayConstant.NUMERIC);
    }

    initFashionGoods(wishingpoolData: t_s_wishingpoolData) {
        let itemTemplateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_itemtemplate);
        let goodsInfo: GoodsInfo;
        let fashionGoodsArr: Array<GoodsInfo> = [];
        for (const dicKey in itemTemplateDic) {
            if (itemTemplateDic.hasOwnProperty(dicKey)) {
                let temp: t_s_itemtemplateData = itemTemplateDic[dicKey];
                if (temp && GoodsManager.Instance.isFashion(temp)) {//是时装
                    if (temp.Limited == 1 || temp.Activation == 1) {
                    }
                    else {
                        goodsInfo = new GoodsInfo();
                        if (this.checkPassFashion(temp.TransformId, wishingpoolData)) {
                            goodsInfo.templateId = temp.TemplateId;
                            goodsInfo.sortNumber = temp.TransformId;
                            fashionGoodsArr.push(goodsInfo);
                        }
                    }
                }
            }
        }
        fashionGoodsArr = ArrayUtils.sortOn(fashionGoodsArr, "sortNumber", ArrayConstant.NUMERIC);
        this.allGoodsDic.set(wishingpoolData.Id, fashionGoodsArr);
    }

    private checkPassFashion(transformId: number, wishingpoolData: t_s_wishingpoolData):boolean {
        let arr = wishingpoolData.Rare1.split("|");
        let len = arr.length;
        let str: string;
        let strArr: Array<string>;
        let minValue: number = 555;
        for (let i: number = 0; i < len; i++) {
            str = arr[i];
            strArr = str.split(",");
            if (parseInt(strArr[0]) < minValue) {
                minValue = parseInt(strArr[0]);
            }
        }
        arr = wishingpoolData.LuckRare1.split("|");
        len = arr.length;
        for (let i: number = 0; i < len; i++) {
            str = arr[i];
            strArr = str.split(",");
            if (parseInt(strArr[0]) < minValue) {
                minValue = parseInt(strArr[0]);
            }
        }
        if (transformId < minValue) {
            return false;
        } else {
            return true;
        }
    }

    initMountGoods(wishingpoolData:t_s_wishingpoolData) {
        let mountGoodsArr: Array<GoodsInfo> = [];
        let mountTemplateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_mounttemplate);
        for (const dicKey in mountTemplateDic) {
            if (mountTemplateDic.hasOwnProperty(dicKey)) {
                let temp: t_s_mounttemplateData = mountTemplateDic[dicKey];
                if (temp) {
                    if (temp.Limited == 1 || temp.Activation == 1
                        || temp.NeedItemId == 0) {
                    }
                    else {
                        let itemtemplateData: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, temp.NeedItemId);
                        if (itemtemplateData && itemtemplateData.Property2 == -1 && this.checkPassMount(temp.SoulScore,wishingpoolData)) {
                            let goodsInfo = new GoodsInfo();
                            goodsInfo.templateId = itemtemplateData.TemplateId;
                            goodsInfo.sortNumber = temp.SoulScore;
                            mountGoodsArr.push(goodsInfo);
                        }
                    }
                }
            }
        }
        mountGoodsArr = ArrayUtils.sortOn(mountGoodsArr, ["sortNumber", "templateId"], [ArrayConstant.DESCENDING, ArrayConstant.DESCENDING]);
        this.allGoodsDic.set(wishingpoolData.Id, mountGoodsArr);
    }

    private checkPassMount(soulScore: number, wishingpoolData: t_s_wishingpoolData):boolean {
        let arr = wishingpoolData.Rare1.split("|");
        let len = arr.length;
        let str: string;
        let strArr: Array<string>;
        let maxValue: number = 0;
        for (let i: number = 0; i < len; i++) {
            str = arr[i];
            strArr = str.split(",");
            if (parseInt(strArr[1]) > maxValue) {
                maxValue = parseInt(strArr[1]);
            }
        }
        arr = wishingpoolData.LuckRare1.split("|");
        len = arr.length;
        for (let i: number = 0; i < len; i++) {
            str = arr[i];
            strArr = str.split(",");
            if (parseInt(strArr[1]) > maxValue) {
                maxValue = parseInt(strArr[1]);
            }
        }
        if (soulScore > maxValue*10) {
            return false;
        } else {
            return true;
        }
    }
}