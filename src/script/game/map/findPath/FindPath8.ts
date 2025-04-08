export class FindPath8 implements IFindPath {
    private _map: any[][] = [];
    private _w: number = 0;
    private _h: number = 0;
    private _open: any[] = [];
    private _startPoint: any;
    private _endPoint: any;
    protected _path: Laya.Point[] = [];
    private _isInit: boolean = false;
    private _initTimeId: any = 0;
    private _para1: any;
    private _isVehicle: boolean = false;
    private _isFly: boolean = false;
    public dispose() {
        if (this._map) {
            for (let j = this._map.length - 1; j >= 0; j--) {
                this._map[j] = null;
            }
            this._map = [];
        }
        if (this._open) {
            for (let j = this._open.length - 1; j >= 0; j--) {
                this._open[j] = null;
            }
            this._open = [];
        }
        if (this._path) {
            for (let j = this._path.length - 1; j >= 0; j--) {
                this._path[j] = null;
            }
            this._path = [];
        }
        this._startPoint = null;
        this._endPoint = null;
    }

    constructor($w: number, $h: number, param1: Object, isVehicle: boolean = false, isFly: boolean = false) {
        this._path = [];
        this._map = [];
        this._w = $w;
        this._h = $h;
        this._para1 = param1;
        this._isVehicle = isVehicle;
        this._isFly = isFly;
        this._initTimeId = setInterval(this.initData.bind(this), 500);
    }

    map(): any[][] {
        return this._map;
    }


    private initData() {
        if (this._initTimeId > 0) {
            clearInterval(this._initTimeId);
            this._initTimeId = 0;
        }
        if (this._isInit) return;
        this._isInit = true;
        if (!this._map) return;
    
        for (let y = 0; y < this._h; y++) {
            if (this._map[y] == undefined) {
                this._map[y] = [];
            }
            for (let x = 0; x < this._w; x++) {
                let value = 1;
                if (this._isVehicle) {
                    if (this._para1 && this._para1[x + "_" + y] && this._para1[x + "_" + y] != 2) {
                        value = 0;
                    }
                } else if (this._isFly) {
                    value = 0;
                } else {
                    if (this._para1) {
                        value = this._para1[x + "_" + y] ? 0 : 1;
                    }
                }
                this._map[y][x] = { x: x, y: y, value: value, block: false, open: false, value_g: 0, value_h: 0, value_f: 0, value_k: null };
            }
        }
        this._para1 = null;
    }


    public path(): any[] {
        return this._path;
    }

    public find(startPoint: Laya.Point, endPoint: Laya.Point): any[] {
        if (!this._isInit) this.initData();
        let neighbors: any[] = null;
        let neighborsLength: number = 0;
        let neighborIndex: number = 0;
        let currentNeighbor: any;
        this._path = [];
        this._startPoint = this._map[startPoint.y][startPoint.x];
        this._endPoint = this._map[endPoint.y][endPoint.x];
        if (this._endPoint == null || this._endPoint.value == 1) {
            return null;
        }
        if (this._endPoint.x == this._startPoint.x && this._endPoint.y == this._startPoint.y) {
            return null;
        }
        let found: boolean = false;
        this.initBlock();
        let currentNode: any = this._startPoint;
        while (!found) {
            currentNode.block = true;
            this._updateNodes.push(currentNode);
            neighbors = this.getNeighbors(currentNode);
            neighborsLength = neighbors.length;
            neighborIndex = 0;
            while (neighborIndex < neighborsLength) {
                currentNeighbor = neighbors[neighborIndex];
                if (currentNeighbor == this._endPoint && Math.abs((currentNeighbor.y - currentNode.y) / (currentNeighbor.x - currentNode.x)) != 1) {
                    currentNeighbor.value_k = currentNode;
                    this._updateNodes.push(currentNeighbor);
                    found = true;
                    break;
                }
                if (currentNeighbor.value == 0) {
                    this.count(currentNeighbor, currentNode);
                }
                neighborIndex++;
            }
            if (!found) {
                if (this._open.length > 0) {
                    currentNode = this._open.splice(this.getMin(), 1)[0];
                    continue;
                }
                return [];
            }
        }
        this.drawPath();
        return this._path;
    }

    private getNeighbors(node: any): any[] {
        let neighbors: any[] = [];
        let directions: any[] = [
            [-1, 0], [0, -1], [1, 0], [0, 1],
            [-1, -1], [1, -1], [-1, 1], [1, 1]
        ];
        for (let direction of directions) {
            let y = node.y + direction[0];
            let x = node.x + direction[1];
            if (x >= 0 && x < this._w && y >= 0 && y < this._h) {
                neighbors.push(this._map[y][x]);
            }
        }
        return neighbors;
    }

    private initBlock() {
        let count: number = this._updateNodes.length;
        for (let i: number = 0; i < count; i++) {
            let node: any = this._updateNodes.pop();
            this._map[node.y][node.x].open = false;
            this._map[node.y][node.x].block = false;
            this._map[node.y][node.x].value_g = 0;
            this._map[node.y][node.x].value_h = 0;
            this._map[node.y][node.x].value_f = 0;
            this._map[node.y][node.x].value_k = null;
        }
        this._open = [];
    }

    private count(param1: any, param2: any) {
        let _loc_3: number = 0;
        if (!param1.block) {
            _loc_3 = param2.value_g + 10;
            if (Math.abs(param1.x - param2.x) == 1 && Math.abs(param1.y - param2.y) == 1) {
                _loc_3 = param2.value_g + 14;
            } else {
                _loc_3 = param2.value_g + 10;
            }
            if (param1.x > param2.x && param1.y < param2.y) {
                if (this._map[param1.y][(param1.x - 1)].value == 1 && this._map[(param1.y + 1)][param1.x].value == 1) {
                    _loc_3 = _loc_3 + 10000;
                }
            } else if (param1.x > param2.x && param1.y > param2.y) {
                if (this._map[param1.y][(param1.x - 1)].value == 1 && this._map[(param1.y - 1)][param1.x].value == 1) {
                    _loc_3 = _loc_3 + 10000;
                }
            } else if (param1.x < param2.x && param1.y > param2.y) {
                if (this._map[param1.y][(param1.x + 1)].value == 1 && this._map[(param1.y - 1)][param1.x].value == 1) {
                    _loc_3 = _loc_3 + 10000;
                }
            } else if (param1.x < param2.x && param1.y < param2.y) {
                if (this._map[(param1.y + 1)][param1.x].value == 1 && this._map[param1.y][(param1.x + 1)].value == 1) {
                    _loc_3 = _loc_3 + 10000;
                }
            }
            if (param1.open) {
                if (param1.value_g >= _loc_3) {
                    param1.value_g = _loc_3;
                    this.ghf(param1);
                    param1.value_k = param2;
                }
            } else {
                this.addToOpen(param1);
                param1.value_g = _loc_3;
                this.ghf(param1);
                param1.value_k = param2;
            }
            this._updateNodes.push(param1);
        }
    }

    private resetNodes() {
        while (this._updateNodes.length > 0) {
            let node = this._updateNodes.pop();
            node.open = false;
            node.block = false;
            node.value_g = 0;
            node.value_h = 0;
            node.value_f = 0;
            node.value_k = null;
        }
        this._open = [];
    }
    
    private calculateCost(currentNode: any, previousNode: any) {
        let cost = previousNode.value_g + 10;
        if (Math.abs(currentNode.x - previousNode.x) == 1 && Math.abs(currentNode.y - previousNode.y) == 1) {
            cost += 4;
        }
        if (currentNode.open) {
            if (currentNode.value_g >= cost) {
                currentNode.value_g = cost;
                this.calculateHeuristic(currentNode);
                currentNode.value_k = previousNode;
            }
        } else {
            this._open.push(currentNode);
            currentNode.open = true;
            currentNode.value_g = cost;
            this.calculateHeuristic(currentNode);
            currentNode.value_k = previousNode;
        }
        this._updateNodes.push(currentNode);
    }
    
    private calculateHeuristic(node: any) {
        let dx = Math.abs(node.x - this._endPoint.x);
        let dy = Math.abs(node.y - this._endPoint.y);
        node.value_h = 10 * (dx + dy);
        node.value_f = node.value_g + node.value_h;
    }

    private _updateNodes: any[] = [];
    private _count: number = 0;
    private drawPath() {
        let count = 0;
        let currentNode = this._endPoint;
        while (currentNode != this._startPoint) {
            count++;
            if (count > 1000) {
                this._path = [];
                break;
            }
            this._path.unshift(new Laya.Point(currentNode.x, currentNode.y));
            currentNode = currentNode.value_k;
        }
        this._path.unshift(new Laya.Point(currentNode.x, currentNode.y));
    }

    private addToOpen(node: any) {
        this._open.push(node);
        node.open = true;
    }

    private ghf(param1: any) {
        let _loc_2: any = Math.abs(param1.x - this._endPoint.x);
        let _loc_3: any = Math.abs(param1.y - this._endPoint.y);
        param1.value_h = 10 * (_loc_2 + _loc_3);
        param1.value_f = param1.value_g + param1.value_h;
        return;
    }

    private getMin(): number {
        let _loc_1: any = this._open.length;
        let _loc_2: number = 100000;
        let _loc_3: number = 0;
        let _loc_4: number = 0;
        while (_loc_4 < _loc_1) {
            if (_loc_2 > this._open[_loc_4].value_f) {
                _loc_2 = this._open[_loc_4].value_f;
                _loc_3 = _loc_4;
            }
            _loc_4++;
        }
        return _loc_3;
    }


}
