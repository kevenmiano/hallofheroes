import { PackageIn } from "../../core/net/PackageIn";
import { SocketManager } from "../../core/net/SocketManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { MountInfo } from "../module/mount/model/MountInfo";
import { PropertyInfo } from "../module/mount/model/PropertyInfo";
import { WildSoulCollection } from "../module/mount/model/WildSoulCollection";
import { WildSoulInfo } from "../module/mount/model/WildSoulInfo";
import { MessageTipManager } from "./MessageTipManager";
import { SocketSendManager } from "./SocketSendManager";
import { ServerDataManager } from '../../core/net/ServerDataManager';
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import AvatarInfoMsg = com.road.yishi.proto.campaign.AvatarInfoMsg;
import MountAvatarMsg = com.road.yishi.proto.campaign.MountAvatarMsg;
import MountEditMsg = com.road.yishi.proto.campaign.MountEditMsg;
import MountInfoMsg = com.road.yishi.proto.campaign.MountInfoMsg;
import ShareRewardInfo = com.road.yishi.proto.seventarget.ShareRewardInfo;
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import LangManager from '../../core/lang/LangManager';
import ConfigInfoManager from "./ConfigInfoManager";
import { NotificationManager } from "./NotificationManager";
import { NativeEvent } from "../constant/event/NotificationEvent";
import { t_s_upgradetemplateData } from "../config/t_s_upgradetemplate";
import { UpgradeType } from "../constant/UpgradeType";
import { TempleteManager } from "./TempleteManager";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
/**
 *坐骑信息及操作与服务器的相关交互 
 * 
 */
export class MountsManager {
    private _mountInfo: MountInfo;
    private _avatarList: WildSoulCollection;
    private _isSetup: boolean = false;
    public newMountActivity: boolean = false;
    public vipMountActivity: boolean = false;
    private static _instance: MountsManager;
    public mountResUrlMap: Map<string, boolean> = new Map();
    public mountCacheNameUrlMap: Map<string, boolean> = new Map();
    public flyMountArr:Array<number> = [];
    public mountShareStatus:boolean = false;//是否领取过分享奖励
    public maxStarGrade:number = 0;
    public static get Instance(): MountsManager {
        if (MountsManager._instance == null) MountsManager._instance = new MountsManager();
        return MountsManager._instance;
    }

    constructor() {
        this._mountInfo = new MountInfo();
        this._avatarList = new WildSoulCollection();
        this.flyMountArr = ConfigInfoManager.Instance.getFlyMountArr();
        this.maxStarGrade = this.getMaxStarGrade();
    }

     /**得到最大的星级数 */
     private getMaxStarGrade(): number {
        let maxGrade: number = 0;
        let arr: t_s_upgradetemplateData[] = TempleteManager.Instance.getTemplatesByType(UpgradeType.MOUNT_REFINING);
        if (arr.length > 0) {
            arr.sort((a: t_s_upgradetemplateData, b: t_s_upgradetemplateData) => {
                if (a.Grades > b.Grades) {
                    return 1;
                } else if (a.Grades < b.Grades) {
                    return -1
                } else {
                    return 0;
                }
            })
            maxGrade = arr[arr.length - 1].Grades;
        }
        return maxGrade;
    }

    public setup() {
        if (this._isSetup) return;
        this._isSetup = true;
        this.requestWildSoulList();
        ServerDataManager.listen(S2CProtocol.U_C_MOUNT_UPDATE, this, this.__onMountInfoUpdate);
        ServerDataManager.listen(S2CProtocol.U_C_MOUNT_AVATARLIST, this, this.__onMountListUpdate);
        ServerDataManager.listen(S2CProtocol.U_C_MOUNT_UPGRADESTAR, this, this.__onMountStarUpdate);
        ServerDataManager.listen(S2CProtocol.U_C_SHARE_REWARD, this, this.__onMountShareRewardUpdate);
        NotificationManager.Instance.addEventListener(NativeEvent.MOUNT_SHARE_RESULT, this.getMountShareResultHandler,this);
    }

