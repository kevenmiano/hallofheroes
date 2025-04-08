import GameEventDispatcher from "../../core/event/GameEventDispatcher";

export class NotificationManager extends GameEventDispatcher {

    private static ins: NotificationManager;

    static get Instance(): NotificationManager {
        if (!this.ins) {
            this.ins = new NotificationManager();
        }
        return this.ins;
    }

    public sendNotification(eventName: any, data?: any, data2?: any, data3?: any) {
        this.dispatchEvent(eventName, data, data2, data3);
    }

}