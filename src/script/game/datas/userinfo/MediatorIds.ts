// @ts-nocheck
export default class MediatorIds{

    constructor() {
    }

    private static  ids : number = 0;
	public static  get id() : number
	{
		return this.ids ++;
	}
}