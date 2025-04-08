/**
 * 副本数据的缓存<br/>
 * 每次离开副本时保存当前副本的id, 及地表bitmap <br/>
 * 再次回到副本时可以依据这些值判断是否预加载过   <br/>
 * 当渲染地表或者退出副本时先要清空数据, 因为保存的是上次的数据
 *
 */
import ObjectUtils from "../../../../core/utils/ObjectUtils";

export class MapData
{

    public static mapId:number = 0;
    private static _mapBitmap:Laya.Sprite;//Image
    public static movePos:Laya.Point;
    public static stageWidth:number = 0;
    public static stageHeight:number = 0;

    private static _thumbnail:Laya.Sprite;//Image

    /**
     * 缩略图
     */
    public static get thumbnail():Laya.Sprite
    {
        return MapData._thumbnail;
    }

    /**
     * @private
     */
    public static set thumbnail(value:Laya.Sprite)
    {
        if(MapData._thumbnail)
        {
            ObjectUtils.disposeObject(MapData._thumbnail);
            MapData._thumbnail = null;
        }
        MapData._thumbnail = value;
    }

    public static get mapBitmap():Laya.Sprite
    {
        return MapData._mapBitmap;
    }

    public static fogBitmapDataCache:Laya.Texture;

    /**
     * 退出副本时清除
     *
     */
    public static clearData()
    {
        if(MapData._mapBitmap)
        {
            MapData._mapBitmap.destroy();
        }

        if(MapData.fogBitmapDataCache)
        {
            MapData.fogBitmapDataCache = null;
        }
        MapData._mapBitmap = null;
        MapData.movePos = null;
        MapData.mapId = 0;
        MapData.thumbnail = null;
        MapData.cleanPetTailClips();
    }

    /**
     * 进入副本保存
     * @param value
     *
     */
    public static set mapBitmap(value:Laya.Sprite)
    {
        if(value == MapData._mapBitmap)
        {
            return;
        }
        if(MapData._mapBitmap)
        {
            if(MapData._mapBitmap.parent)
            {
                MapData._mapBitmap.parent.removeChild(MapData._mapBitmap);
            }
            // MapData._mapBitmap.bitmapData.dispose();
        }
        if(value && value.parent)
        {
            value.parent.removeChild(value);
        }
        MapData._mapBitmap = value;
    }

    //地图公用的
    private static _petTailClips:any[];
    public static petTextures:any[];

    public static get petTailClips():any[]
    {
        // if (!MapData._petTailClips) {
        // 	MapData._petTailClips = [];
        // 	for (var i:number = 1; i < 20; i++) {
        // 		if (i % 2 == 1) {
        // 			var bmp:Bitmap = ComponentFactory.Instance.creat("asset.map.PetTail" + i);
        // 			var bpd:BitmapData = bmp.bitmapData.clone();
        // 			MapData._petTailClips[i-1] = bpd;
        // 			bmp.bitmapData.dispose();
        // 			bmp = null;
        // 		}
        // 	}
        // }
        return MapData._petTailClips;
    }

    private static cleanPetTailClips()
    {
        // if (!MapData._petTailClips) return;
        // for (var i:number = 0; i < MapData._petTailClips.length; i++) {
        // 	var bpd:BitmapData = MapData._petTailClips[i] as BitmapData;
        // 	if (bpd) {
        // 		bpd.dispose();
        // 	}
        // }
        // MapData._petTailClips = null;
    }

}