// @ts-nocheck
import FUI_StrenAtrriItem1 from "../../../../../../fui/Pet/FUI_StrenAtrriItem1";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import { PackageIn } from "../../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../../core/net/ServerDataManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../../core/ui/UIButton";
import UIManager from "../../../../../core/ui/UIManager";
import { t_s_attributeData } from "../../../../config/t_s_attribute";
import { t_s_petequipqualityData } from "../../../../config/t_s_petequipquality";
import { t_s_petequipstrengthenData } from "../../../../config/t_s_petequipstrengthen";
import { PetEvent } from "../../../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../../../constant/protocol/S2CProtocol";
import { EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ResourceManager } from "../../../../manager/ResourceManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import PetCtrl from "../../control/PetCtrl";
import { PetData } from "../../data/PetData";
import { PetEquipCell } from "./PetEquipCell";

import StoreRspMsg = com.road.yishi.proto.store.StoreRspMsg
import { t_s_dropitemData } from "../../../../config/t_s_dropitem";
import { t_s_petequipattrData } from "../../../../config/t_s_petequipattr";
import { ConfigType } from "../../../../constant/ConfigDefine";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import Utils from "../../../../../core/utils/Utils";
/**
 * 英灵装备强化界面
 */
export default class PetEuipTrainWnd extends BaseWindow {
    public frame: fgui.GComponent;

    private tabAttr: fairygui.GButton;
    //强 化
    private btn_stren: UIButton;
    //连续强化
    private btn_stren1: UIButton;
    //要强化的英灵装备
    petEquipCell: PetEquipCell;
    //成功率: 
    txt_percent: fairygui.GTextField;
    //消耗货币-910的数量
    txt_cash: fairygui.GTextField;
    //消耗黄金
    txt_gold: fairygui.GTextField;
    txt_cash1: fairygui.GTextField;

    t1: fairygui.GTextField;
    txt_1: fairygui.GTextField;
    txt_2: fairygui.GTextField;
    txt_lv1: fairygui.GTextField;
    txt_lv2: fairygui.GTextField;
    txt_name: fairygui.GTextField;
    txt2: fairygui.GTextField;

    private _goodsInfo: GoodsInfo;
    private c1: fgui.Controller;

    private _curStrenLevel: number = 0;
    private isMax: boolean = false;

    item1: FUI_StrenAtrriItem1;
    item2: FUI_StrenAtrriItem1;
    item3: FUI_StrenAtrriItem1;
    item4: FUI_StrenAtrriItem1;
    item5: FUI_StrenAtrriItem1;

    public strenAni: fgui.GMovieClip;
    public mc_loading: fgui.GMovieClip;
    img_ok: fairygui.GLoader;
    img_fail: fairygui.GLoader;
    private strenResult: boolean = false;
    private isPlaying: boolean = false;
    /** 是否收到服务器返回的强化结果 */
    private _recvMsg: boolean = false;
    
