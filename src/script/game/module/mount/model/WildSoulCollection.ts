import GameEventDispatcher from '../../../../core/event/GameEventDispatcher';
import { MountsEvent } from '../../../constant/event/NotificationEvent';
import { TempleteManager } from '../../../manager/TempleteManager';
import { MountType } from './MountType';
import { WildSoulInfo } from './WildSoulInfo';
import { t_s_mounttemplateData } from '../../../config/t_s_mounttemplate';
import { t_s_itemtemplateData } from '../../../config/t_s_itemtemplate';
import { GoodsInfo } from '../../../datas/goods/GoodsInfo';
import { GoodsManager } from '../../../manager/GoodsManager';
import { MountsManager } from '../../../manager/MountsManager';
/**
 *  
 * 兽魂数据
 * 
 */
export class WildSoulCollection extends GameEventDispatcher {
    public static PAGE_SIZE: number = 8;

    private _currentIndex: number = 1;
    /**  所有当前激活的坐骑模板 */
    private _data: { [key: number]: WildSoulInfo };
    /**  所有普通坐骑模板 */
    private static _normalMountTemplateList: t_s_mounttemplateData[];
    /**  所有特殊坐骑模板 */
    private static _magicMountTemplateList: t_s_mounttemplateData[];
    /**  所有温顺坐骑模板 */
    private static _docileMountTemplateList: t_s_mounttemplateData[];
    /**  所有猛兽坐骑模板 */
    private static _beastMountTemplateList: t_s_mounttemplateData[];
    /**  所有科技坐骑模板 */
    private static _technologyMountTemplateList: t_s_mounttemplateData[];
    /**  所有VIP坐骑模板 */
    private static _vipMountTemplateList: t_s_mounttemplateData[];
    /**按**/
    private sortMount(info1: t_s_mounttemplateData, info2: t_s_mounttemplateData): number {
        return info2.SoulScore - info1.SoulScore;
    }

    private sortMount2(info1: t_s_mounttemplateData, info2: t_s_mounttemplateData): number {

        if (info1.MountType == MountType.BEAST) {
            return -1;
        } else if (info2.MountType == MountType.BEAST) {
            return 1;
        } else {
            if (info1.Sort < info2.Sort) {
                return -1;
            } else if (info1.Sort > info2.Sort) {
                return 1;
            } else {
                if (info1.TemplateId < info2.TemplateId) {
                    return -1;
                }
                else if (info1.TemplateId > info2.TemplateId) {
                    return 1;
                }
            }
        }
        return 0;
    }

    constructor() {
        super();
        WildSoulCollection._normalMountTemplateList = [];
        WildSoulCollection._magicMountTemplateList = [];
        WildSoulCollection._beastMountTemplateList = [];
        WildSoulCollection._docileMountTemplateList = [];
        WildSoulCollection._technologyMountTemplateList = [];
        WildSoulCollection._vipMountTemplateList = [];

        let mountsList = TempleteManager.Instance.getMountsByType(MountType.NORMAL);
        WildSoulCollection._normalMountTemplateList = mountsList;

        mountsList = TempleteManager.Instance.getMountsByType(MountType.MAGIC);
        WildSoulCollection._magicMountTemplateList = mountsList;

        mountsList = TempleteManager.Instance.getMountsByType(MountType.BEAST);
        WildSoulCollection._beastMountTemplateList = mountsList;

        mountsList = TempleteManager.Instance.getMountsByType(MountType.DOCILE);
        WildSoulCollection._docileMountTemplateList = mountsList;

        mountsList = TempleteManager.Instance.getMountsByType(MountType.TECHNOLOGY);
        WildSoulCollection._technologyMountTemplateList = mountsList;

        mountsList = TempleteManager.Instance.getMountsByType(MountType.VIP);
        WildSoulCollection._vipMountTemplateList = mountsList;

        WildSoulCollection._normalMountTemplateList.sort(this.sortMount2);
        WildSoulCollection._magicMountTemplateList.sort(this.sortMount);
        WildSoulCollection._beastMountTemplateList.sort(this.sortMount);
        WildSoulCollection._docileMountTemplateList.sort(this.sortMount);
        WildSoulCollection._technologyMountTemplateList.sort(this.sortMount);
        WildSoulCollection._vipMountTemplateList.sort(this.sortMount);
        this._data = {};
        this._currentIndex = 1;
        this._currentType = MountType.NORMAL;
    }
    /**
     * 添加兽魂信息到已激活列表 
     * @param item 兽魂信息
     * 
     */
    public addWildSoul(item: WildSoulInfo) {
        this._data[item.templateId] = item;

        let temp: t_s_mounttemplateData = item.template;
        if (temp && temp.MountType == MountType.DOCILE) {
            this.putHideMountToSpecialList(temp);
        }
    }

