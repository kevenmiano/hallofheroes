// @ts-nocheck
import Dictionary from '../../core/utils/Dictionary';
import { PathNode } from './PathNode';
	/**
	 *  A*寻路
	 */
	export class AStarPathFinder {
		//====================================
		//	Constants
		//		//====================================
		//横向移动一格的路径评分
		private COST_HORIZONTAL: number = 10;
		//竖向移动一格的路径评分
		private COST_VERTICAL: number = 10;
		//斜向移动一格的路径评分
		private COST_DIAGONAL: number = 14;



		private _xMapStart: number = 0;		//地图起始网格坐标
		private _yMapStart: number = 0;		//地图起始网格坐标
		private wMap: number = 0			//地图列数（每行格点数）
		private hMap: number = 0			//地图行数（每列格点数）

		private openList: Array<PathNode> = [];		//开放列表
		private closeList: Array<PathNode> = [];		//关闭列表

		private isFinded: boolean = false;		//能否找到路径, true-已找到

		public runTimeInMs: number = 0; 	//寻路时间
		private _title: any;

		constructor(titles: any, w: number = 100, h: number = 100) {
			this._title = titles;
			let arr: string[] = [];
			for (let key in this._allNodeDict) {
				arr.push(key);
			}
			if (AStarPathFinder._pool) {
				let keys: string;
				while (arr.length > 0) {
					keys = arr.pop();
					delete this._allNodeDict[keys];
					AStarPathFinder._pool.push(this._allNodeDict[keys]);
				}
			}
			else {
				while (arr.length > 0) {
					delete this._allNodeDict[arr.pop()];
				}

			}
			arr = null;
			if (w > this.wMap || h > this.hMap) {
				if (w > this.wMap) this.wMap = w;
				if (h > this.hMap) this.hMap = h;
				this.initMap();
			}

		}
		private getNodeByXY($x: number, $y: number): PathNode {
			if (this._allNodeDict[$x + "_" + $y] == null) {
				let node: PathNode;
				if (AStarPathFinder._pool.length > 0) {
					node = AStarPathFinder._pool.pop();
					node.update($x, $y);
				}
				else {
					node = new PathNode($x, $y);
				}
				this._allNodeDict[$x + "_" + $y] = node;
			}
			return this._allNodeDict[$x + "_" + $y];
		}

		private _allNodeDict: Dictionary = new Dictionary();
		private static _pool: Array<PathNode>;
		public find(startPoint: Laya.Point, endPoint: Laya.Point): Laya.Point[] {
			let currentNode: PathNode = this.getNodeByXY(startPoint.x, startPoint.y);//map[startPoint.y][startPoint.x];
			let endNode: PathNode = this.getNodeByXY(endPoint.x, endPoint.y)//map[endPoint.y][endPoint.x];

			this.openList.push(currentNode);

			while (this.openList.length > 0) {
				//Logger.log("openList.length:"+openList.length);
				//取出并删除开放列表第一个元素
				currentNode = this.openList.shift();

				//加入到关闭列表
				currentNode.isInOpen = false;
				currentNode.isInClose = true;
				this.closeList.push(currentNode);

				//当前节点==目标节点
				if (currentNode.x == endPoint.x && currentNode.y == endPoint.y) {
					this.isFinded = true;	//能达到终点, 找到路径
					break;
				}

				//取相邻八个方向的节点, 去除不可通过和以在关闭列表中的节点
				let aroundNodes: any[] = this.getAroundsNode(currentNode.x, currentNode.y);

				for (let node of aroundNodes) //检测相邻的八个方向的节点
				{
					//Logger.log("node:"+node.x+"||"+node.y);
					//计算 G,  H 值   
					let g: number = this.getGValue(currentNode, node);
					let h: number = this.getHValue(currentNode, endNode, node);

					if (node.isInOpen)	//如果节点已在播放列表中
					{
						//Logger.log("node.isInOpen");
						//如果该节点新的G值比原来的G值小,修改F,G值, 设置该节点的父节点为当前节点
						if (g < node.g) {
							node.g = g;
							node.h = h;
							node.f = g + h;
							node.parentNode = currentNode;

							//							this.findAndSort(node);
						}
					}
					else //如果节点不在开放列表中
					{
						//插入开放列表中, 并按照估价值排序
						node.g = g;
						node.h = h;
						node.f = g + h;
						node.parentNode = currentNode;

						this.insertAndSort(node);
					}

				}
				//Logger.log(this+":for each end in find");
			}

			//Logger.log("path find end");
			if (this.isFinded)	//找到路径
			{
				let path: Laya.Point[] = this.createPath(startPoint.x, startPoint.y);
				this.destroyLists();
				return path;//filerPath(path);
			} else {	//没有找到路径
				this.destroyLists();
				return null;
			}
		}

		/**
		 * 生成路径数组
		 */
		private createPath(xStart: number, yStart: number): Laya.Point[] {
			let path: Laya.Point[] = new Array();

			let node: PathNode = this.closeList.pop();

			while (node.x != xStart || node.y != yStart) {
				path.unshift(new Laya.Point(node.x, node.y));
				node = node.parentNode;
			}
			path.unshift(new Laya.Point(node.x, node.y));
			return path;
		}

		/**
		 * 按由小到大顺序将节点插入到列表
		 */
		private insertAndSort(node: PathNode) {
			//Logger.log("insertAndSort");
			node.isInOpen = true;

			let listLength: number = this.openList.length;

			if (listLength == 0) {
				this.openList.push(node);
			} else {
				for (let i: number = 0; i < listLength; i++) {
					//Logger.log("openList.length:"+openList.length);
					if (node.f <= this.openList[i].f) {
						this.openList.splice(i, 0, node);
						return;
					}
				}
				this.openList.push(node);
			}
			//Logger.log("insertAndSort end");
		}



		/**
		 * 计算G值
		 */
		private getGValue(currentNode: PathNode, node: PathNode): number {
			let g: number = 0;
			if (currentNode.y == node.y)			// 横向  左右
			{
				g = currentNode.g + this.COST_HORIZONTAL;
			}
			else if (currentNode.x == node.x) {
				g = currentNode.g + this.COST_VERTICAL;
			}
			else						// 斜向  左上 左下 右上 右下
			{
				g = currentNode.g + this.COST_DIAGONAL;
			}
			//			else if (currentNode.y+1 == node.y || currentNode.y-1 == node.y)// 竖向  上下
			//			{
			//				g = currentNode.g + this.COST_VERTICAL ;
			//			}

			return g;
		}

		/**
		 * 计算H值
		 */
		private getHValue(currentNode: PathNode, endNode: PathNode, node: PathNode): number {
			let dx: number = 0;
			let dy: number = 0;
			dx = Math.abs(node.x - endNode.x) * (this.COST_HORIZONTAL - 5);
			dy = Math.abs(node.y - endNode.y) * (this.COST_VERTICAL - 5);
			return dx + dy;
		}

		/**
		 * 得到周围八方向节点
		 */
		private getAroundsNode(x: number, y: number): any[] {
			let aroundNodes: any[] = new Array();

			let checkX: number = 0;
			let checkY: number = 0;
			/**
			 * 八个方向的寻路
			 */
			//左
			checkX = x - 1
			checkY = y;
			if (this.isWalkable(checkX, checkY) && !this.getPointIsClose(checkX, checkY)) {
				//Logger.log("左:::"+checkY+"##"+checkX);
				aroundNodes.push(this.getNodeByXY(checkX, checkY));//this.map[checkY][checkX]);
			}
			//左上
			checkX = x - 1;//+(y&1);
			checkY = y - 1;
			if (this.isWalkable(checkX, checkY) && !this.getPointIsClose(checkX, checkY)) {
				//Logger.log("左上:::"+checkY+"##"+checkX);
				aroundNodes.push(this.getNodeByXY(checkX, checkY));
			}
			//上
			checkX = x;
			checkY = y - 1;
			if (this.isWalkable(checkX, checkY) && !this.getPointIsClose(checkX, checkY)) {
				//Logger.log("上:::"+checkY+"##"+checkX);
				aroundNodes.push(this.getNodeByXY(checkX, checkY));
			}
			//右上
			checkX = x + 1;//(y&1);
			checkY = y - 1;
			if (this.isWalkable(checkX, checkY) && !this.getPointIsClose(checkX, checkY)) {
				//Logger.log("右上:::"+checkY+"##"+checkX);
				aroundNodes.push(this.getNodeByXY(checkX, checkY));
			}
			//右
			checkX = x + 1;
			checkY = y;
			if (this.isWalkable(checkX, checkY) && !this.getPointIsClose(checkX, checkY)) {
				//Logger.log("右:::"+checkY+"##"+checkX);
				aroundNodes.push(this.getNodeByXY(checkX, checkY));
			}
			//右下
			checkX = x + 1;//(y&1);
			checkY = y + 1;
			if (this.isWalkable(checkX, checkY) && !this.getPointIsClose(checkX, checkY)) {
				//Logger.log("右下:::"+checkY+"##"+checkX);
				aroundNodes.push(this.getNodeByXY(checkX, checkY));
			}
			//下
			checkX = x;
			checkY = y + 1;
			if (this.isWalkable(checkX, checkY) && !this.getPointIsClose(checkX, checkY)) {
				//Logger.log("下:::"+checkY+"##"+checkX);
				aroundNodes.push(this.getNodeByXY(checkX, checkY));
			}


			//左下
			checkX = x - 1;//+(y&1);
			checkY = y + 1;
			if (this.isWalkable(checkX, checkY) && !this.getPointIsClose(checkX, checkY)) {
				//Logger.log("左下:::"+checkY+"##"+checkX);
				aroundNodes.push(this.getNodeByXY(checkX, checkY));
			}



			return aroundNodes;
		}
		private getPointIsClose($x: number, $y: number): boolean {
			return (this._allNodeDict[$x + "_" + $y] == null ? false : this._allNodeDict[$x + "_" + $y].isInClose);
		}

		/**
		 * 检查点在地图上是否可通过
		 */
		public isWalkable(x: number, y: number): boolean {
			// 1. 是否是有效的地图上点（数组边界检查）
			if (x < this._xMapStart || x >= this.wMap || y < this._yMapStart || y >= this.hMap) {
				return false;
			}
			return (this._title[x + "_" + y] ? true : false);
		}


		/**
		 * 使用节点初始化一个行列与地图格点相同的数组
		 */
		private initMap() {
			if (AStarPathFinder._pool) return;
			AStarPathFinder._pool = [];
			for (let y: number = this._yMapStart; y < this.hMap; y++) {

				for (let x: number = this._xMapStart; x < this.wMap; x++) {
					AStarPathFinder._pool.push(new PathNode(x, y));
				}
			}
		}

		public set yMapStart($y: number) {
			if ($y < 0) $y = 0;
			this._yMapStart = $y;
		}

		public get yMapStart(): number {
			return this._yMapStart;
		}

		public set xMapStart($x: number) {
			if ($x < 0) $x = 0;
			this._xMapStart = $x;
		}
		public get xMapStart(): number {
			return this._xMapStart;
		}

		/**
		 * 销毁数组
		 */
		private destroyLists() {
			this.closeList = [];
			this.openList = [];
		}

	}//end class

