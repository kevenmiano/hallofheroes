// @ts-nocheck
import Logger from "../../../../core/logger/Logger";
import { Avatar } from '../../../avatar/view/Avatar';
import { DisplayObject } from "../../../component/DisplayObject";
import { ResourceLoaderInfo } from "../../avatar/data/ResourceLoaderInfo";
import { HeroAvatar } from "../../avatar/view/HeroAvatar";
import ISelectMovie from "../../space/interfaces/ISelectMovie";
import { AvatarBaseView } from "./AvatarBaseView";
import ResMgr from '../../../../core/res/ResMgr';
import { RefCountManager } from '../../../managerRes/RefCountManager';
import { ResRefCountManager } from '../../../managerRes/ResRefCountManager';
import { LoaderHeaderList } from "../../../roadComponent/loader/LoaderHeaderList";
import { AvatarPosition } from '../../../avatar/data/AvatarPosition';


export class HeroAvatarView extends AvatarBaseView implements ISelectMovie {
    protected stepX: number = 0;
    protected stepY: number = 0;
    protected isJoyStickWalk = false;
    protected _angle: number = 0;
    protected _endPoint: Laya.Point;
    protected _bodyInfo: ResourceLoaderInfo
    protected _mountInfo: ResourceLoaderInfo

    /**
     * 存放该角色所有准备要加载的资源信息
     */
    protected _resUnloadMap: Map<string, ResourceLoaderInfo> = new Map();
    /**
     * 存放该角色目前显示的资源信息 
     */
    protected _resMap: Map<string, ResourceLoaderInfo> = new Map();

    protected loaderCompleteHandler(res: any, info: ResourceLoaderInfo) {
        if (this.destroyed) return;

        if (!res) {
            Logger.warn("[HeroAvatarView]loaderCompleteHandler failed", info)
            /**
             * 有些路径存在, 但是实际无资源需要隐藏
             */
            if (this._avatar) {
                (<HeroAvatar>this._avatar).showAvatar(false, info.position);
            }
            return
        }

        /**
         * 1提前保存
         */
        LoaderHeaderList.avatarShowNamePos[info.url] = res.extra;

        /**
         * 2加载默认资源后又立马加载变身资源导致人物形象渲染出错
         */
        if (this.morphFilter(info)) return;

        /**
         * 3加载完成后显示部位 并修正站立坐骑显示信息
         */
        if (this._avatar) {
            (<HeroAvatar>this._avatar).showAvatar(true, info.position);
            (<HeroAvatar>this._avatar).fixStandPosMountWalk();
        }

        /**
         * 保存正常或变身的info
         */
        if (info.position == AvatarPosition.BODY) {
            this._bodyInfo = info;
        }
        if (info.position == AvatarPosition.MOUNT) {
            this._mountInfo = info;
        }

        // 更新某个装备会进好几次 这里过滤一下 
        let skip = false;
        //forEach优化
        // this._resMap.forEach((ele, pos) => {
        //     if (pos == info.position && ele.url == info.url) {
        //         skip = true;
        //     }
        // });
        //forEach优化--
        for (let [pos, ele] of this._resMap.entries()) {
            if (pos == info.position && ele.url == info.url) {
                skip = true;
                break;
            }
        }
        if (skip) return;

        this.checkRemovePartRes(info.position, info);

        // Logger.info("[HeroAvatarView]loaderCompleteHandler", this.objName, info.url)
        // 引用计数+1
        ResRefCountManager.getRes(info.url)

        if (this._avatar) {
            info.preUrl = res.meta ? res.meta.prefix : "";
            (<HeroAvatar>this._avatar).loaderCompleteHandler(res, info);
        }
        
        this.layoutView();

        // Logger.xjy("[HeroAvatarView]", info.url, this._avatar && this._avatar.sizeType)
    }

    public execute() {
        super.execute();
        if (this._avatar && this._isPlaying) {
            if (!this.isJoyStickWalk) {
                this._avatar.run();
                if (!this._isStand) this._avatar.state = Avatar.WALK;
            } else {
                this.stepX = this.stepY = 0
            }
        }
    }

    protected walkOver() {
        super.walkOver();
        if (!this.isJoyStickWalk) {
            this.standImp();
        }
    }

    protected standImp() {
        if (this._avatar) this._avatar.state = Avatar.STAND;
    }

