// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import { ArrayConstant, ArrayUtils } from '../../../core/utils/ArrayUtils';
import StringHelper from '../../../core/utils/StringHelper';
import { t_s_pawntemplateData } from '../../config/t_s_pawntemplate';
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import { ArmyManager } from '../../manager/ArmyManager';
import { TempleteManager } from '../../manager/TempleteManager';
import BuildingManager from './BuildingManager';
import BuildingType from './consant/BuildingType';
import { BuildInfo } from './data/BuildInfo';
import { MasterTypes } from './data/MasterTypes';
import { BuildingEvent } from './event/BuildingEvent';
import { SimpleDictionary } from '../../../core/utils/SimpleDictionary';
import QueueItem from '../../module/home/QueueItem';
import { t_s_buildingtemplateData } from '../../config/t_s_buildingtemplate';
import { ConfigManager } from "../../manager/ConfigManager";
import ConfigMgr from "../../../core/config/ConfigMgr";
import t_s_config, { t_s_configData } from "../../config/t_s_config";
import { ConfigType } from "../../constant/ConfigDefine";
import { FieldData } from './data/FieldData';
/**
     * 建筑模型
     * 
     */
export default class BuildingModel extends Laya.EventDispatcher {
    public buildOrderCount: number = 0;
    public buildOrderTotal: number = 0;
    public buildOrderLimit: number = 2;

    public tecOrderCount: number = 0;
    public tecOrderTotal: number = 1;
    public tecOrderLimit: number = 1;

    public alchemyOrderCount: number = 0;
    public alchemyTotal: number = 1;
    private _buildingDicByID: SimpleDictionary;
    /**
     * 建筑队列
     */
    private _buildOrderList: Array<BuildingOrderInfo>;
    /**
     * 科技队列
     */
    private _tecOrderList: Array<BuildingOrderInfo>;
    /**
     * 挑战队列
     */
    private _colosseumOrderList: Array<BuildingOrderInfo>;
    /**
     * 征收队列
     */
    private _alchemyOrderList: Array<BuildingOrderInfo>;
    public _resUrlNameMap: Map<string, boolean>;
    public _cacheNameMap: Map<string, boolean>;
    public fieldArray: Array<FieldData> = [];

    constructor() {
        super();

        this._buildingDicByID = new SimpleDictionary();
        this._buildOrderList = [];
        this._tecOrderList = [];
        this._colosseumOrderList = [];
        this._alchemyOrderList = [];
        this._resUrlNameMap = new Map<string, boolean>();
        this._cacheNameMap = new Map<string, boolean>();
    }

    /**冷却队列 */
    public get queneList(): Array<Object> {
        var teclist: Array<BuildingOrderInfo> = BuildingManager.Instance.model.tecOrderList;
        var colosseList: Array<BuildingOrderInfo> = BuildingManager.Instance.model.colosseumOrderList;
        var alchemylist: Array<BuildingOrderInfo> = BuildingManager.Instance.model.alchemyOrderList;
        var buildlist: Array<BuildingOrderInfo> = BuildingManager.Instance.model.buildOrderList;

        var i: number = 0;
        let datalist = [];
        for (i = 0; i < teclist.length; i++) {
            var item = { vData: null, type: 0 };
            item.vData = teclist[i];
            item.type = QueueItem.QUEUE_TYPE_TEC;
            datalist.push(item);
        }
        for (i = 0; i < colosseList.length && ArmyManager.Instance.thane.grades >= 16; i++) {
            var item = { vData: null, type: 0 };
            item.vData = colosseList[i];
            item.type = QueueItem.QUEUE_TYPE_COLOSSEUM;
            datalist.push(item);
        }
        for (i = 0; i < alchemylist.length; i++) {
            var item = { vData: null, type: 0 };
            item.vData = alchemylist[i];
            item.type = QueueItem.QUEUE_TYPE_ALCHEMY;
            datalist.push(item);
        }
        for (i = 0; i < buildlist.length; i++) {
            var item = { vData: null, type: 0 };
            item.vData = buildlist[i];
            item.type = QueueItem.QUEUE_TYPE_BUILD;
            datalist.push(item);
        }
        if (i < 2) {//主界面内, 左侧功能栏中, 当前玩家为vip玩家后, 增加建筑队列该关闭
            var item = { vData: null, type: 0 };
            item.vData = null;
            item.type = QueueItem.QUEUE_TYPE_NULL;
            datalist.push(item);
        }
        for (let i: number = 0; i < datalist.length; i++) {
            let itemData = datalist[i];
            if (itemData.vData && itemData.vData.type != 4) {
                itemData.vData.removeEventListener(Laya.Event.COMPLETE, this.__completeHandler, this);
                itemData.vData.addEventListener(Laya.Event.COMPLETE, this.__completeHandler, this);
            }
        }
        return datalist;
    }