    //TODO 添加至已激活列表 不是魔幻列表
    private putHideMountToSpecialList(temp: t_s_mounttemplateData) {
        // if (temp.MountType != MountType.DOCILE) return;
        // var has: boolean = this.specialMountListHasTemplate(temp.TemplateId);
        // if (!has) {
        //     WildSoulCollection._magicMountTemplateList.push(temp);
        //     WildSoulCollection._magicMountTemplateList.sort(this.sortMount);
        // }
    }

    private specialMountListHasTemplate(id: number): boolean {
        var find: boolean = false;
        for (let i: number = 0; i < WildSoulCollection._magicMountTemplateList.length; i++) {
            let temp: t_s_mounttemplateData = WildSoulCollection._magicMountTemplateList[i];
            if (temp && temp.TemplateId == id) {
                find = true;
                break;
            }
        }
        return find;
    }

    /**
     * 清空当前已激活兽魂列表 
     * 
     */
    public clear() {
        this._data = {};
    }

    /**
     * 重置当前标签为普通和当前页 
     * 
     */
    public reset() {
        this.currentType = MountType.NORMAL;
        this.currentIndex = 1;
    }
    /**
     * 得到总页数 
     * @return 
     * 
     */
    public get totalPage(): number {
        return Math.max(Math.ceil(this.mountTemplates.length / WildSoulCollection.PAGE_SIZE), 1);
    }

    /**
     * 当前已激活列表发生变化时 派发 
     * 
     */
    public dispatchChangeEvent() {
        this.dispatchEvent(MountsEvent.MOUNT_LIST_CHANGE, this);
    }

    public get currentIndex(): number {
        return this._currentIndex;
    }

    /**
     * 翻页 <br/>
     * 派发MountsEvent.PAGE_INDEX_CHANGE事件
     * @param value
     * 
     */
    public set currentIndex(value: number) {
        if (value > this.totalPage) return;
        this._currentIndex = value;
        this.dispatchEvent(MountsEvent.PAGE_INDEX_CHANGE, this.pageData);
    }
    /**
     * 当前页对应的数据 
     * @return 
     * 
     */
    public get pageData() {
        var startIndex: number = (this._currentIndex - 1) * WildSoulCollection.PAGE_SIZE;
        var endIndex: number = this.mountTemplates.length;
        if (startIndex + WildSoulCollection.PAGE_SIZE < endIndex) {
            endIndex = startIndex + WildSoulCollection.PAGE_SIZE;
        }
        return this.mountTemplates.slice(startIndex, endIndex);
    }

    private _currentType: number = 0;
    public get currentType(): number { return this._currentType; }
    /** 当前类型 */
    public set currentType(value: number) {
        if (this._currentType == value) return;
        this._currentType = value;
        this.currentIndex = 1;
    }
    /**
     * 根据当前类型返回普通或特殊的所有数据 
     * @return 
     * 
     */
    private get mountTemplates() {
        if (this._currentType == MountType.NORMAL) {
            return WildSoulCollection._normalMountTemplateList;
        } else if (this._currentType == MountType.MAGIC) {
            return WildSoulCollection._magicMountTemplateList;
        } else if (this._currentType == MountType.DOCILE) {
            return WildSoulCollection._docileMountTemplateList;
        } else if (this._currentType == MountType.BEAST) {
            return WildSoulCollection._beastMountTemplateList;
        } else if (this._currentType == MountType.TECHNOLOGY) {
            return WildSoulCollection._technologyMountTemplateList;
        } else if (this._currentType == MountType.VIP) {
            return WildSoulCollection._vipMountTemplateList;
        } else {
            return [];
        }
    }