	private _dropitemDatas: t_s_dropitemData[];
	private _petequipattrDatas: t_s_petequipattrData[];

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initLanguage();
        this.c1 = this.contentPane.getControllerAt(0);
    }

    private initLanguage() {

        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('petEuip.title');
        this.btn_stren.title = LangManager.Instance.GetTranslation('HigherGradeOpenTipView.content4');
        this.btn_stren1.title = LangManager.Instance.GetTranslation('petEuip.stren');
        this.tabAttr.title = LangManager.Instance.GetTranslation('petEuip.stren');
        this.txt_1.text = LangManager.Instance.GetTranslation('fashion.view.compose.composeRate');
        this.txt_2.text = LangManager.Instance.GetTranslation('petEuip.material');
        this.t1.text = LangManager.Instance.GetTranslation('petEquip.stren');
        this.txt2.text = LangManager.Instance.GetTranslation('petEquip.trainMax');
    }

    OnShowWind() {
        super.OnShowWind();
        this._goodsInfo = this.params;
		if (!this._goodsInfo) return;

		if (this._goodsInfo.templateInfo.Property2) {
			this._dropitemDatas = TempleteManager.Instance.getDropItemssByDropId(this._goodsInfo.templateInfo.Property2);
			if (this._dropitemDatas) {
				let dropItemIds = this._dropitemDatas.map((item) => item.ItemId);
				this._petequipattrDatas = ConfigMgr.Instance.getDicSync(ConfigType.t_s_petequipattr);
				this._petequipattrDatas = dropItemIds.map((key: string | number) => this._petequipattrDatas[key]);
			}
		}

        this.updateView();
        ServerDataManager.listen(S2CProtocol.U_C_ITEM_STRENGTHEN, this, this.__onIntensifyResult);
    }

    private goldCondition: boolean;
    private cashCondition: boolean;
    updateView() {
        this.petEquipCell.info = this._goodsInfo;
        this.petEquipCell.touchable = false;
        this.txt_name.text = this._goodsInfo.templateInfo.TemplateNameLang;
        this.txt_lv1.text = this._goodsInfo.strengthenGrade + '';
        this.txt_lv2.text = (this._goodsInfo.strengthenGrade + 1) + '';
        this.updateAttr(this._goodsInfo.masterAttr, this._goodsInfo.sonAttr);
        let cfg: t_s_petequipstrengthenData = TempleteManager.Instance.getPetEquipStrenData(this._goodsInfo.strengthenGrade + 1);
        if (cfg && !this.isMax) {
            this.txt_percent.text = Math.round(cfg.Probability / 100) + '%';
            this.cashCondition = PlayerManager.Instance.currentPlayerModel.playerInfo.petEquipStrengNum >= cfg.StrengthenConsume;
            this.goldCondition = ResourceManager.Instance.gold.count >= cfg.StrengthenGold;
            this.txt_cash.color = this.cashCondition ? '#FFECC6' : "#ff0000";
            if (this.goldCondition) {
                this.txt_gold.text = ResourceManager.Instance.gold.count + '/' + '[color=#59cd41]' + cfg.StrengthenGold + '[/color]';
            } else {
                this.txt_gold.text = ResourceManager.Instance.gold.count + '/' + '[color=#ff0000]' + cfg.StrengthenGold + '[/color]';
            }
            if (this.cashCondition) {
                this.txt_cash.text = PlayerManager.Instance.currentPlayerModel.playerInfo.petEquipStrengNum + '/' + '[color=#59cd41]' + cfg.StrengthenConsume + '[/color]';
            } else {
                this.txt_cash.text = PlayerManager.Instance.currentPlayerModel.playerInfo.petEquipStrengNum + '/' + '[color=#ff0000]' + cfg.StrengthenConsume + '[/color]';
            }
            this.btn_stren.enabled = this.btn_stren1.enabled = this.cashCondition && this.goldCondition;
        } else {
            this.c1.setSelectedIndex(1);
            this.btn_stren.enabled = this.btn_stren1.enabled = false;
            this.txt_gold.text = ResourceManager.Instance.gold.count + '/' + '[color=#ff0000]' + 0 + '[/color]';
            this.txt_cash.text = PlayerManager.Instance.currentPlayerModel.playerInfo.petEquipStrengNum + '/' + '[color=#ff0000]' + 0 + '[/color]';
        }
    }

    private __onIntensifyResult(pkg: PackageIn) {
        let msg = pkg.readBody(StoreRspMsg) as StoreRspMsg;
        Logger.log("[PetEuipTrainWnd]__onIntensifyResult", msg)
        this._recvMsg = true;
        this.strenResult = msg.strengResult;
        this.txt_lv1.text = this._goodsInfo.strengthenGrade + '';
        // let level = this._goodsInfo.strengthenGrade;
        // let son_attr = this._goodsInfo.sonAttr;
        if (msg.masterAttr) {
            this._goodsInfo.masterAttr = msg.masterAttr;
        }
        if (msg.sonAttr) {
            this._goodsInfo.sonAttr = msg.sonAttr;
        }
        if (msg.strengthenGrade > this._goodsInfo.strengthenGrade) {
            this._goodsInfo.strengthenGrade = msg.strengthenGrade;
            NotificationManager.Instance.dispatchEvent(PetEvent.STERN_PET_EQUIP, this._goodsInfo);
            // if(!this.isPlaying){
            //     UIManager.Instance.ShowWind(EmWindow.PetEquipStrenOkWnd,{level:level,son_attr:son_attr,info:this._goodsInfo});
            // } 
        }

        // this.updateAttr(msg.masterAttr,msg.sonAttr);
        if (this.strenResult) {
            this.updateView();
        }
        if (this.mc_loading.visible) {
            this.mc_loading.visible = false;
            this.showTxtTip();
        }
    }
    private _sonAttrPre = ""
    /**
     * masterAttr  英灵装备主属性(属性类型:基础属性值:增幅:)attId1:basenum1:addNum;
     * sonAttr 字符串, 属性Id:基础属性值:每次增长值
     */
    private updateAttr(masterAttr: string, sonAttr: string) {
        Logger.info("[英灵装备]updateAttr", masterAttr, sonAttr)
        let attr_num: number = 0;//属性数量
        let level = this._goodsInfo.strengthenGrade;
        if (!this.qualityCfg) {
            this.qualityCfg = TempleteManager.Instance.getpetequipqualityData(this._goodsInfo.templateInfo.Profile);
        }
        if (this.qualityCfg) {
            this.isMax = level == this.qualityCfg.StrengMax;
        }

        if (masterAttr) {
            let tempArr = masterAttr.split(';');
            for (let i = 0; i < tempArr.length; i++) {
                const element = tempArr[i];
                if (element.length > 0) {
                    attr_num++;
                    let arr = element.split(':');
                    let attId = Number(arr[0]);
                    let cfg: t_s_attributeData = TempleteManager.Instance.getPetEquipAttri(attId);
                    if (cfg) {
                        let attrItem = this['item' + attr_num];
                        attrItem.getChild('txt_attr_key').text = cfg.AttributeNameLang;
                        attrItem.getChild('txt_attr_val').text = '+' + arr[1];
                        if (this.isMax) {
                            attrItem.getChild('txt_attr_val1').visible = false;
                            attrItem.getChild('img_arrow').visible = false;
                        } else {
                            attrItem.getChild('txt_attr_val1').text = '+' + Utils.toFixedNum(Number(arr[1]) + Number(arr[2]), 3);
                            attrItem.getChild('txt_attr_val1').visible = true;
                            attrItem.getChild('img_arrow').visible = true;
                        }
                        attrItem.getControllerAt(0).setSelectedIndex(1);
                        attrItem.getChild("nGroup").ensureBoundsCorrect();
                        attrItem.visible = true;
                        
                    }
                }
            }
        }

        //强化至下级是不是可以解锁
        let isUnlock: boolean = false;
        let isUnlockAll: boolean = false;
        let color = isUnlock ? '#ffdc57' : '#aaaaaa';
        if (this.qualityCfg) {
            //10,20,30,40
            let lvArr = this.qualityCfg.SonAttrOpen.split(',');
            isUnlockAll = level >= Number(lvArr[lvArr.length - 1]);
            if (sonAttr) {
                let tempArr = sonAttr.split(';');
                for (let i = 0; i < tempArr.length; i++) {
                    const element = tempArr[i];
                    if (element.length > 0) {
                        let bAttrChange = false;
                        if (this._sonAttrPre && (this._sonAttrPre)) {
                            let tempArrPre = this._sonAttrPre.split(';');
                            if (element != tempArrPre[i]) {
                                bAttrChange = true;
                            }
                        }

                        attr_num++;
                        let arr = element.split(':');
                        let attId = Number(arr[0]);
                        let cfg: t_s_attributeData = TempleteManager.Instance.getPetEquipAttri(attId);
                        if (cfg) {
                            let attrItem = this['item' + attr_num];
                            attrItem.visible = true;
                            attrItem.getChild('img_arrow_addition').visible = bAttrChange;
                            attrItem.getChild('txt_attr_key').text = cfg.AttributeNameLang;
                            attrItem.getChild('txt_attr_val').text = '+' + arr[1];
                            let val = parseInt(arr[1]) + parseInt(arr[2]);
                            attrItem.getChild('txt_attr_val1').text = '+' + Utils.toFixedNum(val, 3);
                            attrItem.getControllerAt(0).setSelectedIndex(1);
                            attrItem.getChild('txt_attr_key').color = '#ffecc6';
                            attrItem.getChild('txt_attr_val').color = '#ffecc6';
                            if (this.isMax) {
                                attrItem.getChild('txt_attr_val1').visible = false;
                                attrItem.getChild('img_arrow').visible = false;
                            } else {
                                if ((this._goodsInfo.strengthenGrade + 1) % PetData.PETEQUIP_SONATTR_RANDOM_UP == 0 && isUnlockAll) {
                                    attrItem.getChild('txt_attr_val1').visible = false;
                                    attrItem.getChild('img_arrow').visible = false;
                                }
                                else {
                                    attrItem.getChild('txt_attr_val1').visible = false;
                                    attrItem.getChild('img_arrow').visible = false;
                                }
                            }
                        }

						if (this._petequipattrDatas && this._petequipattrDatas.some((obj) => obj.AttributeId === attId)) {
							let petequipattrData: t_s_petequipattrData = this._petequipattrDatas.find((obj) => obj.AttributeId === attId);
							let baseAttribute = petequipattrData.BaseValue.toString().split(",");
							let lv = 0;
							if (Number(arr[1]) === Number(baseAttribute[0])) {
								lv = 0;
							} else {
								lv = (Number(arr[1]) - Number(baseAttribute[0])) / Number(baseAttribute[1]);
							}
							if (lv > 0) {
								let attributeItem = this["item" + attr_num];
								attributeItem.getChild("txt_attr_val1").visible = true;
								attributeItem.getChild("txt_attr_val1").text = "(" + LangManager.Instance.GetTranslation('mounts.command01',Utils.toFixedNum(lv, 3))+")";
							}
						}
                    }
                }

                this._sonAttrPre = sonAttr
            }

            for (let j = 0; j < lvArr.length; j++) {
                const lv = Number(lvArr[j]);
                if (lv > 0) {
                    isUnlock = level >= lv;
                    if (!isUnlock) {
                        attr_num++;
                        let item = this['item' + attr_num]
                        if(item){
                            let txt =this['item' + attr_num] .getChild('txt_lock').asTextField;
                            txt.color = color;
                            //强化至下级不可解锁属性, 文本提示调用灰色系统字显示, 内容为: 强化+{n}解锁
                            let str = LangManager.Instance.GetTranslation('petEuip.stren.lock', lv)
                            //强化至下级可解锁属性, 文本提示调用黄色系统字显示, 内容为: 强化成功解锁
                            this['item' + attr_num].visible = true;
                            // this['item'+attr_num].getChild('img_lock').visible = isUnlock;
                            txt.text = str;
                        }

                    }
                }
            }
        }

        if (this.isMax) {
            this.c1.setSelectedIndex(1);
            this.btn_stren.enabled = this.btn_stren1.enabled = false;
            this.t1.text = LangManager.Instance.GetTranslation('faterotary.LevelMax') + '!';
        }
    }

    private qualityCfg: t_s_petequipqualityData;

    private btn_strenClick() {
        //道具数量检测
        if (!this.cashCondition || !this.goldCondition) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('singlepass.bugle.SinglePassBugleView.NoLeftCount'));
            return;
        }
        this.btn_stren.enabled = this.btn_stren1.enabled = false;
        this._recvMsg = false;
        //播放特效过程中又点了强化, 停止原来正在播放的动画
        if (this.strenAni.playing) {
            this.strenAni.playing = false;
            this.showTxtTip();
        }

        //播放强化特效
        this.isPlaying = true;
        this.strenAni.visible = true;
        this.strenAni.playing = true;
        this.strenAni.setPlaySettings(0, -1, 1, -1, Laya.Handler.create(this, this.onAniEnd));
        let petId = this._goodsInfo.petData ? this._goodsInfo.petData.petId : this._goodsInfo.objectId;
        PetCtrl.reqPetEquipStren(petId, this._goodsInfo.bagType, this._goodsInfo.pos, false);
    }

    private showTxtTip() {
        if (!this._recvMsg) {//动画播放完成后 没收到强化结果 loading提示
            this.mc_loading.visible = true;
            return;
        }
        let loader = new fairygui.GLoader();
        let iconUrl = this.strenResult ? this.img_ok.content : this.img_fail.content;
        loader.content.texture = iconUrl.texture;
        this.contentPane.addChild(loader);
        if (this.strenResult) {
            loader.scaleX = loader.scaleY = 0.7;
            loader.y = 276;
        } else {
            loader.y = 290;
        }
        loader.x = 470 - (iconUrl.texture.width * loader.scaleX >> 1)
        Laya.Tween.to(loader, { y: 190 }, 500, Laya.Ease.backOut, Laya.Handler.create(this, this.hideTip, [loader]));
    }

    //强化特效播放结束
    private onAniEnd() {
        this.strenAni.playing = false;
        this.strenAni.visible = false;
        this.showTxtTip();
    }

    hideTip(loader: fairygui.GLoader) {
        loader.removeFromParent();
        this.btn_stren.enabled = this.btn_stren1.enabled = this.cashCondition && this.goldCondition && !this.isMax;
        this.isPlaying = false;
        // if(this.strenResult){
        //     let level = this._goodsInfo.strengthenGrade;
        //     let son_attr = this._goodsInfo.sonAttr;
        //     UIManager.Instance.ShowWind(EmWindow.PetEquipStrenOkWnd,{level:level,son_attr:son_attr,info:this._goodsInfo});
        // }
    }

    private helpBtnClick() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation('PetFrame.help08');
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private btn_stren1Click() {
        let petId = this._goodsInfo.petData ? this._goodsInfo.petData.petId : this._goodsInfo.objectId;
        PetCtrl.reqPetEquipStren(petId, this._goodsInfo.bagType, this._goodsInfo.pos, true);
    }


    OnHideWind() {
        this.strenAni.playing = false;
        ServerDataManager.cancel(S2CProtocol.U_C_ITEM_STRENGTHEN, this, this.__onIntensifyResult);
        super.OnHideWind();
    }
}