    private __completeHandler() {
        BuildingManager.Instance.upgradeOrderList();
    }

    public addBuildInfo(info: BuildInfo) {
        this._buildingDicByID.add(info.buildingId, info);
        this.event(BuildingEvent.ADD_NEW_BUILD, info)
    }

    public get buildOrderList(): Array<BuildingOrderInfo> {
        return this._buildOrderList;
    }
    public get tecOrderList(): Array<BuildingOrderInfo> {
        return this._tecOrderList;
    }

    public set colosseumOrderList(value: Array<BuildingOrderInfo>) {
        this._colosseumOrderList = value;
    }

    public get colosseumOrderList(): Array<BuildingOrderInfo> {
        return this._colosseumOrderList;
    }
    public get alchemyOrderList(): Array<BuildingOrderInfo> {
        return this._alchemyOrderList;
    }
    public setOrderList(value: Array<BuildingOrderInfo>) {
        this._buildOrderList = [];
        this._tecOrderList = [];
        this._alchemyOrderList = [];
        this.buildOrderCount = 0;
        this.tecOrderCount = 0;
        let len: number = value.length;
        for (let i: number = 0; i < len; i++) {
            let order: BuildingOrderInfo = value[i];
            if (order.orderType == 1) {
                if (order.remainTime > 0)
                    this.buildOrderCount++;
                this._buildOrderList.push(order);
            }
            else if (order.orderType == 2) {
                if (order.remainTime > 0)
                    this.tecOrderCount++;
                this._tecOrderList.push(order);
            }
            else if (order.orderType == 3) {
                if (order.remainTime > 0)
                    this.alchemyOrderCount++;
                this._alchemyOrderList.push(order);
            }
        }
        this.tecOrderTotal = this._tecOrderList.length;
        this.buildOrderTotal = this._buildOrderList.length;
        this.alchemyTotal = this._alchemyOrderList.length;
    }

    public get alchemyOrder(): BuildingOrderInfo {
        let len: number = this._alchemyOrderList.length;
        for (let i: number = 0; i < len; i++) {
            let order: BuildingOrderInfo = this._alchemyOrderList[i];
            if (order.orderType == 3) {
                return order;
            }
        }
        return null;
    }

    public get tecOrder(): BuildingOrderInfo {
        let len: number = this._tecOrderList.length;
        let order: BuildingOrderInfo
        for (let i: number = 0; i < len; i++) {
            order = this._tecOrderList[i];
            if (order.orderType == 2) {
                return order;
            }
        }
        return null;
    }

