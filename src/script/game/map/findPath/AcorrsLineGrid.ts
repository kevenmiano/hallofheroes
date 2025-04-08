import Tiles from "../space/constant/Tiles";
import { CampaignNode } from "../space/data/CampaignNode";
import StringHelper from '../../../core/utils/StringHelper';

export class AcorrsLineGrid {
	private _findPath8: IFindPath;
	private _mapModel: any;

	constructor(findPath8: IFindPath, mapModel: any) {
		this.nodeWidth = Tiles.WIDTH;
		this.nodeHeight = Tiles.HEIGHT;
		this._findPath8 = findPath8;
		this._mapModel = mapModel;
	}
	public getPsnode2(arr: Laya.Point[]): Laya.Point[] {
		let primaryArray: Laya.Point[] = [];
		if (!arr) return primaryArray;
		for (let j: number = 0; j < arr.length; j++)
			primaryArray.push(arr[j]);

		let len: number = arr.length;
		if (len < 3)
			return arr;

		let psArr: Laya.Point[] = [];
		let snode: Laya.Point = arr[0] as Laya.Point;
		let endNode: Laya.Point = arr[len - 1] as Laya.Point;
		let index: number = 0;
		psArr.push(snode);
		let i: number = 0;
		let test: Laya.Point;
		while (snode != endNode) {
			for (i = len - 1; i > index; i--) {
				test = arr[i] as Laya.Point;
				let neigbor: boolean = Boolean((i - index) == 1);
				if (neigbor || this.isCorrsed(snode, test)) {
					snode = test;
					index = i;
					psArr.push(test);
					break;
				}
			}
		}

		let returnArray: any[] = [];
		for (i = 0; i < primaryArray.length; i++) {
			test = primaryArray[i] as Laya.Point;

			if (this._mapModel.hasOwnProperty("getNotHandlerNodeByXY")) {
				let node: CampaignNode = this._mapModel.getNotHandlerNodeByXY(test.x, test.y);
				if (node) {
					if (node.resetPosX > 0 && node.resetPosY > 0) {
						returnArray.push(new Laya.Point(node.resetPosX, node.resetPosY));
					}
					else if (i > 0) {
						let lastTest: Laya.Point = primaryArray[i - 1] as Laya.Point;
						if (returnArray.indexOf(lastTest) == -1)
							returnArray.push(lastTest);
					}
					if (returnArray.indexOf(test) == -1)
						returnArray.push(test);
				}

				if (psArr.indexOf(test) >= 0 && returnArray.indexOf(test) == -1) {
					returnArray.push(test);
				}

			}
			else if (psArr.indexOf(test) >= 0) {
				returnArray.push(test);
			}
		}
		return this.buildPath(returnArray);
	}

	private buildPath(data: any[]): any[] {
		let p1: Laya.Point;
		let p2: Laya.Point;
		let path: any[] = new Array();
		let line: any[] = new Array();
		for (let i: number = 1; i < data.length; i++) {
			p1 = data[i - 1] as Laya.Point;
			p2 = data[i] as Laya.Point;
			line = this.spliceLine(p1, p2);
			if (this.pointTest(path, line[0])) {
				path.pop();
			}
			path = path.concat(line);
		}
		if (this.pointTest(path, p2)) {
			path.pop();
		}
		path.push(p2);
		return path;
	}

	private pointTest(path: any[], point: Laya.Point): boolean {
		if (path.length > 0 && path[path.length - 1].x == point.x && path[path.length - 1].y == point.y) {
			return true;
		}
		return false;
	}

	private minDistance: number = 6;
	private spliceLine(p1: Laya.Point, p2: Laya.Point): any[] {
		let route: any[] = new Array();

		//两点之间的距离
		let dx: number = p1.x - p2.x;
		let dy: number = p1.y - p2.y;
		let leng: number = Math.sqrt(dx * dx + dy * dy);
		if (leng < this.minDistance) {
			route.push(p1);
			return route;
		}
		let length: number = Math.floor(leng / this.minDistance);
		for (let i: number = 0; i <= length; i++) {
			// let p: Laya.Point
			// if (parseInt((i / length).toString()) == 0) {
			// 	p = p1;
			// }
			// else {
			// 	p = p2;
			// }

			let p = StringHelper.interpolate(p2, p1, i / length)
			p.x = parseInt(p.x.toString());
			p.y = parseInt(p.y.toString());
			route.push(p);
		}
		return route;
	}


	private nodes: any[];
	private nodeWidth: number = 0;
	private nodeHeight: number = 0;

	//---直线方程系数
	private _k: number = 0;
	private _b: number = 0;
	private _isPanX: boolean = false;
	private _panXvalue: number = 0;
	private _isPanY: boolean = false;
	private _panYvalue: number = 0;
	private node: Laya.Point;
	private _checkCornerPoint: Laya.Point = new Laya.Point();

