// @ts-nocheck
import { eFilterFrameText, FilterFrameText } from "../../../component/FilterFrameText";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PathManager } from "../../../manager/PathManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { WildLand } from "../../data/WildLand";
import { MapPhysicsAttackingBase } from "../../space/view/physics/MapPhysicsAttackingBase";
import { EmWindow } from "../../../constant/UIDefine";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import { PosType } from "../../space/constant/PosType";
import LangManager from "../../../../core/lang/LangManager";
import { OuterCityModel } from "../OuterCityModel";

/**
 * @description  野矿 金矿 宝藏矿脉父类
 * @author yuanzhan.yu  
 * @date 2021/11/18 21:05
 * @ver 1.0
 */
export class PhysicsFieldView extends MapPhysicsAttackingBase {
    private _owner: FilterFrameText;
    private _name: FilterFrameText;
    private _countTxt: FilterFrameText;
    tipData: any;
    tipType: EmWindow;
    alphaTest: boolean = true;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point;
    private _width: number = 0;
    private _height: number = 0;
    private _locationX: number = 0;
    private _locationY: number = 0;
    //【外城】中型矿脉的标记位置点击没有提示按钮, 新手城堡点击也无按钮提示】https://www.tapd.cn/36229514/bugtrace/bugs/view?bug_id=1136229514001046037
    private _desctxt:FilterFrameText;
    constructor() {
        super();
    }

    protected initView(): void {
        if (!this._desctxt) {
            this._desctxt = new FilterFrameText(10, 20, undefined, 18, "#ffffff", "center", "middle", 0);
        }
        this.addChild(this._desctxt);
        if (!this._owner) {
            this._owner = new FilterFrameText(140, 20, undefined, 18, "#ffffff", "center", "middle", 0);
        }
        let pModel: PlayerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        if (pModel.userId == this.nodeInfo.info.occupyPlayerId) {
            this._owner.setFrame(3, eFilterFrameText.AvatarName);//自已蓝色
        }
        else if (pModel.consortiaID > 0 && this.nodeInfo.info.occupyLeagueName != "") {
            if (this.nodeInfo.info.occupyLeagueName == pModel.consortiaName) {////同公会蓝色
                this._owner.setFrame(2, eFilterFrameText.AvatarName);
            }
            else {//敌对公会红色
                this._owner.setFrame(5, eFilterFrameText.AvatarName);
            }
        }
        if(pModel.consortiaID == 0 && this.nodeInfo.info.occupyPlayerId > 0){
            this._owner.setFrame(5, eFilterFrameText.AvatarName);
        }
        if (this.nodeInfo.info.occupyPlayerId != 0) {
            this._owner.visible = true;
            this._owner.text = "<" + this.nodeInfo.info.occupyLeagueName + ">";
        }
        else {
            this._owner.visible = false;
            this._owner.text = "";
        }
        if (!this._name) {
            this._name = new FilterFrameText(140, 20, undefined, 18, "#ffffff", "center", "middle", 0);
        }
        if (this.nodeInfo.info.types == PosType.OUTERCITY_MINE) {//金矿节点
            let grade = this.nodeInfo.tempInfo.Grade;
            this._name.text = this.nodeInfo.tempInfo.NameLang + " " + LangManager.Instance.GetTranslation("public.level3", grade);
            if (this.nodeInfo.selfOccpuyArr.length > 0) {//玩家在当前节点有占领的矿点
                if (!this._countTxt) {
                    this._countTxt = new FilterFrameText(140, 20, undefined, 18, "#ffffff", "center", "middle", 0);
                }
                let max = this.nodeInfo.tempInfo.Property1;
                this._countTxt.text = LangManager.Instance.GetTranslation("PhysicsFieldView.countTxt", this.nodeInfo.selfOccpuyArr.length, max);
            }
        }
        else {
            this._name.text = this.nodeInfo.tempInfo.NameLang;
        }
        this._name.setFrame(6, eFilterFrameText.AvatarName);
        this._owner.setStroke(0, 1);
        this._name.setStroke(0, 1);
        this.layouCallBack();
    }

