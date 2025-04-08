import GameEventDispatcher from "./GameEventDispatcher";

export default class GlobalEvent extends GameEventDispatcher {

    static EVENT_HIDE: string = 'EVENT_HIDE'

    static EVENT_SHOW: string = 'EVENT_SHOW'

    static CHANGE_AD_STATE: string = 'EVENT_CHANGE_AD_STATE'

    static POP_VIEW: string = 'POP_VIEW'

    static CHANGE_LANG: string = 'CHANGE_LANG'

    static RM_WINDOW: string = "EM_WINDOW"

    private static ins: GlobalEvent;

    static Instance(): GlobalEvent {
        if (!this.ins) {
            this.ins = new GlobalEvent();
        }
        return this.ins;
    }

    pause() {
        this.emit(GlobalEvent.EVENT_HIDE)
    }

    resume() {
        this.emit(GlobalEvent.EVENT_SHOW)
    }


    // changeAdState(state:RewardADState){
    //     this.publish(GlobalEvent.CHANGE_AD_STATE,state)
    // }

}
