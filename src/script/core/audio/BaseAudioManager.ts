// @ts-nocheck
import TSMap from "../struct/TSMap";



export default abstract class BaseAudioManager {

    protected sourcePool: TSMap<string, any> = new TSMap();

    constructor() {
        
    }

    clear() {

    }
    
    //或者支持的最大音频数量。
    abstract getMaxNum():number;

    play(name: string, loops?: number):Laya.SoundChannel {
        return
    }

    abstract pause(name?: string);

    abstract resume(name?: string);

    abstract stop(name?: string);

    abstract setVolume(count: number);

    abstract isPlaying(): boolean;
    
}