    protected updateView() {
        super.updateView();
        if (this.nodeInfo.info.types == PosType.OUTERCITY_MINE) {//金矿节点
            if (this.nodeInfo.selfOccpuyArr.length > 0) {//玩家在当前节点有占领的矿点
                if (!this._countTxt) {
                    this._countTxt = new FilterFrameText(140, 20, undefined, 18, "#ffffff", "center", "middle", 0);
                }
                let max = this.nodeInfo.tempInfo.Property1;
                this._countTxt.text = LangManager.Instance.GetTranslation("PhysicsFieldView.countTxt", this.nodeInfo.selfOccpuyArr.length, max);
            } else {
                if (this._countTxt) this._countTxt.text = "";
            }
        }
    }

    protected layouCallBack(): void {
        if (this.isRemoveStage) {
            return;
        }
        if (this.sizeInfo["width"] != 0) {
            this._width = this.sizeInfo["width"];
            this._height = this.sizeInfo["height"];
            this._locationX = this.sizeInfo["x"];
            this._locationY = this.sizeInfo["y"];
        }
        if (this.nodeInfo.info.types == PosType.OUTERCITY_TREASURE) {
            this._name.x = this._owner.x = this._locationX;
            this._owner.y = this.moviePos.y - this._name.height - 7;
            this._name.y = this.moviePos.y;
        } else if (this.nodeInfo.info.types == PosType.OUTERCITY_MINE) {
            this._name.x = this._owner.x = parseInt(((this._width - 140) / 2).toString());
            this._owner.y = this.moviePos.y - this._name.height - 7;
            this._name.y = this.moviePos.y;
        }
        if (this._countTxt) {
            this._countTxt.x = this._name.x;
            this._countTxt.y = this._owner.y;
        }
        if (this._isPlaying) {
            this.addChild(this._owner);
            this.addChild(this._name);
            if (this._countTxt) {
                this.addChild(this._countTxt);
            }
            if (this._width > 0 && this._height > 0) {
                let x = parseInt((this._width / 2).toString()) + 72;
                let y;
                if (this.nodeInfo.info.types == PosType.OUTERCITY_TREASURE) {
                    y = this._height / 2 - 80;
                }
                else if (this.nodeInfo.info.types == PosType.OUTERCITY_MINE) {
                    y = this._height / 2 - 40;
                }
                ToolTipsManager.Instance.register(this);
                this.tipType = EmWindow.OuterCityCastleTips;
                if (this.nodeInfo.info.types == PosType.OUTERCITY_TREASURE) {
                    x = x - 50;
                    this.startPoint = new Laya.Point(-x, -y +15);
                } else if (this.nodeInfo.info.types == PosType.OUTERCITY_MINE) {
                    this.startPoint = new Laya.Point(-x, -y);
                }
                this.tipData = this.info;
            }
        }
    }

    public get resourcesPath(): string {
        return PathManager.solveMapPhysicsBySonType(this.nodeInfo.tempInfo.SonType);
    }

    public get nodeInfo(): WildLand {
        return <WildLand>this.info;
    }

    protected setClearView(): void {
        this.dispose();
    }

    public get isSelfField(): boolean {
        if (this.nodeInfo) {
            return (this.nodeInfo.tempInfo.ID == OuterCityModel.SELT_CALSTE_TEMPLATEID);
        }
        return false;
    }

    public dispose(): void {
        if (this._name) {
            if (this._name.parent) {
                this._name.parent.removeChild(this._name);
            }
            this._name.dispose();
        }
        this._name = null;
        if (this._owner) {
            if (this._owner.parent) {
                this._owner.parent.removeChild(this._owner);
            }
            this._owner.dispose();
        }
        this._owner = null;
        ToolTipsManager.Instance.unRegister(this);
        super.dispose();
    }


    public set isPlaying(value: boolean) {
        super.isPlaying = value;
        if (value) {
            if (this._owner) {
                this.addChild(this._owner);
            }
            if (this._name) {
                this.addChild(this._name);
            }
        }
        else {
            if (this._owner && this._owner.parent) {
                this._owner.parent.removeChild(this._owner);
            }
            if (this._name && this._name.parent) {
                this._name.parent.removeChild(this._name);
            }
        }
    }
}