// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: battle/BattleReqMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.battle";

export interface BattleReqMsg {
  userId: number;
  battleId: string;
  armyId: number;
  otherObj: number;
}

function createBaseBattleReqMsg(): BattleReqMsg {
  return { userId: 0, battleId: "", armyId: 0, otherObj: 0 };
}

export const BattleReqMsg: MessageFns<BattleReqMsg> = {
  encode(message: BattleReqMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== 0) {
      writer.uint32(8).int32(message.userId);
    }
    if (message.battleId !== "") {
      writer.uint32(18).string(message.battleId);
    }
    if (message.armyId !== 0) {
      writer.uint32(24).int32(message.armyId);
    }
    if (message.otherObj !== 0) {
      writer.uint32(32).int32(message.otherObj);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): BattleReqMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBattleReqMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.battleId = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.armyId = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.otherObj = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BattleReqMsg {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      battleId: isSet(object.battleId) ? globalThis.String(object.battleId) : "",
      armyId: isSet(object.armyId) ? globalThis.Number(object.armyId) : 0,
      otherObj: isSet(object.otherObj) ? globalThis.Number(object.otherObj) : 0,
    };
  },

  toJSON(message: BattleReqMsg): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.battleId !== "") {
      obj.battleId = message.battleId;
    }
    if (message.armyId !== 0) {
      obj.armyId = Math.round(message.armyId);
    }
    if (message.otherObj !== 0) {
      obj.otherObj = Math.round(message.otherObj);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BattleReqMsg>, I>>(base?: I): BattleReqMsg {
    return BattleReqMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BattleReqMsg>, I>>(object: I): BattleReqMsg {
    const message = createBaseBattleReqMsg();
    message.userId = object.userId ?? 0;
    message.battleId = object.battleId ?? "";
    message.armyId = object.armyId ?? 0;
    message.otherObj = object.otherObj ?? 0;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