    /**
     * 驯养或者幻化 坐骑信息的改变 
     * @param event
     * 
     */
    private __onMountInfoUpdate(pkg: PackageIn) {
        let msg: MountInfoMsg = pkg.readBody(MountInfoMsg) as MountInfoMsg;
        this._mountInfo.templateId = msg.mountTempId;
        this._mountInfo.growExp = msg.mountTotalGp;
        this._mountInfo.propertyGradeMax = msg.levelMax;
        this._mountInfo.discount = msg.discount;
        var propInfo: PropertyInfo;
        propInfo = this._mountInfo.getProperty(PropertyInfo.STRENGTH);
        propInfo.addition = msg.power;
        propInfo.propGp = msg.powerGp;
        propInfo = this._mountInfo.getProperty(PropertyInfo.INTELLECT);
        propInfo.addition = msg.intellect;
        propInfo.propGp = msg.intellectGp;
        propInfo = this._mountInfo.getProperty(PropertyInfo.STAMINA);
        propInfo.addition = msg.physique;
        propInfo.propGp = msg.physiqueGp;
        propInfo = this._mountInfo.getProperty(PropertyInfo.ARMOR);
        propInfo.addition = msg.agility;
        propInfo.propGp = msg.agilityGp;
        this._mountInfo.dispatchChangeEvent();
    }
    /**
     * 当前拥有的坐骑 , 通过ProtocolType.C_MOUNT_AVATARLIST请求
     * @param event
     * 
     */
    private __onMountListUpdate(pkg: PackageIn) {
        let msg: MountAvatarMsg = pkg.readBody(MountAvatarMsg) as MountAvatarMsg;
        if (msg.hasOwnProperty("soulScore")) {
            this._mountInfo.soulScore = msg.soulScore
        }
        this._avatarList.clear();
        this._avatarList.clearHideMountFramSpecialList();
        for (let i: number = 0; i < msg.avatarInfo.length; i++) {
            let item: AvatarInfoMsg = msg.avatarInfo[i] as AvatarInfoMsg;
            var wildSoulInfo: WildSoulInfo = new WildSoulInfo();
            wildSoulInfo.templateId = item.mountTempId;
            wildSoulInfo.activeDate = DateFormatter.parse(item.activeDate, "YYYY-MM-DD hh:mm:ss");  //激活
            wildSoulInfo.expairDate = DateFormatter.parse(item.expairDate, "YYYY-MM-DD hh:mm:ss");  //过期
            wildSoulInfo.isExist = item.isExist;
            wildSoulInfo.param1 = item.param1;
            wildSoulInfo.param2 = item.param2;
            wildSoulInfo.starLevel = item.starLevel;
            wildSoulInfo.oldStarLevel = item.starLevel;
            wildSoulInfo.blessing = item.blessing;
            this._avatarList.addWildSoul(wildSoulInfo);
        }
        this._avatarList.dispatchChangeEvent();
    }

    private __onMountStarUpdate(pkg: PackageIn) {
        let msg: AvatarInfoMsg = pkg.readBody(AvatarInfoMsg) as AvatarInfoMsg;
        var wildSoulInfo: WildSoulInfo = MountsManager.Instance.avatarList.getWildSoulInfo(msg.mountTempId);
        let flag: boolean = false;
        if (wildSoulInfo) {
            wildSoulInfo.templateId = msg.mountTempId;
            wildSoulInfo.activeDate = DateFormatter.parse(msg.activeDate, "YYYY-MM-DD hh:mm:ss");  //激活
            wildSoulInfo.expairDate = DateFormatter.parse(msg.expairDate, "YYYY-MM-DD hh:mm:ss");  //过期
            wildSoulInfo.isExist = msg.isExist;
            this._mountInfo.soulScore =  msg.param1;
            wildSoulInfo.param2 = msg.param2;
            wildSoulInfo.starLevel = msg.starLevel;
            if (msg.starLevel > wildSoulInfo.oldStarLevel) {//星级改变, 派发事件
                flag = true;
            }
            wildSoulInfo.oldStarLevel = wildSoulInfo.starLevel;
            wildSoulInfo.blessing = msg.blessing;
        }
        if (flag) {
            this._avatarList.dispatchChangeEvent();
        }
        this._mountInfo.dispatchStatInfoEvent();
    }

    /**
     * 驯养 
     * @param property 驯养属性(0==力量.1==护甲.2==智力.5==体质)
     * @param payType 支付方式 (0==钻石.1==口粮)
     * @param type 驯养方式(0==普通.1==高级)
     * 
     */
    public domesticate(property: number, payType: number, type: number, useBind: boolean = true) {
        var msg: MountEditMsg = new MountEditMsg();
        msg.propertyType = property;
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        msg.param1 = type;
        SocketManager.Instance.send(C2SProtocol.C_MOUNT_EDIT, msg);
    }