    /**
     * 根据队列id返回BuildingOrderInfo
     * @param id
     * @return BuildingOrderInfo
     */
    public getOrderById(id: number): BuildingOrderInfo {
        for (const key in this._buildOrderList) {
            if (Object.prototype.hasOwnProperty.call(this._buildOrderList, key)) {
                let element: BuildingOrderInfo = this._buildOrderList[key];
                if (element.orderId == id) return element;
            }
        }
        for (const key in this._tecOrderList) {
            if (Object.prototype.hasOwnProperty.call(this._tecOrderList, key)) {
                let element: BuildingOrderInfo = this._tecOrderList[key];
                if (element.orderId == id) return element;
            }
        }
        for (const key in this._colosseumOrderList) {
            if (Object.prototype.hasOwnProperty.call(this._colosseumOrderList, key)) {
                let element: BuildingOrderInfo = this._colosseumOrderList[key];
                if (element.orderId == id) return element;
            }
        }
        for (const key in this._alchemyOrderList) {
            if (Object.prototype.hasOwnProperty.call(this._alchemyOrderList, key)) {
                let element: BuildingOrderInfo = this._alchemyOrderList[key];
                if (element.orderId == id) return element;
            }
        }
        return null;
    }

    /**
     * 新增建筑队列, 根据类型添加进对应的数组
     * @param order
     */
    public addNewOrder(order: BuildingOrderInfo) {
        if (order.orderType == 1) {
            if (!this.checkHasSameId(this._buildOrderList, order.orderId)) {
                this._buildOrderList.push(order);
                this.buildOrderTotal = this._buildOrderList.length;
            }
        }
        else if (order.orderType == 2) {
            if (!this.checkHasSameId(this._tecOrderList, order.orderId)) {
                this._tecOrderList.push(order);
                this.tecOrderTotal = this._tecOrderList.length;
            }
        }
        else {
            if (!this.checkHasSameId(this._alchemyOrderList, order.orderId)) {
                this._alchemyOrderList.push(order);
                this.alchemyTotal = this._alchemyOrderList.length;
            }
        }
    }

