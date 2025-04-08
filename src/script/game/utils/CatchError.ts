

export class CatchError {


    public static init() {
        // 兼容处理
        // window.onerror = function (msg, url, line, col, error) {
        //     console.log("捕获到异常1: ", msg);
        //     return true;
        // }

        // 兼容处理
        // window.addEventListener('error', (error) => {
        //     console.log("捕获到异常3: ", error)
        //     return true;
        // })

        window.addEventListener("unhandledrejection", function (e: PromiseRejectionEvent) {
            // console.log('捕获到异常: ', e.reason.message);
            // console.log(e.reason.stack);
            // e.preventDefault();  /* 阻止异常向上抛出*/
            return true;
        });
    }

}