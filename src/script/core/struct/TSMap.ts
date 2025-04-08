/**
 *
 * @cgw  不能使用number 作为key。 
 *
 */
export default class TSMap<K,T> {
	private value = {};
	private count: number;
	public constructor() {
		this.init();
	}
	private init() {
		this.value = {};
		this.count = 0;
	}
	public get values() {
		return this.value;
	}

	/**
	 * 如果对象实现了Cloneable接口 会调用克隆函数返回副本
	 * 否则返回对象本身。
	 */
	getArray(): T[] {
		let array: T[] = [];
		for (const key in this.value) {
			if (this.value.hasOwnProperty(key)) {
				const element = this.value[key];
				// if (element.clone) {
				// 	array.push(element.clone());
				// } else {
				array.push(element);
				// }

			}

		}
		return array;
	}

	forEach(func: (key: string, value: T) => void) {
		for (const key in this.value) {
			if (this.value.hasOwnProperty(key)) {
				func(key, this.value[key]);
			}
		}
	}

	keySet(): string[] {
		let array = [];
		for (const key in this.value) {
			array.push(key);
		}
		return array;
	}

	public set(key: any, value: any) {
		key = "" + key;
		if (!this.has(key)) {
			this.count++;
		}
		this.value[key] = value;
	}

	public put(key, value: T) {
		key = "" + key;
		this.set(key, value);
	}
	public has(key) {
		key = "" + key;
		return this.value[key] != null && this.value[key] != undefined;
	}
	public get(key: any): T {
		key = "" + key;
		return this.value[key];
	}

	remove(key): T {
		key = "" + key;
		return this.delete(key);
	}

	public delete(key): T {
		key = "" + key;
		let value = this.value[key]
		this.value[key] = null;
		delete this.value[key];
		this.count--;
		return value;
	}
	public release() {
		for (let key in this.value) {
			this.value[key].release();
		}
	}
	public size(): number {
		return this.count;
	}
	public clear() {
		for (let key in this.value) {
			this.delete(key);
		}

	}

	//tsMap合并 相同key替换
	public add(map: TSMap<K,T>) {
		map.forEach((value, key) => {
			this.set(key, value);
		})
	}

}
