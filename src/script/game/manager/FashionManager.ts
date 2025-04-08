import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { PackageIn } from "../../core/net/PackageIn";
import { FashionInfo } from "../module/bag/model/FashionInfo";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import { FashionEvent, ResourceEvent } from "../constant/event/NotificationEvent";
import { FashionModel } from "../module/bag/model/FashionModel";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "./ArmyManager";
import { SharedManager } from "./SharedManager";
import FashionMsg = com.road.yishi.proto.fashion.FashionMsg;
import FashionBook = com.road.yishi.proto.fashion.FashionBook;
import { TempleteManager } from "./TempleteManager";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { MessageTipManager } from "./MessageTipManager";
import LangManager from "../../core/lang/LangManager";
import { GoodsManager } from "./GoodsManager";
import { BagType } from "../constant/BagDefine";
import { PlayerManager } from "./PlayerManager";
import GoodsSonType from "../constant/GoodsSonType";
import ItemID from "../constant/ItemID";
import { ResourceManager } from "./ResourceManager";

export class FashionManager extends GameEventDispatcher {
    private static _instance: FashionManager;

    private _model: FashionModel;
    private _isopenFashion: boolean = false;
    private _isInited:boolean=false;
    public static get Instance(): FashionManager {
        if (!FashionManager._instance) {
            FashionManager._instance = new FashionManager();
        }
        return FashionManager._instance;
    }

    public set isopenFashion(v: boolean) {
        this._isopenFashion = v;
    }

    public get isopenFashion(): boolean {
        return this._isopenFashion;
    }

    constructor() {
        super();
        this._model = new FashionModel();
    }

    public setup() {
        ServerDataManager.listen(S2CProtocol.U_C_FASHION_BOOK, this, this.__receivedBookHandler)
        ResourceManager.Instance.gold.addEventListener(ResourceEvent.RESOURCE_UPDATE, this.initData, this);
    }

    /**
     * 等待玩家的数据初始化完成后再初始化, 因为需要玩家的金币数据设置红点
     */
    initData(){
        if(!this._isInited){
            this._isInited = true;
            this.getFashionBook();
            ResourceManager.Instance.gold.removeEventListener(ResourceEvent.RESOURCE_UPDATE, this.initData, this);
        }
    }

    /**
     * 请求用户图鉴信息和时装模版信息
     */
    public getFashionBook() {
        SocketManager.Instance.send(C2SProtocol.C_FASHION_INFO);
    }

    /**
     * 收到用户图鉴和时装模版信息
     * @param pkg
     */
    private __receivedBookHandler(pkg: PackageIn) {
        let msg: FashionMsg = pkg.readBody(FashionMsg) as FashionMsg;

        for (const key in this.fashionModel.bookList) {
            if (this.fashionModel.bookList.hasOwnProperty(key)) {
                this.fashionModel.bookList[key] = null;
                delete this.fashionModel.bookList[key];
            }
        }
        this.fashionModel.identityedList.length = 0;

        let book: FashionBook;
        let info: FashionInfo;
        let bookLeng: number = msg.info.length;
        for (let i: number = 0; i < bookLeng; i++) {
            book = msg.info[i] as FashionBook;
            info = new FashionInfo();
            info.fashionTempId = book.tempId;
            info.appraisalSkill = book.appraisalSkill;
            info.isSwitch = book.isSwitch;

            this.fashionModel.bookList[book.tempId] = book.isSwitch;
            if (info.appraisalSkill != 0) {
                this.fashionModel.identityedList.push(info);
            }
        }

        let idLeng: number = msg.fashionIds.length;
        let arr: number[] = [];
        let goodsTemplateInfo: t_s_itemtemplateData;
        for (let j: number = 0; j < idLeng; j++) {
            goodsTemplateInfo = this.temp(msg.fashionIds[j]);
            if (!goodsTemplateInfo) {
                continue;
            }
            if (this.fashionModel.bookList[msg.fashionIds[j]] != null || goodsTemplateInfo.Property3 != 1) {
                arr.push(msg.fashionIds[j]);
            }
        }
        arr.sort(this.fashionSortById.bind(this));
        this.fashionModel.fashionIds = arr;

        this.dispatchEvent(FashionEvent.FASHION_BOOK_RECEIVE, null);
    }

