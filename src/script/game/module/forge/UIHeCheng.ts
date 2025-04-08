/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-07-10 14:42:23
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import AudioManager from "../../../core/audio/AudioManager";
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import UIButton from "../../../core/ui/UIButton";
import { t_s_composeData } from "../../config/t_s_compose";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { t_s_suitetemplateData } from "../../config/t_s_suitetemplate";
import { BagType } from "../../constant/BagDefine";
import { ConfigType } from "../../constant/ConfigDefine";
import GoodsSonType from "../../constant/GoodsSonType";
import { GoodsType } from "../../constant/GoodsType";
import { SoundIds } from "../../constant/SoundIds";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { ComposeGoodsInfo } from "../../datas/goods/ComposeGoodsInfo";
import ForgeCtrl from "./ForgeCtrl";
import ForgeData, { eForgeComposeTargetItemType } from "./ForgeData";
import { BaseItem } from "../../component/item/BaseItem";
import { MountsManager } from "../../manager/MountsManager";
import CommonUtils from '../../../core/utils/CommonUtils';
import ColorConstant from "../../constant/ColorConstant";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { PlayerManager } from "../../manager/PlayerManager";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";


export default class UIHeCheng extends BaseFguiCom {
    private tree: fgui.GTree;
    private materialList: fgui.GList
    private itemTips: fgui.GComponent
    private btnComp: UIButton;
    private btnCompAll: UIButton;
    private gCost: fgui.GGroup;
    private gCostAll: fgui.GGroup;
    private gtotal: fgui.GGroup;
    private btnTick: UIButton;
    private itemTarget: BaseItem;
    private txtName: fgui.GLabel;
    private txtJob: fgui.GLabel;
    private txtLevel: fgui.GLabel;
    private txtIntensifyLevel: fgui.GLabel;
    private txtCostAll: fgui.GLabel;
    private txtCost: fgui.GLabel;
    private txtHas: fgui.GLabel;
    private tempId: string;

    private _jewelGrade: number = 0;
    private _data: ComposeGoodsInfo;
    private _fTreeNodeList: fgui.GTreeNode[] = []
    private _sTreeNodeList: fgui.GTreeNode[] = []
    private tipItem1: BaseTipItem;
    private tipItem2: BaseTipItem;
    private tipItem3: BaseTipItem;
    constructor(comp: fgui.GComponent) {
        super(comp)

        // this.itemTarget.showBg(false)
        this.tree.on(fgui.Events.CLICK_ITEM, this, this.__clickTreeItem);
        this.tree.treeNodeRender = Laya.Handler.create(this, this.__renderTreeNode, null, false);

        this.btnComp.onClick(this, this.btnCompClick.bind(this))
        this.btnCompAll.onClick(this, this.btnCompAllClick.bind(this))
        this.btnTick.onClick(this, this.btnTickClick.bind(this))
        this.materialList.numItems = 4;
        this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
        this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
        this.tipItem3.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    }

    private changeIndex(index: number) {
        let type = this.model.getComposeTypeByTabIndex(index)
        if (!type) return

        this.model.composeType = type;
        this.model.getTreeDataByType(type)
        this.refreshTreeData()
        this.defaultView()
    }

