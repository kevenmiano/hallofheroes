
export class MapGrid
{
	public static GRID_WIDTH:number = 5/2;
	public static GRID_HEIGHT:number = 5/2;
		
	public static getConvertWidth(value:number):number{
		return parseInt((value/MapGrid.GRID_WIDTH).toString());
	}
	public static getConvertHeight(value:number):number{
		return parseInt((value/MapGrid.GRID_HEIGHT).toString());
	}
	public static getConvertPoint(value:Laya.Point):Laya.Point{
		return new Laya.Point(parseInt((value.x/MapGrid.GRID_WIDTH).toString()),parseInt((value.y/MapGrid.GRID_HEIGHT).toString()));
	}
	public static getPositionString(value:string):string{
		return MapGrid.getConvertWidth(parseInt((value.split(",")[0]).toString())) + "," + MapGrid.getConvertHeight(parseInt((value.split(",")[1]).toString()));
	}
}