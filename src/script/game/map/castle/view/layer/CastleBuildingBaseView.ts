/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 16:22:29
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-14 15:18:44
 * @Description: 建筑基类  TODO内城的后面也改用这个
 */

import AudioManager from "../../../../../core/audio/AudioManager";
import Logger from "../../../../../core/logger/Logger";
import ResMgr from "../../../../../core/res/ResMgr";
import { Sequence } from "../../../../../core/task/Sequence";
import Utils from "../../../../../core/utils/Utils";
import { DisplayObject } from "../../../../component/DisplayObject";
import { MovieClip } from "../../../../component/MovieClip";
import { t_s_buildingtemplateData } from "../../../../config/t_s_buildingtemplate";
import { SoundIds } from "../../../../constant/SoundIds";
import { AnimationManager } from "../../../../manager/AnimationManager";
import { PathManager } from "../../../../manager/PathManager";
import HitTestUtils from "../../../../utils/HitTestUtils";
import CastleConfigUtil from "../../utils/CastleConfigUtil";

export default class CastleBuildingBaseView extends DisplayObject {
	public view = new DisplayObject();

	/** 建筑外观png */
	public buildFullUrl: string = "";
	/** 建筑装饰动画json */
	public buildPartUrlArr: string[] = [];
	/** 缓存资源、动画以便释放 */
	public static resUrlMap: Map<string, boolean> = new Map();
	public static aniNameMap: Map<string, boolean> = new Map();

	public notEffect: boolean = false;
	public sonType: number = 0;
	public templete: t_s_buildingtemplateData;

	constructor(sonType: number, templete: t_s_buildingtemplateData) {
		super()
		this.sonType = sonType;
		this.templete = templete;
		this.addChild(this.view);
		this.view.autoSize = true;
		if (templete) {
			this.buildPartUrlArr = this.templete.PicPath.split("|");
			this.buildFullUrl = PathManager.getCastleBuildResPath(this.buildPartUrlArr.shift());
			CastleBuildingBaseView.resUrlMap.set(this.buildFullUrl, true);
		}
	}

	public addClickEvent() {
		this.view.on(Laya.Event.CLICK, this, this.mouseClickHandler)
	}

	public removeClickEvent() {
		this.view.off(Laya.Event.CLICK, this, this.mouseClickHandler)
	}

	public loadBuildComplete() {
		// Logger.info("加载建筑完成", this.sonType, this.templete && this.templete.BuildingNameLang)
		this.updateInfoView()
		this.updateBuildView()
		this.loadBuildEffect()
		this.addClickEvent()
	}

	/** 建筑显示信息 */
	public updateInfoView() {
		
	}

	/** 建筑外观图 */
	public updateBuildView() {
		let path = this.buildFullUrl
		// 原生iOS上getRes获取的单张图片，需要改后缀
		if (Utils.useAstc) {
			if (path.includes(".png")) {
				path = path.replace(".png", ".ktx");
			} else if (path.includes(".jpg")) {
				path = path.replace(".jpg", ".ktx");
			}
		}

		this.view.graphics.clear();
		this.view.graphics.loadImage(path, 0, 0, 0, 0, this.initBuildViewComplete.bind(this));
	}

	public initBuildViewComplete() {
	}

	/**
	 * 建筑装饰动画
	 * 目前就两个建筑有动画 不使用队列加载
	 */
	public loadBuildEffect() {
		if (this.notEffect) return;
		if (!this.templete) return;

		if (this.buildPartUrlArr.length > 0) {
			let resUrlArr = []
			for (let index = 0; index < this.buildPartUrlArr.length; index++) {
				let url = PathManager.getCastleBuildResPath(this.buildPartUrlArr[index]);
				resUrlArr[index] = { url: url, type: Laya.Loader.ATLAS, priority: 1 };
				CastleBuildingBaseView.resUrlMap.set(url, true);
			}

			ResMgr.Instance.loadGroup(resUrlArr, () => {
				for (let index = 0; index < this.buildPartUrlArr.length; index++) {
					let url = PathManager.getCastleBuildResPath(this.buildPartUrlArr[index]);
					let res = ResMgr.Instance.getRes(url);
					if (res) {
						let preUrl = res.meta.prefix;
						let cacheName = preUrl;
						let sucess = AnimationManager.Instance.createAnimation(preUrl, "", 0, "", AnimationManager.MapPhysicsFormatLen);
						let mc = new MovieClip(cacheName);
						mc.gotoAndPlay(0, true);
						this.addChildAt(mc, 1);
						let pos: Laya.Point = CastleConfigUtil.Instance.getBuildEffectPos(this.sonType, index);
						if (pos) mc.pos(pos.x, pos.y);
						CastleBuildingBaseView.aniNameMap.set(cacheName, true);
					}
				}
			});
		}
	}

	public mouseClickHandler(evt: Laya.Event): boolean {
		let globalPoint = new Laya.Point(evt.stageX, evt.stageY);
		let localPoint = this.globalToLocal(globalPoint);
		let isInArea = HitTestUtils.hitTest(this, localPoint);
		if (!isInArea) return false;

		AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
		return true
	}

	public dispose() {
		this.removeClickEvent()
	}
}

/**建筑加载任务 */
export class CastleBuildingBaseViewLoadTask extends Sequence {
	private view: CastleBuildingBaseView;

	constructor(view: CastleBuildingBaseView) {
		super();
		this.view = view;
	}

	protected onExecute() {
		super.onExecute();
		if (!this.view.buildFullUrl) {
			this.endAction(true);
			return;
		}
		ResMgr.Instance.loadRes(this.view.buildFullUrl, (res) => {
			this.view.loadBuildComplete();
			this.endAction(true);
		}, null, Laya.Loader.IMAGE);
	}
}
