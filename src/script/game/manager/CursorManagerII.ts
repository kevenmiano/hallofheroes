import Dictionary from "../../core/utils/Dictionary";
import {MovieClip} from "../component/MovieClip";
import Logger from '../../core/logger/Logger';
import Mouse = Laya.Mouse;

/**
 * @description    鼠标样式管理
 * @author yuanzhan.yu
 * @date 2021/11/23 18:22
 * @ver 1.0
 */
export class CursorManagerII
{
    private static _Instance:CursorManagerII
    public static get Instance():CursorManagerII
    {
        if(!CursorManagerII._Instance)
        {
            CursorManagerII._Instance = new CursorManagerII();
        }
        return CursorManagerII._Instance;
    }


    public static DRAG_CURSOR:string = "DRAG_CURSOR";
    public static WATER_CURSOR:string = "WATER_CURSOR";
    public static PICK_CURSOR:string = "PICK_CURSOR";
    public static SPLITE_CURSOR:string = "SPLITE_CURSOR";
    public static SELL_CIRSOR:string = "SELL_CIRSOR";
    public static NO_WALK_CURSOR:string = "NO_WALK_CURSOR";
    public static DEFAULT_CURSOR:string = "DEFAULT_CURSOR";
    public static EMPTY_CURSOR:string = "EMPTY_CURSOR";
    public static COLLECT_CURSOR:string = "COLLECT_CURSOR";

    public static REMOVE_CURSOR_UP:string = "REMOVE_CURSOR_UP";
    public static ATTACK_CURSOR:string = "ATTACK_CURSOR";
    public static PVP_ATTACT_CURSOR:string = "PVP_ATTACT_CURSOR";
    public static REMOVE_CURSOR_DOWN:string = "REMOVE_CURSOR_DOWN";

    public static FARM_PLANT_CURSOR:string = "FARM_PLANT_CURSOR";  //种植
    public static FARM_PICK_CURSOR:string = "FARM_PICK_CURSOR";  //摘取
    public static FARM_WEED_CURSOR:string = "FARM_WEED_CURSOR";   //除草
    public static FARM_WORM_CURSOR:string = "FARM_WORM_CURSOR";  //除虫
    public static FARM_CLEAR_CURSOR:string = "FARM_CLEAR_CURSOR";  //铲除
    public static FARM_REVIVE_CURSOR:string = "FARM_REVIVE_CURSOR";  //复活
    public static FARM_FEED:string = "FARM_FEED";

    public static VEHICLE_SKILL:string = "VEHICLE_SKILL";  //载具施法光圈

    public static SPACE_NPC_CURSOR:string = "SPACE_NPC_CURSOR";
    public static SPACE_PLAYER_CURSOR:string = "SPACE_PLAYER_CURSOR";

    /**
     *二级密码锁
     */
    public static VICE_PASSWORD_LOCK:string = "VICE_PASSWORD_LOCK";

    private _currentState:string;
    private _cursorDic:Dictionary;

    public hide():void
    {
        Mouse.hide();
    }

    public show():void
    {
        Mouse.show();
    }

    constructor()
    {
        this._cursorDic = new Dictionary();
        this.initCursor();
        this.initEvent();
    }

    private initCursor():void
    {
        this._cursorDic[CursorManagerII.DRAG_CURSOR] = "asset.core.cursor.DragIconAsset";
        this._cursorDic[CursorManagerII.WATER_CURSOR] = "asset.core.cursor.WaterIconAsset";
        this._cursorDic[CursorManagerII.PICK_CURSOR] = "asset.core.cursor.PickOverIconAsset";
        this._cursorDic[CursorManagerII.COLLECT_CURSOR] = "asset.core.cursor.CollectIconAsset";
        this._cursorDic[CursorManagerII.ATTACK_CURSOR] = "asset.core.cursor.AttackIconAsset";
        this._cursorDic[CursorManagerII.NO_WALK_CURSOR] = "asset.core.cursor.NoWalkIconAsset";
        this._cursorDic[CursorManagerII.SELL_CIRSOR] = "asset.core.cursor.SellIconAsset";
        this._cursorDic[CursorManagerII.SPLITE_CURSOR] = "asset.core.cursor.SpliteIconAsset";
        this._cursorDic[CursorManagerII.REMOVE_CURSOR_UP] = "asset.core.cursor.RemoveIconUpAsset";
        this._cursorDic[CursorManagerII.REMOVE_CURSOR_DOWN] = "asset.core.cursor.RemoveIconDownAsset";
        this._cursorDic[CursorManagerII.FARM_CLEAR_CURSOR] = "asset.core.cursor.ClearIconAsset";
        this._cursorDic[CursorManagerII.FARM_PLANT_CURSOR] = "asset.core.cursor.SeedIconAsset";
        this._cursorDic[CursorManagerII.FARM_PICK_CURSOR] = "asset.core.cursor.CollectIconAsset";
        this._cursorDic[CursorManagerII.FARM_REVIVE_CURSOR] = "asset.core.cursor.ReviveIconAsset";
        this._cursorDic[CursorManagerII.FARM_WEED_CURSOR] = "asset.core.cursor.WeedIconAsset";
        this._cursorDic[CursorManagerII.FARM_WORM_CURSOR] = "asset.core.cursor.WormIconAsset";
        this._cursorDic[CursorManagerII.SPACE_NPC_CURSOR] = "asset.core.cursor.SpaceNpcAsset";
        this._cursorDic[CursorManagerII.SPACE_PLAYER_CURSOR] = "asset.core.cursor.SpacePlayerAsset";
        this._cursorDic[CursorManagerII.VICE_PASSWORD_LOCK] = "asset.common.vp.mouse";
        this._cursorDic[CursorManagerII.PVP_ATTACT_CURSOR] = this._cursorDic[CursorManagerII.ATTACK_CURSOR];
    }

    private initEvent():void
    {
        //			StageReferance.stage.addEventListener(MouseEvent.MOUSE_OVER,__overHandler);
        //			StageReferance.stage.addEventListener(MouseEvent.MOUSE_OUT,__outHandler);
    }

    private __overHandler(e:Laya.Event):void
    {
    }

    private __outHandler(e:Laya.Event):void
    {
    }

    public resetCursor():void
    {
        this._currentState = "";
        Mouse.show();
        // Mouse.cursor = 'auto';
        Mouse.cursor = 'url("res/game/cursor/asset.core.cursor.SpacePlayerAsset.png"),auto';
    }

    public showCursorByType(type:string):void
    {
        this.resetCursor();
        if(type == CursorManagerII.SPACE_NPC_CURSOR) {
            Logger.warn(type);
        }
        this._currentState = type;
        let cursor:string = this._cursorDic[this._currentState];
        if(!cursor)
        {
            Mouse.show();
            // Mouse.cursor = 'auto';
            Mouse.cursor = 'url("res/game/cursor/asset.core.cursor.SpacePlayerAsset.png"),auto';
            return;
        }
        Mouse.show();
        Mouse.cursor = `url("res/game/cursor/${cursor}.png"),auto`;
    }

    public get currentState():string
    {
        return this._currentState;
    }

    public registerCursor(key:string, mc:MovieClip):void
    {
        this._cursorDic[key] = mc;
    }

    public unregisterCursor(key:string):void
    {
        delete this._cursorDic[key];
    }
}