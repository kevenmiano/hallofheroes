import LayerMgr from '../../core/layer/LayerMgr';
import { EmLayer } from '../../core/ui/ViewInterface';
import MathHelper from '../../core/utils/MathHelper';
import Bezier from '../utils/Bezier';
export default class GoldFlyEff {

	public mSource: string
	public mCount: number = 10
	public mMax: number = 10
	public mGap: number = 30

	private m_Pool: GoldFlyEffItem[] = []
	private m_Play: GoldFlyEffItem[] = []

	private mRect: Laya.Rectangle;
	private mTx: number
	private mTy: number

	private create: number = 0
	private pCreate: number = 0
	private pt: number
	private play: boolean;

	private timeInterval: any = 0;

	public Play(rect: Laya.Rectangle, tx: number, ty: number) {
		this.mRect = rect
		this.mTx = tx
		this.mTy = ty

		this.StartTween()
	}

	private StartTween() {
		if (this.play) {
			return
		}
		this.play = true;
		this.t = this.getTimer();
		this.pt = this.getTimer();
		this.timeInterval = setInterval(this.Update.bind(this), 1000 / 24);

		this.m_Pool = []
		this.m_Play = []
	}

	private getTimer() {
		return new Date().getTime();
	}

	private StopTween() {
		if (!this.play) {
			return
		}
		this.play = false
		clearInterval(this.timeInterval);
		this.timeInterval = 0;
	}

	private t: number = 0;
	private Update(): boolean {
		let dt = this.t - this.pt;
		this.pt = this.t;
		this.t += 1000 / 240;
		for (let i = this.m_Play.length - 1; i >= 0; --i) {
			let item = this.m_Play[i]
			if (!item.Update(dt)) {
				Laya.stage.removeChild(item.mItem)
				this.m_Play.splice(i, 1)
				this.m_Pool.push(item)
			}
		}
		if (this.create < this.mCount && this.m_Play.length < this.mMax && this.getTimer() - this.pCreate > this.mGap) {
			++this.create
			this.pCreate = this.getTimer()
			let item = this.m_Pool.pop() || new GoldFlyEffItem
			item.Init(this.mSource,
				MathHelper.limitInteger(this.mRect.x, this.mRect.x + this.mRect.width),
				MathHelper.limitInteger(this.mRect.y, this.mRect.y + this.mRect.height),
				this.mTx,
				this.mTy,
				MathHelper.limitInteger(20, 200), MathHelper.limitInteger(20, 200),
				0.25,
				0.55,
				Math.random() > 0.5 ? 1 : -1,
				5
			)
			Laya.stage.addChild(item.mItem);
			this.m_Play.push(item)
		}
		if (!this.m_Play.length && this.create >= this.mCount) {
			this.StopTween()
		}
		return false
	}
}

export class GoldFlyEffItem {

	public mItem: Laya.Sprite;

	private m_Ease: Function
	private m_Duration: number = 0;
	private m_Time: number = 0

	private bezier: Bezier

	private m_Delay: number = 0;
	private sx:number = 0;
	private sy:number = 0;

	public Init(src: string, sx: number, sy: number, ex: number, ey: number, h1: number, h2: number, p1: number, p2: number, way: number, speed: number, ease: Function = null) {
		if (!this.mItem) {
			this.mItem = new Laya.Sprite();
		}
		this.mItem.loadImage(src);
		this.sx = sx;
		this.sy = sy;
		let dx = ex - sx
		let dy = ey - sy

		// let h1 = 100
		// let h2 = 100

		// let p1 = 0.25
		// let p2 = 0.75

		this.m_Ease = ease
		this.m_Duration = Math.ceil(Math.sqrt(dx * dx + dy * dy) / speed)

		let pos = new Laya.Point(sx, sy);
		MathHelper.Normalize(dx, dy, pos)

		let v2 = {
			x: way * pos.y,
			y: -1 * way * pos.x
		}
		let arr = [
			{ x: sx, y: sy },
			{ x: sx + dx * p1, y: sy + dy * p1 },
			{ x: sx + dx * p2, y: sy + dy * p2 },
			{ x: ex, y: ey },
		]
		arr[1].x += v2.x * h1;
		arr[1].y += v2.y * h1;

		arr[2].x += v2.x * h2;
		arr[2].y += v2.y * h2;
		this.bezier = new Bezier(arr)


		this.mItem.scaleX = this.mItem.scaleY = 1;
		this.mItem.x = sx;
		this.mItem.y = sy + 80;

		this.m_Delay = 30;
		Laya.Tween.to(this.mItem, {
			scaleX: 1,
			scaleY: 1,
			y: sy,
		}, this.m_Delay, undefined)

	}

	public Update(delta: number): boolean {
		if (this.m_Delay > 0) {
			if ((this.m_Delay -= delta) > 0) {
				return true
			}
		}
		this.m_Time += delta
		let t = this.m_Time / this.m_Duration
		if (t >= 1) {
			t = 1
		}

		if (this.m_Ease) {
			t = this.m_Ease(t)
		}

		let pos = new Laya.Point(this.sx, this.sy);
		this.bezier.Get(t, pos)
		this.mItem.x = pos.x
		this.mItem.y = pos.y

		return t < 1
	}

}