    //过滤显示
    public getMountTemplatesByType(type: number): t_s_mounttemplateData[] {
        let dataArray: t_s_mounttemplateData[] = [];
        let tempData: t_s_mounttemplateData[] = [];
        if (type == MountType.NORMAL) {
            tempData = WildSoulCollection._normalMountTemplateList;
        } else if (type == MountType.MAGIC) {
            tempData = WildSoulCollection._magicMountTemplateList;
        } else if (type == MountType.DOCILE) {
            tempData = WildSoulCollection._docileMountTemplateList;
        } else if (type == MountType.BEAST) {
            tempData = WildSoulCollection._beastMountTemplateList;
        } else if (type == MountType.TECHNOLOGY) {
            tempData = WildSoulCollection._technologyMountTemplateList;
        } else if (type == 5) {
            tempData = WildSoulCollection._vipMountTemplateList;
        } else {
            tempData = [];
        }
        let count = tempData.length;
        let element: t_s_mounttemplateData = null;
        let isActive = false;


        let canActives: t_s_mounttemplateData[] = [];
        let activeeds: t_s_mounttemplateData[] = [];
        for (let index = 0; index < count; index++) {
            element = tempData[index];
            isActive = element.Activation == 1 ? this.isLightTemplate(element.TemplateId) : true;
            if (isActive) {
                if (this.canActive(element)) {
                    canActives.push(element);
                    continue;
                }
                if (this.isLightTemplate(element.TemplateId)) {
                    activeeds.push(element);
                    continue;
                }
                dataArray.push(element);
            }

        }
        dataArray.unshift(...activeeds);
        dataArray.unshift(...canActives);
        return dataArray
    }


    /**
     * 坐骑是否为激活状态 
     * @param tempId 坐骑的模板id
     * @return 
     * 
     */
    public isLightTemplate(tempId: number): boolean {
        return this._data[tempId] != null;
    }

    /**
     * 获得坐骑信息 如果坐骑没激活返回null 
     * @param tempId 坐骑的模板id
     * @return 
     * 
     */
    public getWildSoulInfo(tempId: number): WildSoulInfo {
        return this._data[tempId];
    }

    public clearHideMountFramSpecialList() {
        let tempArr: t_s_mounttemplateData[] = [];
        for (let i: number = 0; i < WildSoulCollection._magicMountTemplateList.length; i++) {
            let temp: t_s_mounttemplateData = WildSoulCollection._magicMountTemplateList[i];

            if (temp && temp.MountType == MountType.MAGIC) {
                tempArr.push(temp);
            } else if (temp && temp.MountType == MountType.BEAST) {
                tempArr.push(temp);
            }
        }
        WildSoulCollection._magicMountTemplateList = tempArr;
    }

    public canActive(v: t_s_mounttemplateData) {
        //已经激活
        if (this.isLightTemplate(v.TemplateId)) {
            return false;
        }

        let goodTemplate: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(v.NeedItemId);
        if (goodTemplate) {
            //去背包中找解锁的物品
            let find: Array<GoodsInfo> = GoodsManager.Instance.getBagGoodsByTemplateId(goodTemplate.TemplateId);
            if (find && find.length > 0) {
                return true;
            }
        }
        return false;
    }

    public canLianHua(vData:t_s_mounttemplateData){
        let flag2: boolean = false;
        let flag1: boolean = GoodsManager.Instance.getGoodsNumByTempId(vData.StarItem) > 0 ? true : false;
        var info: WildSoulInfo = MountsManager.Instance.avatarList.getWildSoulInfo(vData.TemplateId);
        if(info){
            flag2 = info.starLevel < MountsManager.Instance.maxStarGrade;
        }
        return this.isLightTemplate(vData.TemplateId) && flag1 && flag2;
    }

    public checkRedPoint() {
        let allList: t_s_mounttemplateData[][] = [
            WildSoulCollection._normalMountTemplateList,
            WildSoulCollection._magicMountTemplateList,
            WildSoulCollection._docileMountTemplateList,
            WildSoulCollection._beastMountTemplateList,
            WildSoulCollection._technologyMountTemplateList,
            WildSoulCollection._vipMountTemplateList,
        ]

        for (let list of allList) {
            if (this.checkAcitive(list)) return true;
        }

        return false;

    }

    public checkRedPointByIndex(index: number) {
        let allList: t_s_mounttemplateData[][] = [
            WildSoulCollection._normalMountTemplateList,
            WildSoulCollection._magicMountTemplateList,
            WildSoulCollection._docileMountTemplateList,
            WildSoulCollection._beastMountTemplateList,
            WildSoulCollection._technologyMountTemplateList,
            WildSoulCollection._vipMountTemplateList,
        ]
        return this.checkAcitive(allList[index]);
    }

    private checkAcitive(list: t_s_mounttemplateData[]) {
        for (let item of list) {
            if (this.canActive(item) ||this.canLianHua(item)) {
                return true;
            }
        }
        return false;
    }

}