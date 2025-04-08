// @ts-nocheck
import Logger from "../../../../core/logger/Logger";
import { PathIHitTester } from "../../../interfaces/PathIHitTester";
import { PathIPathSearcher } from "../../../interfaces/PathIPathSearcher";
import { Geometry } from "./Geometry";
import Point = Laya.Point;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/11/15 21:05
 * @ver 1.0
 */
export class PathRoboSearcher implements PathIPathSearcher {

    private static LEFT: number = -1;
    private static RIGHT: number = 1;

    private step: number;
    private maxCount: number;
    private maxDistance: number;
    private stepTurnNum: number;

    constructor(step: number, maxDistance: number, num: number = 4) {
        this.step = step;
        this.maxDistance = maxDistance;
        this.maxCount = Math.ceil(maxDistance / step) * 2;
        this.stepTurnNum = num;
    }

    /**
     * 设置路径搜索的角度步数, 比如4代表每次转动PI/4搜索, 通常这个值在4-8之间就足够了
     */
    public setStepTurnNum(num: number): void {
        this.stepTurnNum = num;
    }

    public search(from: Point, end: Point, hittest: PathIHitTester): any[] {

        let notGoPath: any[] = [];
        if (from.x == end.x && from.y == end.y) {
            return notGoPath;
        }
        let leftPath: any[] = [];
        let rightPath: any[] = [];
        let left: boolean = this.searchWithWish(from, end, hittest, PathRoboSearcher.LEFT, leftPath);
        let right: boolean = this.searchWithWish(from, end, hittest, PathRoboSearcher.RIGHT, rightPath);
        if (left && right) {
            if (leftPath.length < rightPath.length) {
                return leftPath;
            } else {
                return rightPath;
            }
        } else if (left) {
            return leftPath;
        } else if (right) {
            return rightPath;
        } else {
            return notGoPath;
        }
    }

    /**
     * 返回查找到的路径,null表示查找失败
     */
    private searchWithWish(from: Point, tto: Point, tester: PathIHitTester, wish: number, nodes: any[]): boolean {
        //let endInBlock:boolean = false;
        //如果终点就在障碍里面
        if (tester.isHit(tto)) {
            //endInBlock = true;
            tto = this.findReversseNearestBlankPoint(from, tto, tester);
            if (tto == null) {
                return false;
            }
            //如果起点也在障碍里面, 那么简单直接返回这个终点
            if (tester.isHit(from)) {
                nodes.push(from);
                nodes.push(tto);
                return true;
            }
        }

        //如果起点在障碍里面
        //if(tester.isHit(from) && !endInBlock){
        else if (tester.isHit(from)) {
            //先找到起点到终点直线路径中第一个可行走点
            let midTo: Point = this.findReversseNearestBlankPoint(tto, from, tester);
            if (midTo == null) {
                return false;
            }
            //然后再从此行走点路径搜索
            let midSearch: boolean = this.searchWithWish(midTo, tto, tester, wish, nodes);
            if (midSearch) {
                nodes.splice(0, 0, from);
                return true;
            }
            else {
                return false;
            }
        }

        //如果距离太远, 就直接找第一个快要撞到障碍的地方
        if (from.distance(tto.x, tto.y) > this.maxDistance) {
            nodes.push(from);
            tto = this.findFarestBlankPoint(from, tto, tester);
            if (tto == null) {
                return false;
            }
            nodes.push(tto);
            return true;
        }

        let aheadSearch: boolean = this.doSearchWithWish(from, tto, tester, wish, nodes);

        if (!aheadSearch) { //正向查找失败, 就直接返回失败
            return false;
        }

        //如果节点比较多, 那么再反向查找利用反向的末端路经并合正向的开头可以合并的节点
        if (nodes.length > 4) {
            let reverseNodes: any[] = [];
            let success: boolean = this.doSearchWithWish(tto, nodes[0], tester, 0 - wish, reverseNodes);
            if (success) {
                //因为通常倒数第二个节点和最后一个节点之间是一个比较优秀的长节点
                //所以利用反向的倒数第二个节点可以简化正向的若干个节点
                let lastZhuanze: Point = reverseNodes[reverseNodes.length - 2] as Point;
                let minReplaceD: number = this.step;
                for (let i: number = 1; i < nodes.length - 1; i++) {
                    let rp: Point = nodes[i] as Point;
                    if (rp.distance(lastZhuanze.x, lastZhuanze.y) < minReplaceD) {
                        nodes.splice(1, i, lastZhuanze);
                        //Logger.log("Replace index " + i);
                        return true;
                    }
                }
            }
        }
        return true;
    }

