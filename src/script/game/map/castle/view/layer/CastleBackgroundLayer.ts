import Logger from '../../../../../core/logger/Logger';
import ResMgr from '../../../../../core/res/ResMgr';
import { Sequence } from '../../../../../core/task/Sequence';
import { ActionsExecutionMode, SequenceList } from '../../../../../core/task/SequenceList';
import ComponentSetting from '../../../../utils/ComponentSetting';
import { WorldBossHelper } from '../../../../utils/WorldBossHelper';
import CastleConfigUtil from '../../utils/CastleConfigUtil';
export default class CastleBackgroundLayer extends Laya.Sprite {
    protected loadComplete: boolean = false;
    protected _path: string = "";
    protected downLoadList: SequenceList;

    constructor() {
        super();
        this.loadComplete = false;
        this.initView();
    }

    protected initView() {
        this.autoSize = true;
        this._path = ComponentSetting.CASTEL_BACKUP_PIC_PATH;
        let parallel = new SequenceList(ActionsExecutionMode.RunInSequence);
        this.downLoadList = parallel;
        parallel = parallel.addTask(new CastleBackgroundLoaderTask(this._path, 0));
        new SequenceList(ActionsExecutionMode.RunInParallel)
            .addTask(parallel)
            .setComplete(Laya.Handler.create(this, (status: boolean) => {
                // Logger.base("背景加载---", status);
                if (this.destroyed || !status) return;

                let tex = ResMgr.Instance.getRes(this._path)
                if (WorldBossHelper.checkInOuterCityWarMap()) {
                    this.graphics.fillTexture(tex, 0, 0, CastleConfigUtil.MAP_RAW_WIDTH, CastleConfigUtil.MAP_RAW_HEIGHT)
                } else {
                    this.graphics.fillTexture(tex, 0, 0, CastleConfigUtil.MAP_SCENE_WIDTH, CastleConfigUtil.MAP_SCENE_HEIGHT, undefined, new Laya.Point(-(CastleConfigUtil.MAP_RAW_WIDTH - CastleConfigUtil.MAP_SCENE_WIDTH), 0));
                }
                this.loadComplete = true;
            })).execute(null);
    }

    resize() {
        // if (!this.loadComplete)
        //     return;
        // if (Resolution.gameWidth > this.width || Resolution.gameHeight > this.height) {
        //     let heightratio: number = Resolution.gameWidth / this.height;
        //     let widthRatio: number = Resolution.gameHeight / this.width;
        //     let scaleV = Math.max(heightratio, widthRatio);
        //     this.scaleX = this.scaleY = scaleV;
        //     Logger.log('CastleBackground Resize...')
        // } else {
        //     this.scaleX = this.scaleY = 1;
        // }
    }

    public dispose() {
        // this.destroy();不需要手动调用, ObjectUtils会调用。	
        this.texture = null;// this.loadImage,会设置texture; 必须要至空,当autoSize=true的时候且texture有值的时候, destory的时候会报错。引擎bug。
        this.loadComplete = false;
        this.downLoadList && this.downLoadList.clear();
        // this.removeSelf();//不需要手动调用,destory的时候, 会调用
    }
}

/**内城背景加载任务 */
export class CastleBackgroundLoaderTask extends Sequence {

    private resName: string = "";
    private loadIndex: number = 0;

    constructor(resName: string, index: number = 0) {
        super();
        this.resName = resName;
        this.loadIndex = index;
    }

    protected onExecute() {
        super.onExecute();
        let loadUrl = this.resName;
        if (this.loadIndex == 0) {
            ResMgr.Instance.loadRes(loadUrl, (res: Laya.Texture) => {
                if (!res) {
                    this.endAction(false);
                } else {
                    this.endAction(true);
                }
            });
        } else {
            ResMgr.Instance.loadRes(loadUrl, (res) => {
                Logger.log("加载完成:", loadUrl);
                if (!res) {
                    this.endAction(false);
                } else {
                    this.endAction(true);
                }
            }, null, Laya.Loader.IMAGE);
        }
    }

    protected onForcedStop() {
        let loadUrl = this.resName;
        ResMgr.Instance.cancelLoadByUrl(loadUrl);
        this.resName = "";
    }
}


