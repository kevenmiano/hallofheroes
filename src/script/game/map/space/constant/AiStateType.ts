// @ts-nocheck

export class AiStateType {
	public static BEELINE: number = 0x01;// beeline 
	public static DIJKSTRA: number = 0x02;// dijkstra
	public static STAND: number = 0x03;
	public static NPC_FOLLOW_STATE: number = 0x04;
	public static NPC_RANDOM_MOVE_STATE: number = 0x05;//随机移动
	public static NPC_CHASE_STATE: number = 0x06;//攻击
	public static NPC_BEING_VISIT: number = 0x07;//被访问中
	constructor() {
	}
}