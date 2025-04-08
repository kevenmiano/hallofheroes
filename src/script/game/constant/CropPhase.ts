// @ts-nocheck
/**
 * 作物状态的枚举
 */	
export enum CropPhase {
    /**
     *无 
    */
    NONE = 1,
    /**
     *成长中 
     */
    GROW = 2,
    /**
     *成熟 
     */
    MATURE = 3,
    /**
     *枯萎 
     */
    DIE = 4,
}