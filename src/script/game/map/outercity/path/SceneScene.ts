import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import {PathIHitTester} from "../../../interfaces/PathIHitTester";
import {PathIPathSearcher} from "../../../interfaces/PathIPathSearcher";
import Point = Laya.Point;
import {PathRoboSearcher} from "./PathRoboSearcher";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/11/15 21:05
 * @ver 1.0
 */
export class SceneScene extends GameEventDispatcher
{
    private _hitTester:PathIHitTester;
    private _pathSearcher:PathIPathSearcher;

    private _x:number;
    private _y:number;

    constructor(maxDistance:number = 100000)
    {
        super();
        this._pathSearcher = new PathRoboSearcher(20, maxDistance, 8);
        this._x = 0;
        this._y = 0;
    }

    public get HitTester():PathIHitTester
    {
        return this._hitTester;
    }

    public get x():number
    {
        return this._x;
    }

    public get y():number
    {
        return this._y;
    }

    public set position(value:Point)
    {
        if(value.x != this._x || value.y != this._y)
        {
            this._x = value.x;
            this._y = value.y;
        }
    }

    public get position():Point
    {
        return new Point(this._x, this._y);
    }

    public setPathSearcher(path:PathIPathSearcher):void
    {
        this._pathSearcher = path;
    }

    public setHitTester(tester:PathIHitTester):void
    {
        this._hitTester = tester;
    }

    public hit(local:Point):boolean
    {
        return this._hitTester.isHit(local);
    }

    public searchPath(from:Point, to:Point):any[]
    {
        return this._pathSearcher.search(from, to, this._hitTester);
    }

    public localToGlobal(point:Point):Point
    {
        return new Point(point.x + this._x, point.y + this._y);
    }

    public globalToLocal(point:Point):Point
    {
        return new Point(point.x - this._x, point.y - this._y);
    }

    public dispose():void
    {
        this._hitTester = null;
        this._pathSearcher = null;
    }
}