    /**
     * 如果返回null表示查找失败
     */
    private findFarestBlankPoint(from: Point, toPoint: Point, hitTester: PathIHitTester): Point {
        if (hitTester.isHit(from)) {
            return this.findReversseNearestBlankPoint(toPoint, from, hitTester);
        }
        const heading: number = this.countHeading(from, toPoint);
        let dist: number = from.distance(toPoint.x, toPoint.y);
        let lastFrom: Point = from;
        while (!hitTester.isHit(from)) {
            lastFrom = from;
            from = Geometry.nextPoint(from, heading, this.step);
            dist -= this.step;
            if (dist <= 0) {
                return null;
            }
        }
        from = lastFrom;
        const n: number = 8;
        const turn: number = Math.PI / n;
        for (let i: number = 1; i < n; i++) {
            const headingPlus: number = heading + i * turn;
            const headingMinus: number = heading - i * turn;
            let tp: Point = Geometry.nextPoint(from, headingPlus, this.step * 2);
            if (!hitTester.isHit(tp)) {
                return tp;
            }
            tp = Geometry.nextPoint(from, headingMinus, this.step * 2);
            if (!hitTester.isHit(tp)) {
                return tp;
            }
        }
        return null;
    }

    /**
     * 返回从tto到from直线过程(路径的逆向)中第一个没有撞到障碍的点,null表示查找失败
     */
    private findReversseNearestBlankPoint(from: Point, toPoint: Point, hitTester: PathIHitTester): Point {
        let heading: number = this.countHeading(toPoint, from);
        let dist: number = toPoint.distance(from.x, from.y);
        while (hitTester.isHit(toPoint)) {
            toPoint = Geometry.nextPoint(toPoint, heading, this.step);
            dist -= this.step;
            if (dist <= 0) {
                return null;
            }
        }
        const n: number = 12;
        const turn: number = Math.PI / n;
        heading += Math.PI;
        for (let i: number = 1; i < n; i++) {
            const headingPlus: number = heading + i * turn;
            const headingMinus: number = heading - i * turn;
            let tp: Point = Geometry.nextPoint(toPoint, headingPlus, this.step * 2);
            if (!hitTester.isHit(tp)) {
                return tp;
            }
            tp = Geometry.nextPoint(toPoint, headingMinus, this.step * 2);
            if (!hitTester.isHit(tp)) {
                return tp;
            }
        }
        return toPoint;
    }

    /**
     * 这里的起点和终点都必须保证不在障碍内
     */
    private doSearchWithWish(from: Point, toPoint: Point, tester: PathIHitTester, wish: number, nodes: any[]): boolean {
        nodes.push(from);

        const angle: number = wish * Math.PI / this.stepTurnNum;
        const startDelta: number = wish * Math.PI / 2;
        let count: number = 1;
        let maxDistance: number = this.step;
        let heading: number = this.countHeading(from, toPoint);
        let lastDistanceToEnd: number = from.distance(toPoint.x, toPoint.y);

        while ((lastDistanceToEnd > maxDistance) && ((count++) < this.maxCount)) {
            const headingToEnd: number = this.countHeading(from, toPoint);
            let dir: number = heading - startDelta;
            const bb: number = this.bearing(headingToEnd, dir);
            if ((wish > 0 && bb < 0) || (wish < 0 && bb > 0)) {
                dir = headingToEnd;
            }
            let nextPoint: Point = Geometry.nextPoint(from, dir, this.step);

            let lastFrom: Point = from;
            let distanceToEnd: number;

            if (tester.isHit(nextPoint)) {
                let found: boolean = false;
                for (let i: number = 2; i < this.stepTurnNum * 2; i++) {
                    dir += angle;
                    nextPoint = Geometry.nextPoint(from, dir, this.step);
                    if (!tester.isHit(nextPoint)) {
                        from = nextPoint;
                        distanceToEnd = from.distance(toPoint.x, toPoint.y);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    Logger.log("cant find one");
                    nodes.splice(0);
                    return false; //cant find one
                }
            } else {
                from = nextPoint;
                distanceToEnd = from.distance(toPoint.x, toPoint.y);
            }
            if (Math.abs(this.bearing(heading, dir)) > 0.01) {
                nodes.push(lastFrom);
                heading = dir;
            }
            lastDistanceToEnd = distanceToEnd;
        }
        if (count <= this.maxCount) {
            nodes.push(toPoint);
            return true;
        }
        return false;
    }

    private countHeading(p1: Point, p2: Point): number {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    }

    private bearing(base: number, heading: number): number {
        let b: number = heading - base;
        b = (b + Math.PI * 4) % (Math.PI * 2);
        if (b < -Math.PI) {
            b += Math.PI * 2;
        } else if (b > Math.PI) {
            b -= Math.PI * 2;
        }
        return b;
    }
}