	private isCorrsed(s: Laya.Point, e: Laya.Point): boolean {
		//_grid.nodesRest();
		if (!s || !e) return false;
		//let ep:Point = new Point(e.x*nodeWidth+0.2,e.y*nodeHeight+0.2);
		this._isPanX = s.y == e.y;
		this._isPanY = s.x == e.x;
		if (this._isPanX || this._isPanY) {
			if (this._isPanX) this._panXvalue = s.y * this.nodeHeight;
			if (this._isPanY) this._panYvalue = s.x * this.nodeWidth;
		} else {
			this._k = ((e.y - s.y) * this.nodeHeight) / ((e.x - s.x) * this.nodeWidth);
			this._b = (e.y) * this.nodeHeight - (((e.x) * this.nodeWidth) * this._k);
		}


		let minx: number = AcorrsLineGrid.getMinInt(e.x, s.x);
		let maxx: number = AcorrsLineGrid.getMaxInt(e.x, s.x);
		let miny: number = AcorrsLineGrid.getMinInt(s.y, e.y);
		let maxy: number = AcorrsLineGrid.getMaxInt(s.y, e.y);

		let startPx: number = (minx) * this.nodeWidth;
		let endPx: number = (maxx) * this.nodeWidth;
		let startPy: number = (miny) * this.nodeHeight;
		let endPy: number = (maxy) * this.nodeHeight;

		//x轴采样:
		let px: number = 0;
		let py: number = 0;
		let pxGrid: number = 0;
		let pyGrid: number = 0;
		let acnode: number = 0;
		this.node = s.x < e.x ? s : e;
		let i: number = 0;
		for (i = minx; i <= maxx; i++) {
			px = i * this.nodeWidth + 1;
			pxGrid = parseInt((px / Tiles.WIDTH).toString());

			if (px >= startPx && px <= endPx) {
				py = this.getPy(px);
				pyGrid = parseInt((py / Tiles.HEIGHT).toString());
				acnode = this.getNodeValueByGridXY(pxGrid, pyGrid);
				if (acnode == 1)
					return false;
				this._checkCornerPoint.x = px;
				this._checkCornerPoint.y = py;
				if (this.checkCorner(this._checkCornerPoint))
					return false;
				this.node = new Laya.Point(parseInt((px / Tiles.WIDTH).toString()), parseInt((py / Tiles.HEIGHT).toString()));
			}

			px = (i + 1) * this.nodeWidth - 1;
			pxGrid = parseInt((px / Tiles.WIDTH).toString());
			if (px >= startPx && px <= endPx) {
				py = this.getPy(px);
				pyGrid = parseInt((py / Tiles.HEIGHT).toString());
				acnode = this.getNodeValueByGridXY(pxGrid, pyGrid);
				if (acnode == 1)
					return false;
				this._checkCornerPoint.x = px;
				this._checkCornerPoint.y = py;
				if (this.checkCorner(this._checkCornerPoint))
					return false;
				this.node = new Laya.Point(parseInt((px / Tiles.WIDTH).toString()), parseInt((py / Tiles.HEIGHT).toString()));
			}
		}

		acnode = s.y < e.y ? this.getNodeValueByGridXY(s.x, s.y) : this.getNodeValueByGridXY(e.x, e.y);
		for (i = miny; i <= maxy; i++) {
			py = i * this.nodeHeight + 1;
			pyGrid = parseInt((py / Tiles.HEIGHT).toString());
			if (py >= startPy && py <= endPy) {
				px = this.getPx(py);
				pxGrid = parseInt((px / Tiles.WIDTH).toString());
				acnode = this.getNodeValueByGridXY(pxGrid, pyGrid);
				if (acnode == 1)
					return false;
				this._checkCornerPoint.x = px;
				this._checkCornerPoint.y = py;
				if (this.checkCorner(this._checkCornerPoint))
					return false;
				this.node = new Laya.Point(parseInt((px / Tiles.WIDTH).toString()), parseInt((py / Tiles.HEIGHT).toString()));
			}

			py = (i + 1) * this.nodeHeight - 1;
			pyGrid = parseInt((py / Tiles.HEIGHT).toString());
			if (py >= startPy && py <= endPy) {
				px = this.getPx(py);
				pxGrid = parseInt((px / Tiles.WIDTH).toString());
				acnode = this.getNodeValueByGridXY(pxGrid, pyGrid);
				if (acnode == 1)
					return false;
				this._checkCornerPoint.x = px;
				this._checkCornerPoint.y = py;
				if (this.checkCorner(this._checkCornerPoint))
					return false;
				this.node = new Laya.Point(parseInt((px / Tiles.WIDTH).toString()), parseInt((py / Tiles.HEIGHT).toString()));
			}
		}

		return true;
	}

