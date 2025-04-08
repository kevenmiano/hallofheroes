
//拖拽类型
export enum DragType {
    SKILL = 0x000001,
    BAG,
    ALLOCATE,
    RUNE,
    PET_AWAKEN_SKILL,
    TALENT,
}

/**
* @author:pzlricky
* @data: 2021-03-01 12:17
* @description 拖拽对象
*/
export interface DragObject {

    dragType: DragType;
    dragEnable: boolean;
    
    getDragType():DragType;

    setDragType(value:DragType);

    getDragEnable(): boolean;

    setDragEnable(value: boolean);

    getDragData():any;

    setDragData(value:any);

}