    private checkHasSameId(arr: Array<BuildingOrderInfo>, orderId: number): boolean {
        let flag: boolean = false;
        if (arr) {
            let len: number = arr.length;
            let item: BuildingOrderInfo;
            for (let i: number = 0; i < len; i++) {
                item = arr[i];
                if (item && item.orderId == orderId) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    /**
     * 检查是否有闲置的挑战队列
     */
    public checkHasIdleColosseumOrder(): boolean {
        for (let index = 0; index < this._colosseumOrderList.length; index++) {
            const element = this._colosseumOrderList[index];
            if (element.remainTime <= 0) return true;
        }
        return false;
    }

    /**
     * 检查是否能够征收
     * @return 
     * 
     */
    public checkCanAlchemy(): boolean {
        if (ArmyManager.Instance.thane.grades < 14) return false;
        let info: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(BuildingType.OFFICEAFFAIRS);
        let leftCount: number = info.property2 - info.property1;
        let order: BuildingOrderInfo;
        for (let i: number = 0; i < this._alchemyOrderList.length; i++) {
            order = this._alchemyOrderList[i];
            if (order && order.remainTime <= 0 && leftCount > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 设置指定建筑信息
     * @param buildingId
     * @param pos
     * @param templeteId
     * @param pendingTemplateId
     * @param remainTime
     * 
     */
    public setBuilding(buildInfo: BuildInfo): BuildInfo {
        buildInfo.sonType = buildInfo.templeteInfo.SonType;
        let bInfo: BuildInfo = this._buildingDicByID[buildInfo.buildingId];
        if (bInfo) {
            bInfo.synchronization(buildInfo);
            return bInfo;
        } else {
            this._buildingDicByID.add(buildInfo.buildingId, buildInfo);
            return buildInfo;
        }
        return null;
    }

    /**
     * 通过建筑ID获取BuildingInfo
     * @param id
     * @return 
     * 
     */
    public getBuildingInfoByBID(id: number): BuildInfo {
        return this._buildingDicByID[id] as BuildInfo;
    }

    public canBuildOrUpgradeByBuildingId(bid: number): string {
        let bInfo: BuildInfo = this.getBuildingInfoByBID(bid);
        return this.canBuildOrUpgradeByBuildingInfo(bInfo);
    }

    /**
     * 判断前置建筑就否满足, 不满足时返回提示信息, 满足时返回空字符串
     * @param bInfo
     * @return 
     * 
     */
    public canBuildOrUpgradeByBuildingInfo(bInfo: BuildInfo): string {
        if (bInfo == null) {
            let str: string = LangManager.Instance.GetTranslation("castle.datas.BuildingModel.str");
        }
        let template: t_s_buildingtemplateData = bInfo.templeteInfo;
        if (bInfo.templateId == 0) {
            template = TempleteManager.Instance.getMinGradeBuildTemplate(template.SonType);
        }
        else {
            template = TempleteManager.Instance.getBuildTemplateByID(template.NextGradeTemplateId);
            if (template == null)
                return LangManager.Instance.GetTranslation("SeminaryFrameRightView.command06");
        }
        return this.getPreBuilding(template);
    }

    /**
     * 判断前置建筑就否满足, 不满足时返回提示信息, 满足时返回空字符串
     * @param bInfo
     * @return 
     * 
     */
    public canBuildOrUpgradeByBuildingInfoTec(bInfo: BuildInfo): string {
        if (bInfo == null) {
            let str: string = LangManager.Instance.GetTranslation("castle.datas.BuildingModel.str");
            return str;
        }
        let template: t_s_buildingtemplateData = bInfo.templeteInfo;
        if (bInfo.templateId == 0) {
            template = TempleteManager.Instance.getMinGradeBuildTemplate(template.SonType);
        }
        else {
            template = TempleteManager.Instance.getBuildTemplateByID(template.NextGradeTemplateId);
            if (template == null)
                return LangManager.Instance.GetTranslation("SeminaryFrameRightView.command06");
        }
        let existResult: string = "";
        let result: string = "";
        if (template && template.PreTemplateId != 0) {
            let preTemplate: t_s_buildingtemplateData = TempleteManager.Instance.getBuildTemplateByID(template.PreTemplateId);
            existResult = LangManager.Instance.GetTranslation("public.level.name", preTemplate.BuildingNameLang, preTemplate.BuildingGrade) + ", ";
            let buildingInfo: BuildInfo = this.getBuildingInfoBySonType(preTemplate.SonType);
            if (buildingInfo == null) {
                result += LangManager.Instance.GetTranslation("public.level.name", preTemplate.BuildingNameLang, preTemplate.BuildingGrade) + ", ";
            }
            else {
                let curTemplate: t_s_buildingtemplateData = buildingInfo.templeteInfo;
                if (curTemplate.BuildingGrade < preTemplate.BuildingGrade) {
                    result += LangManager.Instance.GetTranslation("public.level.name", preTemplate.BuildingNameLang, preTemplate.BuildingGrade) + ", ";
                }
            }
            return result
        }
        return "";
    }


    public getPreBuilding(temp: t_s_buildingtemplateData, isExist: boolean = false, isTec: boolean = false): string {
        let result: string = "";
        let existResult: string = "";
        let preTecResult: string = "";
        if (temp.PreTemplateId != 0) {
            let preTemplate: t_s_buildingtemplateData = TempleteManager.Instance.getBuildTemplateByID(temp.PreTemplateId);
            existResult += LangManager.Instance.GetTranslation("public.level.name", preTemplate.BuildingNameLang, preTemplate.BuildingGrade) + ", ";
            let buildingInfo: BuildInfo = this.getBuildingInfoBySonType(preTemplate.SonType);
            if (buildingInfo == null) {
                result += LangManager.Instance.GetTranslation("public.level.name", preTemplate.BuildingNameLang, preTemplate.BuildingGrade) + ", ";
            }
            else {
                let curTemplate: t_s_buildingtemplateData = buildingInfo.templeteInfo;
                if (curTemplate.BuildingGrade < preTemplate.BuildingGrade) {
                    result += LangManager.Instance.GetTranslation("public.level.name", preTemplate.BuildingNameLang, preTemplate.BuildingGrade) + ", ";
                }
            }
            if (temp.TemplateId >= 10000) {
                preTecResult += LangManager.Instance.GetTranslation("public.level.name", preTemplate.BuildingNameLang, preTemplate.BuildingGrade) + ", ";
            }
        }
        if (StringHelper.isNullOrEmpty(result) == false)
            result = result.substr(0, result.lastIndexOf("、"));
        if (isExist) {
            if (isTec) {
                return preTecResult;
            }
            return existResult.substr(0, existResult.lastIndexOf("、"));
        } else {
            if (isTec) {
                return preTecResult;
            }
            return result;
        }
    }

    public get buildingListByID(): SimpleDictionary {
        return this._buildingDicByID;
    }

    /**
         * 根据masterTypes取得当前所拥有的建筑 
         * @param masterType
         * @return 
         * 
         */
    public getBuildingInfoByMasterType(masterType: number): BuildInfo {
        let bInfo: BuildInfo;
        let list: Array<any> = this._buildingDicByID.getList();
        if (list) {
            for (let i: number = 0; i < list.length; i++) {
                let element = list[i];
                if (element && element.templeteInfo && element.templeteInfo.MasterType == masterType) {
                    bInfo = element;
                }
            }
        }
        return bInfo;
    }

    /**
     *  根据sonType取得当前所拥有的建筑
     * @param sonType
     * @return 
     * 
     */
    public getBuildingInfoBySonType(sonType: number): BuildInfo {
        let bInfo: BuildInfo;
        let list: Array<any> = this._buildingDicByID.getList();
        if (list) {
            for (let i: number = 0; i < list.length; i++) {
                let element = list[i];
                if (element && element.templeteInfo && element.templeteInfo.SonType == sonType) {
                    bInfo = element;
                    break;
                }
            }
        }
        return bInfo;
    }

    /**
         * 获取有大力神像影响的士兵的建造时间 
         * @param temp
         * @return 
         * 
         */
    public getTitanPawnTimeEffect(temp: t_s_pawntemplateData): number {
        let arr: Array<t_s_buildingtemplateData> = this.getMaxEffectBuildingTemplate(temp);
        arr = ArrayUtils.sortOn(arr, "Property3", ArrayConstant.NUMERIC);
        let bTemp: t_s_buildingtemplateData = <t_s_buildingtemplateData>arr[0];
        let titanInfo: BuildInfo = this.getBuildingInfoByMasterType(MasterTypes.MT_TITAN);
        if (titanInfo) {
            let num: number = parseInt((bTemp.Property3 - titanInfo.templeteInfo.Property3).toString()) / 100;
            return num;//根据属性降序排序, 取得最大的效果
        }
        else {
            return bTemp.Property3 / 100;
        }
    }

    /**
     * 根据士兵模板取得现有的影响该士兵属性的建筑列表 
     * @param temp 士兵模板
     * @return 
     * 
     */
    public getMaxEffectBuildingTemplate(temp: t_s_pawntemplateData): Array<t_s_buildingtemplateData> {
        let preTemplateId: number = temp.NeedBuilding;//取得所有前置建筑的模板id
        let buildList: Array<t_s_buildingtemplateData> = [];
        let buildTemp: t_s_buildingtemplateData = TempleteManager.Instance.getBuildTemplateByID(preTemplateId);//取得每一个建筑的薄
        let buildInfo: BuildInfo = this.getBuildingInfoBySonType(buildTemp.SonType);//通过模板取得当前建筑的buildInfo
        buildTemp = buildInfo.templeteInfo;//通过当前建筑的buildInfo取得当前建筑的模板
        buildList.push(buildTemp);
        return buildList;//取出所有前置建筑
    }

    /**
     * 检查是否存在指定 sonType
     * @param sonType
     * @param level
     * @return 
     * 
     */
    public isExistBuildingBySonType(sonType: number): boolean {
        let flag: boolean = false;
        let list: Array<any> = this._buildingDicByID.getList();
        if (list) {
            for (let i: number = 0; i < list.length; i++) {
                let element = list[i];
                if (element && element.sonType == sonType) {
                    flag = true;
                }
            }
        }
        return flag;
    }


    /**
     * 检查是否存在指定 sonType 和 level 的建筑
     * @param sonType
     * @param level
     * @return 
     */
    public isExistBuildingBySontypeAndLevel(sonType: number, level: number): boolean {
        let flag: boolean = false;
        let list: Array<any> = this._buildingDicByID.getList();
        if (list) {
            for (let i: number = 0; i < list.length; i++) {
                let element = list[i];
                if (element && element.sonType == sonType && element.templeteInfo && element.templeteInfo.BuildingGrade >= level) {
                    flag = true;
                }
            }
        }
        return flag;
    }

    /**
 * 检查指定 buildingId 的建筑是否已经达到满级
 * @param buildingId
 * @return 
 */
    public isMaxLevel(buildingId: number): boolean {
        let bInfo: BuildInfo = this._buildingDicByID.get(buildingId) as BuildInfo;
        if (bInfo.templateId == 0)
            return false;
        if (TempleteManager.Instance.getBuildTemplateByID(bInfo.templateId).NextGradeTemplateId == 0) {
            return true;
        }
        return false;
    }

    /**
        * 获得所有已有的科技
        * @return 
        * 
        */
    public allExistTec(): Array<BuildInfo> {
        var arr: Array<BuildInfo> = [];
        let list: Array<any> = this._buildingDicByID.getList();
        if (list) {
            for (let i: number = 0; i < list.length; i++) {
                let element = list[i];
                if (element.templeteInfo && (element.templeteInfo.MasterType == MasterTypes.MT_INTERNALTECHNOLOGY
                    || element.templeteInfo.MasterType == MasterTypes.MT_WARTECHNOLOGY)) {
                    arr.push(element);
                }
            }
        }
        return arr;
    }

    /**
     * 
     * @returns 取得最小等级的建筑, 等级想同按照优先级: 内政厅-兵营-神学院-精炼炉-仓库-民居
     */
    public getMinLevelBuindInfo(): BuildInfo {
        let list: Array<BuildInfo> = this._buildingDicByID.getList();
        var arr: Array<BuildInfo> = [];
        for (let i: number = 0; i < list.length; i++) {
            let element: BuildInfo = list[i];
            if (element.templeteInfo && (element.templeteInfo.SonType == BuildingType.OFFICEAFFAIRS
                || element.templeteInfo.SonType == BuildingType.CASERN
                || element.templeteInfo.SonType == BuildingType.SEMINARY
                || element.templeteInfo.SonType == BuildingType.CRYSTALFURNACE
                || element.templeteInfo.SonType == BuildingType.WAREHOUSE
                || element.templeteInfo.SonType == BuildingType.HOUSES)) {
                arr.push(element);
            }
        }
        if (arr.length > 0) {
            arr = ArrayUtils.sortOn(arr, ["level", "sort"], [ArrayConstant.NUMERIC, ArrayConstant.NUMERIC])
            return arr[0];
        }
        else {
            return null;
        }
    }

    /**
     * 检测是否存在可升级的科技
     */
    public checkHasTecCanUpdate(): boolean {
        let flag: boolean = false;
        let tecArr: Array<BuildInfo> = this.allExistTec();
        let tecInfo: BuildInfo;
        if (tecArr.length > 0) {
            let len: number = tecArr.length;
            for (let i: number = 0; i < len; i++) {
                tecInfo = tecArr[i];
                if (tecInfo && BuildingManager.Instance.isUpgradeAvaliableNotTips(tecInfo)) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }
}
