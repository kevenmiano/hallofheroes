// @ts-nocheck
import GemMazeGemInfoVO from "./GemMazeGemInfoVO";

/**
 * 宝石迷阵Model
 */
export default class GemMazeInfoVO{
        /**
		 * 保存25个宝石数据  GemMazeGemInfoVO
		 */		
		private  _gemArr:any; 
		/**
		 *当前积分 
		 */		
		public  score:number = 0;
		/**
		 * 剩余可移动次数
		 */		
		public  timesLeft:number = 0;
		/**
		 *剩余可购买次数 
		 */		
		public  buyTimesLeft:number = 0;
		/**
		 *剩余可协助次数 
		 */		
		public  helpTimesLeft:number = 0;
		/**
		 *玩家的夺宝奇兵玩法等级 
		 */		
		public  gemLevel:number = 0; 
		/**
		 *当前经验	 
		 */		
		public  curExp:number = 0; 
		/**
		 *当前等级经验上限 
		 */		
		public  maxExp:number = 0; 
		/**
		 * 宝箱领取状态, 转成二进制, 0未领取, 1已领取 
		 */		
		private  _boxMark:number = 0;
		private  _boxMarkArr:any = [];
		/**
		 *当前排名 
		 */		
		public  sort:number = 0; 
		
		/**
		 *周积分 
		 * 
		 */		
		public  weekScore:number = 0;

        constructor() {
            this._gemArr = [];
        }

        public get gemArr():Array<any>
		{
			return this._gemArr;
		}

		public set gemArr(value:Array<any>)
		{
			this._gemArr = value;
		}

        /** 
		 * 宝箱领取状态数组
		 */
		public get boxMarkArr():Array<any>
		{
			return this._boxMarkArr;
		}

		public set boxMark(value:number)
		{
			this._boxMark = value;
			this._boxMarkArr = [0,0,0,0,0];
			let str:string = this._boxMark.toString(2);
		
			for(let i = str.length - 1; i >= 0 ; i--)
			{
				if(i >= this._boxMarkArr.length) return;
				this._boxMarkArr[i] = Number(str.substr(str.length - 1 - i,1));
			}
		}

        //根据下标获取箱子是否已领取
		public getBoxStatusByIndex(_index:number):number
		{
			return 1;
		}
		
		/**
		 *根据index获取宝石信息 
		 */		
		public getGemMazeGemInfoVOByIndex(_index:number):GemMazeGemInfoVO
		{
			let gemInfo:GemMazeGemInfoVO;
			for(let i = 0; i < this.gemArr.length; i++)
			{
				if(this.gemArr[i].index == _index)
				{
					gemInfo = this.gemArr[i]; 
					break;
				}
			}
			return gemInfo;
		}


		
}