    private refreshTreeData() {
        this.model.defComposeGoodInfo = null
        this._fTreeNodeList = []
        this._sTreeNodeList = []
        this.tree.rootNode.removeChildren()
        let bSuit = this.isSuit
        let bSSSuit = this.isSSSuit
        let defData: ComposeGoodsInfo = null
        let defSuitData: ComposeGoodsInfo = null
        let fDataList: ComposeGoodsInfo[] = bSuit ? this.model.composeSuitDic.getList() : this.model.composeDataList;
        Logger.xjy("[UIHeCheng]refreshTreeData fDataList", bSuit, fDataList)
        for (let index = 0; index < fDataList.length; index++) {
            let topNode: fgui.GTreeNode = new fgui.GTreeNode(true);
            topNode._resURL = bSuit ? fgui.UIPackage.getItemURL(EmPackName.Base, "TabTree2") : fgui.UIPackage.getItemURL(EmWindow.Forge, "TabMenu")
            topNode.data = fDataList[index];
            this.tree.rootNode.addChild(topNode);
            this._fTreeNodeList.push(topNode);

            if (bSuit) {
                let list = this.model.composeListDic.getList()
                let sDataList = list[index] as ComposeGoodsInfo[]
                Logger.xjy("[UIHeCheng]refreshTreeData sDataList", sDataList)
                if (sDataList.length > 0) {
                    for (let i: number = 0; i < sDataList.length; i++) {
                        let sNode: fgui.GTreeNode = new fgui.GTreeNode(false);
                        sNode._resURL = fgui.UIPackage.getItemURL(EmWindow.Forge, "TabMenu")
                        sNode.data = sDataList[i];
                        topNode.addChild(sNode);
                        this._sTreeNodeList.push(sNode)
                        // 先判断ss套装在判断套装
                        if (bSSSuit && this.model.defSEquipMetaId != 0) {
                            if (sDataList[i].template.Material1 == this.model.defSEquipMetaId) {
                                defSuitData = sDataList[i]
                                this.model.defSEquipMetaId = 0
                            }
                        } else if (bSuit && this.model.defEquipMetaId != 0) {
                            if (sDataList[i].template.Material1 == this.model.defEquipMetaId) {
                                defSuitData = sDataList[i]
                                this.model.defEquipMetaId = 0
                            }
                        }
                    }
                    if (!defSuitData) {
                        defSuitData = sDataList[0]
                    }
                }
            } else {
                if (this.model.defPropMetaId != 0) {
                    defData = fDataList[index]
                    this.model.defPropMetaId = 0
                }
            }
        }

        if (!bSuit && fDataList.length > 0) {
            this.model.defComposeGoodInfo = defData ? defData : fDataList[0]
        } else {
            this.model.defComposeGoodInfo = defSuitData
        }
    }

    refresh(tag: string, data: any, tabIndex?: number) {
        switch (tag) {
            case "BagItemUpdate":
                this.model.updateComposeGoodsCount()
                this.changeIndex(this.ctrl.view.curTabIndex)
                break;
            case "ChangeIndex":
                if (tabIndex) {
                    this.changeIndex(tabIndex)
                }
                break;
        }
    }

    refreshResources() {

    }

    private __clickTreeItem(itemObject: fgui.GObject) {
        let treeNode: fgui.GTreeNode = itemObject.treeNode;
        let cGoodInfo = treeNode.data as ComposeGoodsInfo

        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND)

