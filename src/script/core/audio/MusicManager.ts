import BaseAudioManager from "./BaseAudioManager";
import Logger from '../logger/Logger';

/**
 * https://ldc2.layabox.com/doc/?language=zh&nav=zh-ts-1-7-0
 * playMusic方法只能同时播放一个音频文件。
 */
export default class MusicManager extends BaseAudioManager {
    musicName: string = "";
    protected state: number = 0;
    protected soundchannel: Laya.SoundChannel

    play(name: string): Laya.SoundChannel {
        if (this.musicName == name) {
            return;
        }
        this.musicName = name;
        this.soundchannel = Laya.SoundManager.playMusic(this.musicName, 0);
        Logger.log("play music 播放音乐",this.musicName);
        return this.soundchannel;
    }

    getMaxNum() {
        return 1;
    }

    pause() {
        if (this.soundchannel) {
            Logger.log("pauseMusic 暂停音乐");
            this.soundchannel.pause()
        }else
        {
            Logger.log("Music暂停音乐无效",this.soundchannel)
        }
    }

    resume() {
        try {
            //@ts-ignore
            if (this.soundchannel && this.soundchannel.audioBuffer) {
                this.soundchannel.resume()
                Logger.log("resumeMusic恢复音乐成功",this.soundchannel)
            }else{
                Logger.log("resumeMusic恢复音乐无效",this.soundchannel)
            }
        } catch (error) {
            Logger.error('resume  error');
            Logger.log("resumeMusic error");
        }

    }

    stop() {
        this.musicName = "";
        this.soundchannel = null;
        try {
            Laya.SoundManager.stopMusic();
            Logger.log("stop music 停止音乐");
        } catch (error) {
            Logger.error('当前无音效');
        }
    }

    setVolume(count: number) {
        Laya.SoundManager.setMusicVolume(count);
    }

    isPlaying() {
        return this.soundchannel != null;
    }

    clear() {
        this.stop();
    }
}
