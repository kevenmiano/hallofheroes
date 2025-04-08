import FUI_LoginWayGuest from "../../../../../fui/Login/FUI_LoginWayGuest";

/**
 * 
 */
export class LoginWayGuest extends FUI_LoginWayGuest {

    protected onConstruct(): void {
        super.onConstruct();
    }

    onGuestEvent(target: any, callback: Function) {
        this.guestBtn.onClick(target, callback)
    }

    offGuestEvent(target: any, callback: Function) {
        this.guestBtn.offClick(target, callback)
    }

    onSwitchEvent(target: any, callback: Function) {
        this.accountBtn.onClick(target, callback)
    }

    offSwitchEvent(target: any, callback: Function) {
        this.accountBtn.offClick(target, callback)
    }
}