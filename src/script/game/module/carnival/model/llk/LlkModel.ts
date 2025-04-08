import LlkInfo from "./LlkInfo";
import LlkNodeData from "./LlkNodeData";

/**
 * 连连看Model
 */
export default class LlkModel {
    public static LLK_INFO: string = "LlkModel.LLK_INFO";//收到连连看信息
    public static LLK_SORT: string = "LlkModel.LLK_SORT";//收到连连看排行榜
    public static ROW: number = 7;//行
    public static COLUMN: number = 10;//列
    private _list: LlkNodeData[];
    private _info: LlkInfo;

    constructor() {
        this._list = [];
        this.init();
    }

    private init() {
        for (var i: number = 0; i < LlkModel.ROW * LlkModel.COLUMN; i++) {
            var node: LlkNodeData = new LlkNodeData();
            node.row = Math.floor(i / LlkModel.COLUMN);
            node.col = i % LlkModel.COLUMN;
            this._list[i] = node;
        }
    }

    public get info(): LlkInfo {
        if (this._info == null) this._info = new LlkInfo();
        return this._info;
    }

    public get list(): LlkNodeData[] {
        return this._list;
    }
    /**
     * 判断两点是否可连通 
     * @return 
     */
    public checkByPos(node1: LlkNodeData, node2: LlkNodeData, signMc: boolean = false): boolean {
        //空值
        if (node1 == null || node2 == null) return false;
        //不标志动画时, 当有一个点的值为0, 则不连通
        if (signMc == false && (node1.val <= 0 || node1.val <= 0)) return false;
        //同一点
        if (node1.row == node2.row && node1.col == node2.col) return false;
        //同一值
        if (node1.val != node2.val) return false;
        //同一行
        if (node1.row == node2.row && this.connectRow(node1, node2)) {
            this.connectRow(node1, node2, signMc)
            return true;
        }
        //同一列
        if (node1.col == node2.col && this.connectCol(node1, node2)) {
            this.connectCol(node1, node2, signMc)
            return true;
        }
        //一个交点
        if (this.oneCorner(node1, node2, signMc)) return true;
        //两个交点
        if (this.twoCorner(node1, node2, signMc)) return true;
        return false;
    }

    /**
     * 判断两个交点的两点是否可连通
     * @param node1
     * @param node2
     * @return 
     */
    private twoCorner(node1: LlkNodeData, node2: LlkNodeData, signMc: boolean = false): boolean {
        if (node1.val != node2.val) return false;
        var corner1: LlkNodeData;
        var corner2: LlkNodeData;
        for (var i: number = 0; i < LlkModel.ROW; i++) {
            corner1 = this._list[i * LlkModel.COLUMN + node1.col];
            corner2 = this._list[i * LlkModel.COLUMN + node2.col];
            if (corner1.val > 0 || corner2.val > 0) continue;
            if (this.connectRow(corner1, corner2) == false) continue;
            if (this.connectCol(corner1, node1) && this.connectCol(corner2, node2)) {
                corner1.mcType = this.direction(node1, corner1, corner2);
                corner2.mcType = this.direction(corner1, corner2, node2);
                this.connectRow(corner1, corner2, signMc);
                this.connectCol(corner1, node1, signMc);
                this.connectCol(corner2, node2, signMc);
                return true;
            }
        }
        for (i = 0; i < LlkModel.COLUMN; i++) {
            corner1 = this._list[node1.row * LlkModel.COLUMN + i];
            corner2 = this._list[node2.row * LlkModel.COLUMN + i];
            if (corner1.val > 0 || corner2.val > 0) continue;
            if (this.connectCol(corner1, corner2) == false) continue;
            if (this.connectRow(corner1, node1) && this.connectRow(corner2, node2)) {
                corner1.mcType = this.direction(node1, corner1, corner2);
                corner2.mcType = this.direction(corner1, corner2, node2);
                this.connectCol(corner1, corner2, signMc);
                this.connectRow(corner1, node1, signMc);
                this.connectRow(corner2, node2, signMc);
                return true;
            }
        }
        return false;
    }

    /**
     * 判断一个交点的两点是否可连通
     * @param node1
     * @param node2
     * @return 
     */
    private oneCorner(node1: LlkNodeData, node2: LlkNodeData, signMc: boolean = false): boolean {
        var corner: LlkNodeData = this._list[node1.row * LlkModel.COLUMN + node2.col];
        if (corner.val == 0) {
            if (this.connectRow(corner, node1) && this.connectCol(corner, node2)) {
                corner.mcType = this.direction(node1, corner, node2);
                this.connectRow(corner, node1, signMc);
                this.connectCol(corner, node2, signMc);
                return true;
            }
        }
        corner = this._list[node2.row * LlkModel.COLUMN + node1.col];
        if (corner.val == 0) {
            if (this.connectRow(corner, node2) && this.connectCol(corner, node1)) {
                corner.mcType = this.direction(node1, corner, node2);
                this.connectRow(corner, node2, signMc);
                this.connectCol(corner, node1, signMc);
                return true;
            }
        }
        return false;
    }
    /**
     * 返回转角的类型
     * @param node1
     * @param corner
     * @param node2
     * @return 
     */
    private direction(node1: LlkNodeData, corner: LlkNodeData, node2: LlkNodeData): number {
        var dir: number = 5;
        var sameRow: LlkNodeData;
        var sameCol: LlkNodeData;
        if (corner.row == node1.row) {
            sameRow = node1;
            sameCol = node2;
        } else if (corner.row == node2.row) {
            sameRow = node2;
            sameCol = node1;
        }
        if (corner.col > sameRow.col) {
            if (corner.row > sameCol.row) {
                dir = 8;
            } else if (corner.row < sameCol.row) {
                dir = 7;
            }
        } else if (corner.col < sameRow.col) {
            if (corner.row > sameCol.row) {
                dir = 5;
            } else if (corner.row < sameCol.row) {
                dir = 6;
            }
        }
        return dir;
    }
    /**
     * 判断同一列的两点是否可连通
     * @param node1
     * @param node2
     * @return 
     */
    private connectCol(node1: LlkNodeData, node2: LlkNodeData, signMc: boolean = false): boolean {
        if (node1.col != node2.col) return false;
        var min: number = Math.min(node1.row, node2.row);
        var max: number = Math.max(node1.row, node2.row);
        for (var i: number = min + 1; i < max; i++) {
            if (this._list[i * LlkModel.COLUMN + node1.col] && this._list[i * LlkModel.COLUMN + node1.col].val > 0) return false;
            if (signMc) this._list[i * LlkModel.COLUMN + node1.col].mcType = 2;
        }
        return true;
    }

    /**
     * 判断同一行的两点是否可连通
     * @param node1
     * @param node2
     * @return 
     */
    private connectRow(node1: LlkNodeData, node2: LlkNodeData, signMc: boolean = false): boolean {
        if (node1.row != node2.row) return false;
        var min: number = Math.min(node1.col, node2.col);
        var max: number = Math.max(node1.col, node2.col);
        for (var i: number = min + 1; i < max; i++) {
            if (this._list[node1.row * LlkModel.COLUMN + i] && this._list[node1.row * LlkModel.COLUMN + i].val > 0) return false;
            if (signMc) this._list[node1.row * LlkModel.COLUMN + i].mcType = 1;
        }
        return true;
    }

    public clear() {
        this.init();
    }
}