    protected nextWalk(point: Laya.Point) {
        let curTilePos = this.getTilePos()

        if (point.x == curTilePos.x && point.y == curTilePos.y) {
            return
        }

        this._nextPoint = new Laya.Point();
        this._nextPoint.x = point.x;
        this._nextPoint.y = point.y;
        this._endPoint = new Laya.Point(this._nextPoint.x * 20 + 10, this._nextPoint.y * 20 + 10);

        let curTilePosX = curTilePos.x * 20 + 10
        let curTilePosY = curTilePos.y * 20 + 10


        let deltaY = this._endPoint.y - curTilePosY
        let deltaX = this._endPoint.x - curTilePosX
        this._angle = Math.atan2(this._endPoint.y - curTilePosY, this._endPoint.x - curTilePosX);

        if (Math.abs(deltaX) <= 20 && Math.abs(deltaY) <= 20) {
            return
        }
        let tempAngle: number = (this._angle * 180 / Math.PI);
        if (tempAngle < 0) tempAngle += 360;

        this.updateDirection(tempAngle);

        this.stepX = Math.round(this._info.speed * Math.cos(this._angle))
        this.stepY = Math.round(this._info.speed * Math.sin(this._angle))

        let distance: number = this._endPoint.distance(this.x, this.y);
        this._info.totalFrame = parseInt((distance / this._info.speed).toString());
        let toX: number = this.x + this._info.totalFrame * this.stepX;
        let toY: number = this.y + this._info.totalFrame * this.stepY;

        if (!(toX >= this._nextPoint.x * 20 && toX < (this._nextPoint.x + 1) * 20 &&
            toY >= this._nextPoint.y * 20 && toY < (this._nextPoint.y + 1) * 20)) {
            this._info.currentFrame = this._info.totalFrame + 1;
        }

        this._info.currentFrame = 0;
        if (this._info.totalFrame <= 0) {
            return;
        }
    }

    protected playMovie() {
        this.x += this.stepX;
        this.y += this.stepY;
    }

    public beginSelectMovie() {
        // _color = this._avatar.transform.colorTransform;
    }

    public resetSelectMovie() {
        // if(this._avatar)
        // {
        // 	if(_color)this._avatar.transform.colorTransform = _color;
        // 	this._avatar.filters = [];
        // }
    }

    public selectMovie(): DisplayObject {
        return this._avatar;
    }

    /**
     * 变身中 loaderCompleteHandler回调其他时装资源是错误的 需要过滤掉
     * @param info 
     * @returns 
     */
	protected morphFilter(info: ResourceLoaderInfo): boolean {
		if (!this._avatar) return false;
		if (this._avatar.isMorph) {
			if (info.position == AvatarPosition.BODY && info.isNpc) {
				return false;
			} else {
				// Logger.xjy("[HeroAvatarView]在变身中不加载该资源", info.url)
				return true;
			}
		}
		return false;
    }
    
    protected getPosYBySizeType(sizeType: number, flight: number = 0): number {
        if (!this._avatar) {
            return this.defShowNamePosY
        }

        if (this._showTranslucenceView) {
            return this.defTranslucenceNamePosY
        }

        let url: string = (this._bodyInfo ? this._bodyInfo.url : "");
        // 不在变身状态下的骑行状态需要取坐骑配置的showNamePosY
        if (this._isMounting && !this._avatar.isMorph) {
            url = (this._mountInfo ? this._mountInfo.url : "");
        }
        let obj: any = LoaderHeaderList.avatarShowNamePos[url];
        if (obj && obj.hasOwnProperty("showNamePosY") && obj.showNamePosY != 0) {
            return Number(obj.showNamePosY) + flight;
        }

        let posY: number = this.defShowNamePosY;
        switch (sizeType) {
            case 1:
                posY = -125;
                break;
            case 2:
                posY = -150;
                break;
            case 7:
                posY = -80;
                break;
            case 3:
            case 10:
                posY = -165;
                break;
        }
        return posY + flight;
    }

    protected addRes2UnloadMap(info: ResourceLoaderInfo) {
        let position = info.position;
        // 更新某个装备会进好几次 这里过滤一下 
        let skip = false;
        // this._resUnloadMap.forEach((ele, pos) => {
        //     console.log("addRes2UnloadMap--------")
        //     if (pos == info.position && ele.url == info.url) {      
        //         return skip = true;

        //     }
        // });

        //上面 forEach 循环整个数组
        for (let [pos, ele] of this._resUnloadMap.entries()) {
            if (pos == info.position && ele.url == info.url) {
                skip = true;
                break;
            }
        }

        if (skip) {
            return;
        }

        // 删掉该部位之前的
        let args = this._resUnloadMap.get(position)
        if (args) {
            RefCountManager.del(args.url)
        }
        this._resUnloadMap.set(position, info)

        RefCountManager.add(info.url)
    }

    private checkRemovePartRes(position: string, newArgs: ResourceLoaderInfo) {
        let args = this._resMap.get(position)
        if (args) {
            let bDestroy = ResRefCountManager.clearRes(args.url)
            if (bDestroy) {
                this._resMap.delete(position)
            }
        }
        this._resMap.set(position, newArgs)
    }

    public dispose() {
        this._resMap.forEach((args, part) => {
            // Logger.info("[HeroAvatarView]dispose", this.objName, args.url)
            ResRefCountManager.clearRes(args.url)
        });
        this._resMap.clear();

        this._resUnloadMap.forEach((args, part) => {
            let bDestroy = RefCountManager.del(args.url)
            if (bDestroy) {
                ResMgr.Instance.cancelLoadByUrl(args.url)
            }
        });
        this._resUnloadMap.clear();
        super.dispose();
    }
}