    private temp(id: number): t_s_itemtemplateData {
        return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, id);
    }

    private fashionSortById(a: number, b: number): number {
        if (a > b) {
            return -1;
        }
        else if (a == b) {
            return 0;
        }
        return 1;
    }

    /**
     * 图鉴保存装扮
     * @param temId
     *
     */
    public saveBook(temId: number) {
        if (temId == 0) {
            return;
        }
        let msg: FashionMsg = new FashionMsg();
        msg.templateId = temId;
        SocketManager.Instance.send(C2SProtocol.C_FASHION_SWITCH, msg);
    }

    /**
     * 鉴定时装
     * @param tempId 时装模板id
     *
     */
    public identityBook(tempId: number) {
        let msg: FashionMsg = new FashionMsg();
        msg.templateId = tempId;
        SocketManager.Instance.send(C2SProtocol.C_FASHION_APPLRAISAL, msg);

    }

    public get fashionModel(): FashionModel {
        return this._model;
    }

    /**
     * 时装鉴定指引进度
     * @return
     *
     */
    public get fashionIdentityProgress(): number {

        let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
        if (thaneInfo.grades < FashionModel.INDENTITY_OPEN_GRADE) {
            return 10000;
        }
        if (this.fashionModel.identityedList.length > 0) { //如果鉴定过则不闪
            return 10000;
        }
        // 0 背包 1 时装 2 时装图鉴
        let cacheProgress: number = SharedManager.Instance.fashionIdentityProgress;

        return cacheProgress;
    }

    public disenableNewIcon(tempId: number) {
        let msg: FashionMsg = new FashionMsg();
        msg.templateId = tempId;
        SocketManager.Instance.send(C2SProtocol.C_FASHION_SPECIAL, msg);
    }

    /**
     * 时装合成的操作
     * @param info 
     * @returns 
     */
    getOptType(info: GoodsInfo): string {
        if (this.fashionModel.selectedPanel == FashionModel.FASHION_COMPOSE_PANEL)//合成
        {
            if (info.bagType == BagType.Player)//放进合成区
            {
                if (FashionManager.Instance.canMoveToHideBag(info, true)) {
                    return LangManager.Instance.GetTranslation("public.putIn");

                }
            }
            else if (info.bagType == BagType.Hide)//从合成区取出
            {
                return LangManager.Instance.GetTranslation("public.unEquip");
            }
        }
        return '';
    }

    getBatchType(info: GoodsInfo): string {
        if (this.fashionModel.selectedPanel == FashionModel.FASHION_COMPOSE_PANEL)//合成
        {
            if (info.bagType == BagType.Player && info.count > 1)//批量放进合成区
            {
                if (FashionManager.Instance.canMoveToHideBag(info, true)) {
                    return LangManager.Instance.GetTranslation("BagWnd.multiply.put");

                }
            }

        }
        return '';
    }


    /**
     * 根据GoodsInfo获得时装的等级
     */
    public getFashionLevelByInfo(info: GoodsInfo): number {
        if (!info) {
            return 0;
        }
        if (info.templateId == FashionModel.FASHION_SOUL) {
            return 1;
        }
        let skillId: number = info.randomSkill1;
        if (!TempleteManager.Instance.getSkillTemplateInfoById(info.randomSkill1)) {
            skillId = Number(info.templateInfo.DefaultSkill.split(",")[0]);
        }
        let cfg = TempleteManager.Instance.getSkillTemplateInfoById(skillId);
        if(cfg) {
            return cfg.Grades;
        }
        return 0;
    }

    /**
     * 是否能放进去合成或者转换
     * @param info:被判断的物品
     * @param soul:是否可以放时装之魄
     * */
    public canMoveToHideBag(info: GoodsInfo, soul: boolean): boolean {
        let arr: any[] = GoodsManager.Instance.getGoodsByBagType(BagType.Hide);
        if (arr == null || arr.length <= 0) {
            return true;
        }
        let hideInfo: GoodsInfo;
        for (let i: number = 0; i < arr.length; i++) {
            if ((arr[i] as GoodsInfo).pos != this.fashionModel.to_pos) {
                hideInfo = arr[i] as GoodsInfo;
            }
        }
        if (hideInfo == null) {
            return true;
        }
        if (info.templateId == FashionModel.FASHION_SOUL && soul)//时装之魄
        {
            if ((<GoodsInfo>hideInfo).templateId == FashionModel.FASHION_SOUL) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("fashion.view.compose.oneEquipLess"));
                return false;
            }
            else {
                return true;
            }
        }
        else if ((<GoodsInfo>hideInfo).templateInfo.SonType != info.templateInfo.SonType &&
            (<GoodsInfo>hideInfo).templateId != FashionModel.FASHION_SOUL) {
            if (this.fashionModel.selectedPanel == FashionModel.FASHION_COMPOSE_PANEL) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("fashion.FashionComposeView.sontypeCannotCompose"));
                return false;
            }
            else if (this.fashionModel.selectedPanel == FashionModel.FASHION_SWITCH_PANEL) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("fashion.FashionSwitchView.sontypeCannotSwitch"));
                return false;
            }
        }
        return true;
    }


    /**
     * 时装合成界面的放入、卸下操作
     * @param info 
     * @returns 
     */
    putInOut(info: GoodsInfo,count=1) {
        if (!info) {
            return;
        }
        if (this.fashionModel.scene == FashionModel.SHOP_SCENE)//商城时装界面
        {
            if (info.moveType == FashionModel.TRY_ON && this.fashionModel.isFashion(info)) {
                this.fashionModel.wearFahion(info);
            }
            if (info.moveType == FashionModel.GET_OFF) {
                this.fashionModel.getOffFashion(info);
            }
        }
        else if (this.fashionModel.scene == FashionModel.FASHION_STORE_SCENE)//合成转换界面
        {
            if (this.fashionModel.opState == 1) {
                return;
            }
            else if (this.fashionModel.opState == 2) {
                this.fashionModel.resetMovieclip();
            }
            if (this.fashionModel.selectedPanel == FashionModel.FASHION_COMPOSE_PANEL)//合成
            {
   
                if (info.bagType == BagType.Player)//放进合成区
                {
                    if (FashionManager.Instance.canMoveToHideBag(info, true)) {
                        if (this.fashionModel.isFashion(info) && FashionManager.Instance.getFashionLevelByInfo(info) == 9) {
                            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("cell.mediator.fashionbag.FashionBagCellClickMediator.limitLevel"));
                        }

                        // 合成页面放入时装之魄需要该格子全部放入
                        // if (info.templateId == ItemID.FASHION_SOUL) {
                        //     // count = GoodsManager.Instance.getBagCountByTempId(BagType.Player, ItemID.FASHION_SOUL)
                        //     count = info.count
                        // }
                        PlayerManager.Instance.moveBagToBag(info.bagType, info.objectId, info.pos, BagType.Hide, 0, this.fashionModel.to_pos, count);
                    }
                }
                else if (info.bagType == BagType.Hide)//从合成区取出
                {
                    // 合成页面取出时装之魄需要全部取出
                    if (info.templateId == ItemID.FASHION_SOUL) {
                        count = GoodsManager.Instance.getBagCountByTempId(BagType.Hide, ItemID.FASHION_SOUL)
                    }
                    PlayerManager.Instance.moveBagToBag(info.bagType, info.objectId, info.pos, BagType.Player, 0, 0, count);
                }
            }
            if (this.fashionModel.selectedPanel == FashionModel.FASHION_SWITCH_PANEL)//转换
            {
                if (info.bagType == BagType.Player || info.bagType == BagType.HeroEquipment)//放进转换区
                {
                    if (FashionManager.Instance.canMoveToHideBag(info, false)) {
                        PlayerManager.Instance.moveBagToBag(info.bagType, info.objectId, info.pos, BagType.Hide, 0, this.fashionModel.to_pos, 1);
                    }
                }
                else if (info.bagType == BagType.Hide)//从转换区取出
                {
                    PlayerManager.Instance.moveBagToBag(info.bagType, info.objectId, info.pos, BagType.Player, 0, 0, 1);
                }
            }
        }
    }



}