	private getPx(yy: number): number {
		if (this._isPanY)
			return this._panYvalue;
		return (yy - this._b) / this._k;
	}

	private getPy(xx: number): number {
		if (this._isPanX)
			return this._panXvalue;
		return this._k * xx + this._b;
	}

	private checkCorner(n: Laya.Point): boolean {
		let face: number = this.getface(n);
		let c1: number = 0;
		let c2: number = 0;
		switch (face) {
			case 4:
				c1 = this.getNodeValueByXY(n.x - 1, n.y);// nodes[n.y][n.x - 1];
				c2 = this.getNodeValueByXY(n.x, n.y - 1);//nodes[n.y - 1][n.x ];
				break;
			case -2:
				c1 = this.getNodeValueByXY(n.x - 1, n.y);//nodes[n.y][n.x - 1];
				c2 = this.getNodeValueByXY(n.x, n.y + 1);//nodes[n.y +1][n.x ];
				break;
			case -4:
				c1 = this.getNodeValueByXY(n.x + 1, n.y);//nodes[n.y][n.x + 1];
				c2 = this.getNodeValueByXY(n.x, n.y + 1);//nodes[n.y +1][n.x ];
				break;
			case 2:
				c1 = this.getNodeValueByXY(n.x + 1, n.y);//nodes[n.y][n.x + 1];
				c2 = this.getNodeValueByXY(n.x, n.y + 1);// nodes[n.y +1][n.x ];
				break;
			default:
				return false;
				break;
		}
		if (c1 == 1 && c2 == 1)
			return true;
		return false;
	}

	private getface(n: Laya.Point): number {
		let result: number = (n.y - this.node.y) * 3 + (n.x - this.node.x);
		return result;
	}

	private getNodeValueByXY(x: number, y: number): number {
		return this._findPath8.map()[parseInt((y / this.nodeHeight).toString())][parseInt((x / this.nodeHeight).toString())].value;
	}
	private getNodeValueByGridXY(x: number, y: number): number {
		return this._findPath8.map()[parseInt(y.toString())][parseInt(x.toString())].value;
	}

	public set findPath8(value: IFindPath) {
		this._findPath8 = value;
	}

	private static getMinInt(para1: number, para2: number): number {
		if (para1 < para2)
			return para1;
		return para2;
	}

	private static getMaxInt(para1: number, para2: number): number {
		if (para1 > para2)
			return para1;
		return para2;
	}

	/////////////////////////////////////////////////////
	public getPsnode(path: any[]): any[] {
		if (!path) return null;
		let find: any[] = this.getStraightLine(path);
		find = this.getStraightLine(find);//两次优化
		return find;
	}

	private getStraightLine(path: any[]): any[] {
		if (path.length <= 2) return path;
		let pathLen: number = path.length;
		let startPos: number = 0;
		let endPos: number = pathLen - 1;
		let straightLinePath: any[] = [path[0]];
		while (startPos != endPos) {
			let startPoint: Laya.Point = path[startPos];
			let endPoint: Laya.Point = path[endPos];
			let linePoints: any[] = this.findPoints(startPoint, endPoint);
			if (linePoints) {
				straightLinePath.push(path[endPos]);
				startPos = endPos;
				endPos = pathLen - 1;
			} else {
				endPos = Math.floor((endPos + startPos) / 2);
			}
		}
		if (straightLinePath.length == 1) {
			return path;
		}
		return straightLinePath;
	}

	/**
	 *  找出两点之间的所有点, 查看技能会不会阻挡
	 */
	private findPoints(from: Laya.Point, to: Laya.Point): any[] {
		let result: any[] = [];
		let x: number, y: number;
		if (from.x == to.x) {
			let min: number = Math.min(from.y, to.y);
			let max: number = Math.max(from.y, to.y);
			for (y = min; y < max; y++) {
				if (!this.isWalkable(from.x, y)) {
					return null;
				}
			}
		} else {
			const slope: number = (to.y - from.y) / (to.x - from.x);
			const stepX: number = (to.x > from.x) ? 1 : -1;
			const stepY: number = (to.y > from.y) ? 1 : -1;

			if (Math.abs(to.x - from.x) >= Math.abs(to.y - from.y)) {
				for (x = from.x; x != to.x; x += stepX) {
					y = Math.floor(((x - from.x) * slope + from.y));
					if (!this.isWalkable(x, y)) {
						return null;
					}
				}
			} else {
				for (y = from.y; y != to.y; y += stepY) {
					x = Math.floor((y - from.y) / slope + from.x);
					if (!this.isWalkable(x, y)) {
						return null;
					}
				}
			}
		}
		return result;
	}

	private isWalkable(px: number, py: number): boolean {
		return this.getNodeValueByGridXY(px, py) != 1;
	}
}