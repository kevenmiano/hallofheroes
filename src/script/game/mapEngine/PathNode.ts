
	/**
	 *  A*寻路中的节点对象
	 * 
	 */	
	export class PathNode
	{
		public x:number;
		public y:number;
		public isInOpen:boolean;
		public isInClose:boolean;
		public g:number;
		public h:number;
		public f:number;
		public parentNode:PathNode;
		
		constructor(x:number, y:number)
		{
			this.x = x;
			this.y = y;
			this.isInOpen = false;
			this.isInClose = false;
			this.g = 0;
			this.h = 0;
			this.f = 0;
			this.parentNode = null;
		}
		public update(x:number,y:number)
		{
			this.x = x;
			this.y = y;
			this.isInOpen = false;
			this.isInClose = false;
			this.g = 0;
			this.h = 0;
			this.f = 0;
			this.parentNode = null;
		}
	}