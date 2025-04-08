// @ts-nocheck
import BaseTips from "../../../tips/BaseTips";
import {BottleUserInfo} from "../model/BottleUserInfo";
import LangManager from "../../../../core/lang/LangManager";
import {GoodsInfo} from "../../../datas/goods/GoodsInfo";
import BottlePackage = com.road.yishi.proto.item.BottlePackage;
import BottleItemInfoMsg = com.road.yishi.proto.item.BottleItemInfoMsg;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/23 10:53
 * @ver 1.0
 */
export class BottleIntergalBoxTips extends BaseTips
{
    public belong:fgui.Controller;
    public isVip:fgui.Controller;
    public txt_floor:fgui.GTextField;
    public txt_content:fgui.GTextField;
    public txt_name:fgui.GRichTextField;

    private _info:any;

    constructor()
    {
        super();
    }

    public OnInitWind()
    {
        super.OnInitWind();

        this.belong = this.getController("belong");
        this.isVip = this.getController("isVip");
        this.belong.selectedIndex = 0;
        this._info = this.params[0];
        this.updateInfo();
        this.contentPane.ensureBoundsCorrect();
    }

    public OnShowWind()
    {
        super.OnShowWind();
    }

    private updateInfo()
    {
        if(this._info)
        {
            let userInfo:BottleUserInfo;//人物信息数组
            let packData:BottlePackage;
            let rewardArr:BottleItemInfoMsg[];
            if(this._info.hasOwnProperty("packageData"))
            {
                packData = this._info.packageData;
            }
            if(this._info.hasOwnProperty("userInfo"))
            {
                userInfo = this._info.userInfo;
            }
            this.txt_floor.setVar("floor", packData.param.toString()).flushVars();
            if(packData)
            {
                rewardArr = packData.item as BottleItemInfoMsg[];
            }

            if(rewardArr)//有奖励物品
            {
                let len:number = rewardArr.length;
                let str:string = "";
                let goods:GoodsInfo = new GoodsInfo();
                for(let j:number = 0; j < len; j++)
                {
                    goods.templateId = (rewardArr[j] as BottleItemInfoMsg).tempId;
                    if(goods.templateInfo)
                    {
                        str += goods.templateInfo.TemplateNameLang + " x" + (rewardArr[j] as BottleItemInfoMsg).count + ",";
                    }
                }
                this.txt_content.text = str.substring(0, str.lastIndexOf(","));

                if(userInfo != null)//这个礼包有人踩到了, 即是有人获奖了
                {
                    this.belong.selectedIndex = 1;
                    this.isVip.selectedIndex = 0;//userInfo.isVip ? 1 : 0;
                    this.txt_name.text = userInfo.userName;
                }
                else
                {
                    this.belong.selectedIndex = 0;
                }
            }
            else //没有奖励物品
            {
                this.txt_content.text = LangManager.Instance.GetTranslation("bottle.BottleBoxViewTips.nameText");
            }
        }
    }

    createModel() {
        super.createModel();
        this.modelMask.alpha = 0;
    }

    public OnHideWind()
    {
        super.OnHideWind();
    }

    dispose()
    {
        this._info = null;
        super.dispose();
    }
}