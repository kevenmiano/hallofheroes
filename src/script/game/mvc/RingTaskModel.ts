// @ts-nocheck
import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import { SimpleDictionary } from '../../core/utils/SimpleDictionary';

	export default class RingTaskModel extends GameEventDispatcher
	{
		private _rewardNum:number = 0;
		private _hasAccessList:SimpleDictionary;
		
		constructor()
		{
			super();
			this._hasAccessList = new SimpleDictionary;
		}


		/** 本周当前环任务的环数 */
		public get rewardNum():number
		{
			return this._rewardNum+1;
		}

		/**
		 * @private
		 */
		public set rewardNum(value:number)
		{
			this._rewardNum = value;
		}

		/** 已经接取的环任务 */
		public get hasAccessList():SimpleDictionary
		{
			return this._hasAccessList;
		}

		/**
		 * @private
		 */
		public set hasAccessList(value:SimpleDictionary)
		{
			this._hasAccessList = value;
		}
	}