// @ts-nocheck
import Tiles from "../../game/map/space/constant/Tiles";

/**
 * 找出最近的可行走点
 * 
 */
export class WalkRectScanUtils {
	private _outWidth: number;
	private _outHeight: number;
	private _getWalkable: Function;

	public set getWalkable(value: Function) {
		this._getWalkable = value;
	}

	public dispose() {
		this._getWalkable = null;
		this._preStartPoint = null;
	}

	public set outHeight(value: number) {
		this._outHeight = value;
	}

	public set outWidth(value: number) {
		this._outWidth = value;
	}

	public walkRectScan(point: Laya.Point, start: Laya.Point, cur: Laya.Point): Laya.Point {
		if (this._preStartPoint.x == point.x && this._preStartPoint.y == point.y) {
			this._findPathCount++;
		}
		else {
			this._preStartPoint = new Laya.Point(point.x, point.y);
			this._findPathCount++;
		}

		let count: number = 0;
		let p: Laya.Point;
		while (!p && count < this._outWidth) {
			p = this.walkRectScanImp(count, point, start, cur);
			count++;
		}

		return p;

	}
	private _preStartPoint: Laya.Point = new Laya.Point();
	private _findPathCount: number;
	private walkRectScanImp(count: number, p: Laya.Point, start: Laya.Point, cur: Laya.Point): Laya.Point {
		let temp: Laya.Point = new Laya.Point(p.x, p.y);
		let arr: any[] = [];
		for (let i: number = -count; i <= count; i++) {
			temp.x = p.x;
			temp.x += i * Tiles.WIDTH;
			if (i == -count || i == count) {
				for (let j: number = -count; j <= count; j++) {
					temp.y = p.y;
					temp.y += j * Tiles.HEIGHT;
					if (this.outRect(parseInt((temp.x / Tiles.WIDTH).toString()), parseInt((temp.y / Tiles.HEIGHT).toString()))) arr.push(new Laya.Point(temp.x, temp.y));
				}
			}
			else {
				temp.y = p.y;
				temp.y += count * Tiles.HEIGHT;
				if (this.outRect(parseInt((temp.x / Tiles.WIDTH).toString()), parseInt((temp.y / Tiles.HEIGHT).toString()))) arr.push(new Laya.Point(temp.x, temp.y));
				temp.y = p.y;
				temp.y -= count * Tiles.HEIGHT;
				if (this.outRect(parseInt((temp.x / Tiles.WIDTH).toString()), parseInt((temp.y / Tiles.HEIGHT).toString()))) arr.push(new Laya.Point(temp.x, temp.y));
			}
		}
		temp.x = p.x;
		temp.y = p.y;
		let minPoint: Laya.Point = this.getMinDistance(arr, start);
		if (!minPoint) return minPoint;
		let leng: number = cur.distance(minPoint.x, minPoint.y);

		if (leng > 14) {
			return minPoint;
		}
		else if (this._findPathCount % 2 != 0) {
			if (arr.length < 3) return null;
			return this.getMaxDistance(arr, start);
		}
		return null;

	}
	private getMinDistance(arr: Laya.Point[], start: Laya.Point): Laya.Point {
		if (!arr || arr.length == 0) return null;
		let point: Laya.Point = arr[0];
		arr.forEach((element) => {
			if (point.distance(start.x, start.y) > start.distance(element.x, element.y)) {
				point = element;
			}
		});
		return point;
	}

	private getMaxDistance(arr: any[], start: Laya.Point): Laya.Point {
		if (!arr || arr.length == 0) return null;
		let point: Laya.Point = arr[0];
		arr.forEach((element) => {
			if (point.distance(start.x, start.y) < start.distance(element.x, element.y)) {
				point = element;
			}
		});
		return point;
	}

	private outRect($x: number, $y: number): boolean {
		$x = parseInt($x.toString());
		$y = parseInt($y.toString());
		if ($x > this._outWidth || $y > this._outHeight || $x < 0 || $y < 0) {
			return false;
		}
		return this._getWalkable($x, $y);
	}
}