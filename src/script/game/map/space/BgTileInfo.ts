import ResMgr from "../../../core/res/ResMgr";

/**
import { Node } from './../../MapEngine/datas/Node';
	 * 贴片信息。
	 * 
	 * @date 2012-10-12 下午12:20:46
	 * @ver 1.0
	 * @description
	 */
export class BgTileInfo {
	private _tx: number = 0;
	private _ty: number = 0;
	private _x: number = 0;
	private _y: number = 0;
	private _key: string = "";
	private _isLoaded: boolean = false;
	private _size: number = 0;
	private _tileView: Laya.Sprite = new Laya.Sprite();
	public mapTemplate: number = 0;
	public mapFileId: number = 0;
	private _parent: Laya.Sprite;
	private _url: string = "";

	constructor(tx: number, ty: number, size: number, mapId: number, mapFileId: number, parent: Laya.Sprite, isMapTile: boolean = false) {
		this._tx = tx;
		this._ty = ty;
		this._parent = parent;
		this._size = size;
		if (isMapTile) {
			this._key = (this._ty + "_" + this._tx);
		}
		else {
			this._key = (this._tx + "_" + this._ty);
		}
		this._x = tx * size;
		this._y = ty * size;
		this._tileView.x = this._x;
		this._tileView.y = this._y;
		this.mapTemplate = mapId;
		this.mapFileId = mapFileId;
	}

	public get url(): string {
		return this._url;
	}

	public set url(value: string) {
		this._url = value;
		if (this._url) {
			this._isLoaded = true;
			this._tileView.texture = ResMgr.Instance.getRes(value);
		}
	}


	public addToParent(v: boolean) {
		if (v) {
			this._parent.addChild(this._tileView);
		} else {
			this._tileView.removeSelf();
		}
	}

	public getTitleView() {
		return this._tileView;
	}

	public dispose() {
		this.addToParent(false);
		ResMgr.Instance.releaseRes(this._url);
		this._tx = 0;
		this._ty = 0;
		this._x = 0;
		this._y = 0;
		this._key = "";
		this._url = "";
		this._isLoaded = false;
	}

	/**
	 * 贴片的长宽。 
	 * 
	 */
	public get size(): number {
		return this._size;
	}

	/**
	 * 是否被加载到本地过（浏览器或者*.sol）。
	 */
	public get isLoaded(): boolean {
		return this._isLoaded;
	}
	/**
	 * @private
	 */
	public set isLoaded(value: boolean) {
		this._isLoaded = value;
	}

	public get y(): number {
		return this._y;
	}

	public set y(value: number) {
		this._y = value;
	}

	public get x(): number {
		return this._x;
	}

	public set x(value: number) {
		this._x = value;
	}
	/**
	 * 图片key值。<br>
	 * 例如在（0, 0）位置的图片key值为“0_0”。
	 */
	public get key(): string {
		return this._key;
	}

	public get ty(): number {
		return this._ty;
	}

	public get tx(): number {
		return this._tx;
	}

}