        switch (cGoodInfo.cellType) {
            case eForgeComposeTargetItemType.SUIT_MENU_CELL:
            case eForgeComposeTargetItemType.EPIC_MENU_CELL:
                for (let index = 0; index < this._fTreeNodeList.length; index++) {
                    const element = this._fTreeNodeList[index];
                    if (element != treeNode) {
                        this.tree.collapseAll(element)
                    }
                }
                this.model.selectedCompose = null;
                break;
            case eForgeComposeTargetItemType.NORMAL_CELL:
                this.model.selectedCompose = cGoodInfo
                this.refreshRight(this.model.selectedCompose)
                break;
            case eForgeComposeTargetItemType.SUIT_CELL:
            case eForgeComposeTargetItemType.EPIC_CELL:
                this.model.selectedCompose = cGoodInfo
                this.refreshRight(this.model.selectedCompose)
                break;
            default:
                break;
        }
    }

    private __renderTreeNode(node: fgui.GTreeNode, obj: fgui.GComponent) {
        // Logger.log("[SelectCampaignWnd]__renderTreeNode", node.data)

        let cGoodsInfo = node.data as ComposeGoodsInfo

        let cellType = cGoodsInfo.cellType
        switch (cellType) {
            case eForgeComposeTargetItemType.EPIC_MENU_CELL:
            case eForgeComposeTargetItemType.SUIT_MENU_CELL:
                obj.text = this.model.getSuitName(cellType, node.data.groupId);
                break;
            case eForgeComposeTargetItemType.NORMAL_CELL:
            case eForgeComposeTargetItemType.SUIT_CELL:
            case eForgeComposeTargetItemType.EPIC_CELL:
                let info = new GoodsInfo();
                info.templateId = cGoodsInfo.itemTemplate.TemplateId;
                (obj.getChild("item") as BaseItem).info = info

                obj.text = cGoodsInfo.itemTemplate.TemplateNameLang;
                obj.getChild("title").asLabel.color = ForgeData.Colors[cGoodsInfo.itemTemplate.Profile - 1]
                let txtDesc = obj.getChild("txtDesc")
                txtDesc.visible = cGoodsInfo.canMakeCount > 0
                txtDesc.text = LangManager.Instance.GetTranslation("Forge.Compose.CanComposeCnt", cGoodsInfo.canMakeCount);

                // // 是否已经合成
                // let bBagHas = GoodsManager.Instance.getGoodsByGoodsTId(cGoodsInfo.template.NewMaterial)
                // // 是否已经激活
                // let bLight = MountsManager.Instance.avatarList.isLightTemplate(cGoodsInfo.itemTemplate.Property1)
                // //
                // let justOne = ForgeData.checkComposeOneMountCard(cGoodsInfo.template.NewMaterial)
                // //
                // if (justOne && cGoodsInfo.itemTemplate.SonType == GoodsSonType.SONTYPE_MOUNT_CARD) {
                //     if (!bBagHas && !bLight) {
                //         txtDesc.text = LangManager.Instance.GetTranslation("Forge.Compose.CanComposeCnt", 1);
                //     } else {
                //         txtDesc.visible = false;
                //     }
                // }
                break;
            default:
                break;
        }
    }

    private refreshRight(data: ComposeGoodsInfo) {
        this.resetView();
        this._data = data;
        // Logger.xjy("[UIHeCheng] refreshRight", this._data)
        if (this._data && this._data.template) {
            // let info = this.model.getCurrentUpgradeEquipGoodsInfo();
            let info = new GoodsInfo();
            info.templateId = this._data.template.NewMaterial;
            info.objectId = ArmyManager.Instance.thane.id;
            let equipList = ArmyManager.Instance.thane.getEquipList().getList()
            for (let index = 0; index < equipList.length; index++) {
                const goods = equipList[index] as GoodsInfo;
                if (goods.templateId == info.templateId) {
                    info.bagType = goods.bagType
                }
            }

            let temp = info.templateInfo as t_s_itemtemplateData
            this.itemTarget.info = info;
            this.txtName.text = temp.TemplateNameLang + this.model.getStrengthenGrade(info)
            this.txtName.color = ForgeData.Colors[temp.Profile - 1]
            this.txtIntensifyLevel.text = temp.StrengthenMax == 0 ? "" : LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.intensify", temp.StrengthenMax);
            this.txtJob.text = temp.jobName + " " + temp.sonTypeName;
            this.txtLevel.text = LangManager.Instance.GetTranslation("public.level4_space2", temp.NeedGrades);

            this.refreshMaterials();
            this.refreshItemTips(info, temp);
        }
    }

    private refreshMaterials() {
        if (!this._data) return;
        this.tempId = String(this._data.template.NewMaterial);
        this._jewelGrade = Number(this.tempId.substring(this.tempId.length - 2));

        for (let i: number = 0; i < this.materialList.numChildren; i++) {
            let ele = this.materialList.getChildAt(i) as BaseItem;
            let id = this._data.template["Material" + (i + 1)];
            let needCount = this._data.template["Count" + (i + 1)]
            let ownCount = this._data["ownCount" + (i + 1)]
            let goodInfo = new GoodsInfo()
            goodInfo.templateId = id;
            ele.info = id > 0 ? goodInfo : null;
            ele.visible = id > 0
            ele.text = id > 0 ? ownCount + "/" + needCount : "";
            ele.titleColor = ownCount >= needCount ? "#ffffff" : "#ff2e2e"

            // let itemTargetGInfo = this.itemTarget.info
            // if (itemTargetGInfo && itemTargetGInfo.isSeniorEquip) {
            //     let temp = goodInfo.templateInfo
            //     if(goodInfo.isSeniorEquipMaterial){
            //         goodInfo.strengthenGrade = temp.StrengthenMax;
            //         goodInfo.mouldGrade = ForgeData.COMPOSE_SENIOR_EQUIP_NEED_MOULD_GRADE;
            //     }
            // }
        }

        this.setBtnState()
        this.txtCost.text = (this._data.template.NeedGold * this.model.currentComposeCount).toString();
        this.txtCostAll.text = (this._data.template.NeedGold * this.model.maxComposeCount).toString();
        this.txtHas.text = ResourceManager.Instance.gold.count.toString();
        this.txtCostAll.color = CommonUtils.changeColor(this._data.template.NeedGold * this.model.maxComposeCount, ResourceManager.Instance.gold.count);
        this.txtCost.color = CommonUtils.changeColor(this._data.template.NeedGold * this.model.currentComposeCount, ResourceManager.Instance.gold.count);
    }

    private refreshItemTips(info: GoodsInfo, temp: t_s_itemtemplateData) {
        let tempStr = ""
        tempStr += this.initAttribute(info, temp);
        // tempStr += this.initInlay(info);
        // tempStr += this.initSkill(info, temp);
        tempStr += this.initSuit(info, temp);
        if (this.isSuit) {
            tempStr += this.initScore(info, temp);
        }

        if (tempStr == "") {
            // tempStr = "[color=#ffc68f]" + info.templateInfo.Description + "[/color]"
            tempStr = info.templateInfo.DescriptionLang;
        }

        this.itemTips.getChild('content').text = tempStr;
    }

    private defaultView() {
        this.resetView()
        let treeNodeList = this.isSuit ? this._sTreeNodeList : this._fTreeNodeList
        let treeNodeTmp
        let goodInfoTmp
        for (let index = 0; index < treeNodeList.length; index++) {
            const treeNode = treeNodeList[index];
            if (treeNode.data && this.model.selectedCompose && treeNode.data.templateId == this.model.selectedCompose.templateId) {
                goodInfoTmp = this.model.selectedCompose
                treeNodeTmp = treeNode
                break
            } else if (treeNode.data && this.model.defComposeGoodInfo && treeNode.data.templateId == this.model.defComposeGoodInfo.templateId) {
                goodInfoTmp = this.model.defComposeGoodInfo
                treeNodeTmp = treeNode
            }
        }

        if (treeNodeTmp) {
            this.model.selectedCompose = goodInfoTmp
            this.tree.selectNode(treeNodeTmp)
            this.refreshRight(goodInfoTmp)
            this.tree.scrollToView(this.tree.getChildIndex(treeNodeTmp._cell))
        }
    }

    private btnTickClick(thisObj: any) {
        this.btnTick.enabled = false;
        this.model.canCompose = !this.model.canCompose;
        this.changeIndex(this.ctrl.view.curTabIndex)
        Laya.timer.once(1000,this,function(){
            if(this.btnTick) this.btnTick.enabled = true;
        })
    }

    private btnCompClick(thisObj: any) {
        this.__compClick(false)
    }

    private btnCompAllClick(thisObj: any) {
        this.__compClick(true)
    }

    private __compClick(compAll: boolean) {
        let composeCnt = this.model.getComposeCount(compAll)
        if (this.model.selectedCompose.template.NeedMinLevel > ArmyManager.Instance.thane.grades) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Forge.NeedMinLevel", this.model.selectedCompose.template.NeedMinLevel));
            return;
        }
        if (ResourceManager.Instance.gold.count < composeCnt * this.model.selectedCompose.template.NeedGold) {
            let str: string = LangManager.Instance.GetTranslation("public.gold");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (this._data.template.Types == ForgeData.COMPOSE_TYPE_GEM || this._data.template.Types == ForgeData.COMPOSE_TYPE_CRYSTAL) {
            if (this._jewelGrade > ForgeData.JEWEL_LEVEL && ArmyManager.Instance.thane.grades < ForgeData.JEWEL_GRADE_LIMIT) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Forge.NeedLevel", ForgeData.JEWEL_GRADE_LIMIT));
                return;
            }
        }

        // TODO by jeremy.xu 这个先不要了, 改成材料不足合成按钮不可点
        // if (this._data.template.Types == ForgeData.COMPOSE_TYPE_GEM) {
        //     let obj: any = this.needCountGem(composeCnt);
        //     if (obj) {
        //         let discount: number = ShopManager.Instance.getDiscountIntimeBuy(obj.needId);
        //         let price: number = obj.point * discount;
        //         let content: string = LangManager.Instance.GetTranslation("store.view.compose.ComposeMatetialView.sendComposeTip", obj.point, obj.count, obj.name);
        //         if (discount < 1) {
        //             content += LangManager.Instance.GetTranslation("store.view.compose.ComposeMatetialView.sendComposeTip02", Number(obj.point - price));
        //         }
        //         SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { "price": price, "compAll": compAll }, null, content, null, null, this.__compClickBack.bind(this));
        //         return;
        //     }
        // } else if (this._data.template.Types == ForgeData.COMPOSE_TYPE_CRYSTALNEW) {
        //     let obj: any = this.needCountCrystal(composeCnt);
        //     if (obj) {
        //         let discount: number = ShopManager.Instance.getDiscountIntimeBuy(obj.needId);
        //         let price: number = obj.point * discount;
        //         let content: string = LangManager.Instance.GetTranslation("store.view.compose.ComposeMatetialView.sendCrystalTip", obj.point, obj.count, obj.name);
        //         if (discount < 1) {
        //             content += LangManager.Instance.GetTranslation("store.view.compose.ComposeMatetialView.sendCrystalTip02", Number(obj.point - obj.point * discount));
        //         }
        //         SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { "price": price, "compAll": compAll }, null, content, null, null, this.__compClickBack.bind(this));
        //         return;
        //     }
        // }

        let temp: t_s_composeData = this.model.selectedCompose.template;
        let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, temp.NewMaterial);
        let c1: number = this._data.template.Count1 * composeCnt;
        let p1: number = this.getCount(this._data.template.Material1);
        let c2: number = this._data.template.Count2 * composeCnt;
        let p2: number = GoodsManager.Instance.getGoodsNumByTempIdAndNotLock(this._data.template.Material2);
        let c3: number = this._data.template.Count3 * composeCnt;
        let p3: number = GoodsManager.Instance.getGoodsNumByTempIdAndNotLock(this._data.template.Material3);
        let c4: number = this._data.template.Count4 * composeCnt;
        let p4: number = GoodsManager.Instance.getGoodsNumByTempIdAndNotLock(this._data.template.Material4);
        if (c1 > p1 || c2 > p2 || c3 > p3 || c4 > p4) {
            if (goods.SonType != GoodsSonType.SONTYPE_MOUNT && goods.SonType != GoodsSonType.RESIST_GEM) {
                let str = LangManager.Instance.GetTranslation("store.view.compose.ComposeMatetialView.sendComposeTip04");
                MessageTipManager.Instance.show(str);
                return;
            }
        }

        // Property2 时效
        // if (goods.SonType == GoodsSonType.SONTYPE_MOUNT_CARD && goods.Property2 < 0) {
        //     // 坐骑是否为激活状态
        //     if (MountsManager.Instance.avatarList.isLightTemplate(goods.Property1)) {
        //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("shop.view.frame.BuyFrameI.mopupexitst02"));
        //         this.btnComp.enabled = true;
        //         return;
        //     }
        // }
        if (this.itemTarget.info.templateInfo.MasterType == GoodsType.EQUIP) {
            let count = GoodsManager.Instance.getGoodsNumByTempId(this.itemTarget.info.templateInfo.TemplateId);//背包里有没有
            let count1 = GoodsManager.Instance.getBagCountByTempId(BagType.HeroEquipment, this.itemTarget.info.templateInfo.TemplateId);
            if (count > 0 || count1 > 0) {
                //玩家当前是否拥有该装备, 若无该装备直接合成 合成提示, 已经拥有该物品, 是否继续合成？ 
                var str: string = LangManager.Instance.GetTranslation("compose.tipMsg");
                var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
                var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
                var prompt: string = LangManager.Instance.GetTranslation("compose.tipTitle");
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, str, confirm, cancel, this.alertBack.bind(this));
                return;
            }
        }
        this.sendCompose(compAll, false);
    }

    /**普通确认回调 */
    private alertBack(b: boolean, flag: boolean) {
        if (b) {
            this.sendCompose(false, false);
        }

    }

    private __compClickBack(b: boolean, check: boolean, data: any) {
        if (!b) return

        this.sendCompose(data && data.compAll, check);
    }

    public getCount(tempId: number): number {
        let num: number = 0;
        num += GoodsManager.Instance.getGoodsNumByIdAndNotLockInEquipBag(tempId);
        return num;
    }

    /**
     * 计算需要花费多少钻石购买几级的宝石
     */
    private needCountGem(value: number = 1): Object {
        let count: number = value;

        let material: number = this._data.template.Material1;
        let peterTemId: number = this._data.template.NewMaterial;
        let bagCount: number = GoodsManager.Instance.getGoodsNumByTempIdAndNotLock(material);
        let tempCount: number = this._data.template.Count1 * count;

        for (let i: number = 0; i < 11; i++) {
            if (bagCount < tempCount) {
                let composeTemInfo: t_s_composeData = TempleteManager.Instance.getComposeTempleteByTempleteId(material);
                if (composeTemInfo) {
                    material = composeTemInfo.Material1;
                    count = tempCount - bagCount;
                    peterTemId = composeTemInfo.NewMaterial;
                    bagCount = GoodsManager.Instance.getGoodsNumByTempIdAndNotLock(material);
                    tempCount = composeTemInfo.Count1 * count;
                }
                else {
                    let shopInfo: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(peterTemId);
                    let canComposeInfo: t_s_composeData = TempleteManager.Instance.getComposeTempleteByTempleteId(peterTemId);
                    if (!canComposeInfo || !shopInfo) return null;
                    let canCount: number = bagCount / canComposeInfo.Count1;
                    count = count - canCount;
                    let obj: Object = { point: shopInfo.price * count, count: count, name: ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, peterTemId).TemplateName, needId: peterTemId };
                    return obj;
                }
            }
            else {
                return null;
            }
        }
        return null;
    }

    private needCountCrystal(value: number = 1): Object {
        let count: number = value;

        let material: number = this._data.template.Material1;
        let peterTemId: number = this._data.template.NewMaterial;
        let bagCount: number = GoodsManager.Instance.getGoodsNumByTempIdAndNotLock(material);
        let tempCount: number = this._data.template.Count1 * count;

        for (let i: number = 0; i < 11; i++) {
            if (bagCount < tempCount) {
                let composeTemInfo: t_s_composeData = TempleteManager.Instance.getCrystalTempleteByTempleteId(material);
                if (composeTemInfo) {
                    material = composeTemInfo.Material1;
                    count = tempCount - bagCount;
                    peterTemId = composeTemInfo.NewMaterial;
                    bagCount = GoodsManager.Instance.getGoodsNumByTempIdAndNotLock(material);
                    tempCount = composeTemInfo.Count1 * count;
                }
                else {
                    let shopInfo: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(peterTemId);
                    let canComposeInfo: t_s_composeData = TempleteManager.Instance.getCrystalTempleteByTempleteId(peterTemId);
                    if (!canComposeInfo || !shopInfo) return null;
                    let canCount: number = bagCount / canComposeInfo.Count1;
                    count = count - canCount;
                    let obj: Object = { point: shopInfo.price * count, count: count, name: ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, peterTemId).TemplateName, needId: peterTemId };
                    return obj;
                }
            }
            else {
                return null;
            }
        }
        return null;
    }

    private sendCompose(compAll: boolean, useBind: boolean) {
        this.ctrl.useBind = useBind;
        this.ctrl.sendCompose(compAll, useBind);
    }

    public resetTarget() { }

    public resetView() {
        this.itemTarget.info = null;
        this.txtName.text = "";
        this.txtIntensifyLevel.text = "";
        this.txtJob.text = "";
        this.txtLevel.text = "";
        this.txtCost.text = "--";
        this.txtCostAll.text = "--";
        this.txtCost.color = this.txtCostAll.color = ColorConstant.LIGHT_TEXT_COLOR;
        this.txtHas.text = "--";
        this.itemTips.getChild('content').text = "";
        this.setBtnState();
        this._data = null
        for (let i: number = 0; i < this.materialList.numChildren; i++) {
            let ele = this.materialList.getChildAt(i) as BaseItem;
            ele.info = null;
        }
    }

    private checkMountCardCompose() {
        let selectedCompose = this.model.selectedCompose
        if (this.model.composeType == ForgeData.COMPOSE_TYPE_PROP && selectedCompose && selectedCompose.itemTemplate) {
            if (selectedCompose.itemTemplate.SonType == GoodsSonType.SONTYPE_MOUNT_CARD) {
                // selectedCompose.itemTemplate // 坐骑卡
                if (ForgeData.ComposeOne.indexOf(selectedCompose.templateId) != -1) {
                    this.gCostAll.visible = false;
                }
                // 是否具有时效
                let bValidDate = selectedCompose.itemTemplate.Property2 > 0
                // 是否已经合成
                let bBagHas = GoodsManager.Instance.getGoodsByGoodsTId(selectedCompose.template.NewMaterial)
                // 是否已经激活
                let bLight = MountsManager.Instance.avatarList.isLightTemplate(selectedCompose.itemTemplate.Property1)

                // 是否mountTemp 中配置为不可炼化
                // let bNotLianhua = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_mounttemplate, selectedCompose.itemTemplate.Property1).StarItem == 0 
                // if ((bNotLianhua) && !bValidDate) {
                //     this.gCostAll.visible = false;
                // }
            }
        }
    }

    private setBtnState() {
        if (!this.model.selectedCompose || !this._data || this.model.selectedCompose.canMakeCount == 0) {
            this.btnComp.enabled = false;
            this.gCostAll.visible = false
        }
        else {
            this.btnComp.enabled = true;
            this.gCostAll.visible = true;

            // let selectedCompose = this.model.selectedCompose
            // if (this.model.composeType == ForgeData.COMPOSE_TYPE_PROP && selectedCompose && selectedCompose.itemTemplate) {
            //     if (selectedCompose.itemTemplate.SonType == GoodsSonType.SONTYPE_MOUNT_CARD) {
            //         if (ForgeData.checkComposeOneMountCard(selectedCompose.template.NewMaterial)) {
            //             this.gCostAll.visible = false;
            //         }
            //     }
            // }
        }

        if (this.isSuit || this.model.maxComposeCount <= 1) {
            this.gCostAll.visible = false
        }

        if (this.gCostAll.visible) {
            this.gCostAll.x = 560
            this.gCost.x = 800;
        } else {
            this.gCost.x = 690;
        }
    }

    private get isSuit() {
        return this.model.composeType == ForgeData.COMPOSE_TYPE_EQUIP || this.model.composeType == ForgeData.COMPOSE_TYPE_UPGRADE_EQUIP || this.model.composeType == ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP
    }

    private get isSSSuit() {
        return this.model.composeType == ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP
    }

    public get ctrl(): ForgeCtrl {
        let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl
        return ctrl
    }

    private get model(): ForgeData {
        return this.ctrl.data;
    }

    ///////////////////tips////////////////////
    private initAttribute(info: GoodsInfo, temp: t_s_itemtemplateData): string {
        let tempStr = ""
        let str: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Power, this.getAdd(temp.Power, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Agility, this.getAdd(temp.Agility, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Intellect, this.getAdd(temp.Intellect, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Physique, this.getAdd(temp.Physique, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Captain, this.getAdd(temp.Captain, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.ForceHit, this.getAdd(temp.ForceHit, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Live, this.getAdd(temp.Live, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Attack, this.getAdd(temp.Attack, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Defence, this.getAdd(temp.Defence, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.MagicAttack, this.getAdd(temp.MagicAttack, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.MagicDefence, this.getAdd(temp.MagicDefence, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip17") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Conat, this.getAdd(temp.Conat, info));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19") + "&nbsp;";
        tempStr += this.updateAttributeTxt(str, temp.Parry, this.getAdd(temp.Parry, info));

        return tempStr
    }

    private updateAttributeTxt(property: string, value: number, addValue: number): string {
        if (value > 0) {
            let tempStr = "[color=#ffc68f]" + property + "[/color]"
            tempStr += "[color=#ffecc6]" + value + "[/color]"
            if (addValue > 0) {
                tempStr += "+" + addValue
            }
            return tempStr + "<br>"
        }
        return ""
    }
    // 随机技能？
    private initSkill(info: GoodsInfo, temp: t_s_itemtemplateData): string {
        let tempStr: string = "";
        let skillString: string = "";
        let hasSkill: boolean = false;
        for (let i: number = 1; i < 6; i++) {
            skillString += info["randomSkill" + i] + ",";
            if (info["randomSkill" + i] != 0)
                hasSkill = true;
        }
        if (hasSkill == false) {
            skillString = info.templateInfo.DefaultSkill;
        }
        if (info.templateInfo.MasterType == GoodsType.HONER) {
            tempStr += LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip23") + ' ' + info.templateInfo.Strength + "<br>";
            tempStr += LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip24") + ' ' + info.templateInfo.Tenacity + "<br>";
        }
        let skillList: t_s_skilltemplateData[] = TempleteManager.Instance.getSkillTemplateInfoByIds(skillString);
        let skillTemp: t_s_skilltemplateData;

        if (ForgeData.isFashion(info)) {
            for (let i = 0; i < skillList.length; i++) {
                skillTemp = skillList[i] as t_s_skilltemplateData;
                if (!skillTemp) continue;
                tempStr += skillTemp.SkillTemplateName + "<br>";
            }
        } else {
            for (let i = 0; i < skillList.length; i++) {
                skillTemp = skillList[i] as t_s_skilltemplateData;
                if (!skillTemp) continue;
                let star: string = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.star", skillTemp.Grades);
                star = LangManager.Instance.GetTranslation("public.parentheses1", star);
                tempStr += skillTemp.SkillTemplateName + " " + star + "<br>";
            }
        }

        if (info.id == 0 && info.templateInfo.RandomSkillCount != 0) {
            tempStr += "<" + LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.RandomSkillCount", info.templateInfo.RandomSkillCount) + ">\n";
        }
        if (tempStr) {
            tempStr = tempStr.substr(0, tempStr.length - 1);
        }

        return tempStr
    }

    private initSuit(info: GoodsInfo, temp: t_s_itemtemplateData) {
        let tempStr: string = "";
        let skillStr: string = "";
        let suitTemp: t_s_suitetemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_suitetemplate, temp.SuiteId);
        if (suitTemp) {
            let bEpicEquip = this.model.composeType == ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP
            let heroId: number = info.objectId;
            let baseHero = ArmyManager.Instance.thane;
            let current: number = 0;
            let suitCount: number = suitTemp.suitCount;
            if (baseHero.id == heroId) {
                let list: GoodsInfo[] = [];
                if (info.bagType == BagType.HeroEquipment)
                    list = GoodsManager.Instance.getHeroEquipListById(heroId).getList();
                else if (info.bagType == BagType.Honer)
                    list = GoodsManager.Instance.getHeroHonorListById(heroId).getList();
                current = suitTemp.existCount(list);
            } else {
                current = info.suitCount;
            }

            let ownCount = current > 0 ? current : 0
            let color = ownCount > 0 ? "[color=#39a82d]" : "[color=#ffc68f]"
            let title = "[color=#ffc68f]" + suitTemp.TemplateNameLang + " (" + "[/color]" + color + ownCount + "[/color]" + "[color=#ffc68f]/" + suitCount + ")[/color]";
            if (suitCount > 1) {
                tempStr += title + "<br>";
            }
            for (let k: number = 1; k < 9; k++) {
                //每套最大8件套装单件
                let suitGood: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, suitTemp["Template" + k]);
                let info: GoodsInfo = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(heroId, suitTemp["Template" + k]);
                if (!info)
                    info = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(heroId, suitTemp["Template" + k + "S"]);
                if (suitGood) {
                    if (suitCount > 1) {
                        color = info && current > 0 ? "[color=#39a82d]" : "[color=#aaaaaa]"
                        tempStr += "<font style='fontSize:18'>" + color + suitGood.TemplateNameLang + "[/color]" + "</font>" + "<br>";
                    }
                    //property 1-8为集齐对应套装数量的技能
                    skillStr += suitTemp["Property" + k] + ",";
                }
            }
            tempStr += this.initSuitSkill(suitCount, skillStr, current);
        }
        return tempStr
    }

    //套装技能
    private initSuitSkill(suitCount: number, skillIds: string, current: number): string {
        let tempStr = ""
        let skillList: t_s_skilltemplateData[] = TempleteManager.Instance.getSkillTemplateInfoByIds(skillIds);
        for (let count: number = 0; count < skillList.length; count++) {
            let skillTemp = skillList[count];
            if (skillTemp) {
                tempStr += (suitCount <= 1 || count < current) ? "[color=#39a82d]" : "[color=#aaaaaa]"
                if (suitCount > 1)
                    tempStr += "(" + (count + 1) + ")" + skillTemp.SkillTemplateName;
                else
                    tempStr += skillTemp.SkillTemplateName;
            }
            tempStr += "[/color]<br>"
        }
        return tempStr
    }

    private initScore(info: GoodsInfo, temp: t_s_itemtemplateData) {
        let num = info.getEquipBaseScore();
        let additionScore = info.getEquipAdditionScore();
        let scoreStr: string
        if (additionScore > 0) {
            scoreStr = num + " (+" + additionScore + ")"
        } else {
            scoreStr = num + "";
        }

        let tempStr = "[color=#ffc68f]" + LangManager.Instance.GetTranslation("fighting.FightingEquipAndGemFrame.title.text01") + "[/color]&nbsp;"
        tempStr += "[color=#ffecc6]" + scoreStr + "[/color]"

        return tempStr;
    }

    private getAdd(preValue: number, gInfo: GoodsInfo): number {
        return Math.floor(preValue * gInfo.strengthenGrade * 0.1) + gInfo.strengthenGrade * 5;
    }

    public dispose(destred = true) {
        this.tree.off(fgui.Events.CLICK_ITEM, this, this.__clickTreeItem);
        this.tree.treeNodeRender.recover();
        this.tree.treeNodeRender = null;
        this.btnComp.offClick(this, this.btnCompClick.bind(this))
        this.btnCompAll.offClick(this, this.btnCompAllClick.bind(this))
        this.btnTick.offClick(this, this.btnTickClick.bind(this))
        PlayerManager.Instance.currentPlayerModel.forgeHeChengIsOpen = false;
        super.dispose(destred);
    }
}