    /**
     * 请求坐骑列表数据 
     * 
     */
    public requestWildSoulList() {
        SocketManager.Instance.send(C2SProtocol.C_MOUNT_AVATARLIST);
    }

    /**
     * 下马 
     * 
     */
    public dismount() {
        var msg: MountEditMsg = new MountEditMsg();
        msg.param1 = 0;
        SocketManager.Instance.send(C2SProtocol.C_ARMYMOUNT_AVATARCHANGE, msg);
    }

    /**
     * 上马 
     * 
     */
    public mount() {
        var msg: MountEditMsg = new MountEditMsg();
        msg.param1 = 1;
        SocketManager.Instance.send(C2SProtocol.C_ARMYMOUNT_AVATARCHANGE, msg);
    }

    /**
     * 幻化 
     * @param templateId 坐骑模板id
     * 
     */
    public changeMount(templateId: number) {
        var msg: MountEditMsg = new MountEditMsg();
        msg.param1 = templateId;
        SocketManager.Instance.send(C2SProtocol.C_MOUNT_CHANGE, msg);
    }

    /**
     * 激活坐骑 
     * @param templateId 坐骑模板id
     * 
     */
    public activateMount(templateId: number, useBind: boolean = true) {
        var msg: MountEditMsg = new MountEditMsg();
        msg.param1 = templateId;
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.C_MOUNTAVATAR_ACTIVE, msg);
    }

    /**
     * 使用激活坐骑的物品 
     * @param info  坐骑物品信息
     * 
     */
    public sendUseGoods(info: GoodsInfo) {
        if (info.templateInfo.Property3 > 0) {
            //所需坐骑等级
            if (this.mountInfo.grade < info.templateInfo.Property3) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mounts.UseGoodNeedGrade", info.templateInfo.Property3));
                return;
            }
        }
        if (info.templateInfo.Property2 <= 0) {
            //永久
            let wildSoulInfo:WildSoulInfo = this.avatarList.getWildSoulInfo(info.templateInfo.Property1);
            if (wildSoulInfo) {
                if(wildSoulInfo.starLevel >= this.getMaxGrade())//满级了
                {
                    SocketSendManager.Instance.sendUseItem(info.pos);
                }
                else{
                    FrameCtrlManager.Instance.open(EmWindow.MountRefiningWnd, { info: wildSoulInfo.template });
                }
                return;
            }
        }
        SocketSendManager.Instance.sendUseItem(info.pos);
        this.newMountActivity = true;
    }

    /**得到最大的星级数 */
    private getMaxGrade(): number {
        let maxGrade: number = 0;
        let arr: t_s_upgradetemplateData[] = TempleteManager.Instance.getTemplatesByType(UpgradeType.MOUNT_REFINING);
        if (arr.length > 0) {
            arr.sort((a: t_s_upgradetemplateData, b: t_s_upgradetemplateData) => {
                if (a.Grades > b.Grades) {
                    return 1;
                } else if (a.Grades < b.Grades) {
                    return -1
                } else {
                    return 0;
                }
            })
            maxGrade = arr[arr.length - 1].Grades;
        }
        return maxGrade;
    }
    
    public get mountInfo(): MountInfo {
        return this._mountInfo;
    }

    public get avatarList(): WildSoulCollection {
        return this._avatarList;
    }

    /**
     * 坐骑炼化
     * @param mountTempId 坐骑模板Id
     * @param param2 炼化使用的材料0=坐骑卡  1=兽之精华
     */
    public refining(mountTempId: number,param2:number = 0) {
        var msg: MountEditMsg = new MountEditMsg();
        msg.param1 = mountTempId;
        msg.param2 = param2;
        SocketManager.Instance.send(C2SProtocol.C_MOUNT_UPSTAR, msg);
    }

    private getMountShareResultHandler(data:any){
        if(data == 1 && this.mountShareStatus){
            this.getMountShareStatus();
        }
    }

    /**
     * 请求领取坐骑分享的奖励
     */
    public getMountShareStatus(){
        SocketManager.Instance.send(C2SProtocol.C_SHARE_REWARD);
    }

    private __onMountShareRewardUpdate(pkg: PackageIn){
        let msg: ShareRewardInfo = pkg.readBody(ShareRewardInfo) as ShareRewardInfo;
        this.mountShareStatus = msg.hasReward;
    }
}