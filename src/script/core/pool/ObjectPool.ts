

export default class ObjectPool<T>{

    private buffList: T[] = []

    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    get(func: () => T) {
        let item = this.buffList.length > 0 ? this.buffList.shift() : func();
        return item;
    }

    put(obj: T) {
        this.buffList.push(obj)
    }

    size() {
        return this.buffList.length
    }

    destroy() {
        this.buffList.length = 0;
    }

}