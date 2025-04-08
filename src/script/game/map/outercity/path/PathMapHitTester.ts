// @ts-nocheck
import { PathIHitTester } from "../../../interfaces/PathIHitTester";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { Geometry } from "./Geometry";
import Point = Laya.Point;
import Sprite = Laya.Sprite;

export class PathMapHitTester implements PathIHitTester {
    private meshSprite: Sprite;

    constructor(mesh: Sprite) {
        this.meshSprite = mesh;
    }

    public isHit(point: Point): boolean {

        return OuterCityManager.Instance.model.getWalkable(point.x, point.y);
    }

    public getNextMoveAblePoint(point: Point, angle: number, step: number, max: number): Point {
        let dist: number = 0;
        while (this.isHit(point)) {
            point = Geometry.nextPoint(point, angle, step);
            dist += step;
            if (dist > max) {
                return null;
            }
        }
        return point;
    }
}