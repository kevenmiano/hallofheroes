// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: army/BossMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.army";

export interface BossMsg {
  bossName: string;
  grade: number;
  type: number;
  posX: number;
  posY: number;
  leftTime: number;
  physicId: number;
  posId: number;
  state: number;
}

function createBaseBossMsg(): BossMsg {
  return { bossName: "", grade: 0, type: 0, posX: 0, posY: 0, leftTime: 0, physicId: 0, posId: 0, state: 0 };
}

export const BossMsg: MessageFns<BossMsg> = {
  encode(message: BossMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.bossName !== "") {
      writer.uint32(10).string(message.bossName);
    }
    if (message.grade !== 0) {
      writer.uint32(16).int32(message.grade);
    }
    if (message.type !== 0) {
      writer.uint32(24).int32(message.type);
    }
    if (message.posX !== 0) {
      writer.uint32(32).int32(message.posX);
    }
    if (message.posY !== 0) {
      writer.uint32(40).int32(message.posY);
    }
    if (message.leftTime !== 0) {
      writer.uint32(48).int32(message.leftTime);
    }
    if (message.physicId !== 0) {
      writer.uint32(56).int32(message.physicId);
    }
    if (message.posId !== 0) {
      writer.uint32(64).int32(message.posId);
    }
    if (message.state !== 0) {
      writer.uint32(72).int32(message.state);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): BossMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBossMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.bossName = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.grade = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.type = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.posX = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.posY = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.leftTime = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.physicId = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.posId = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.state = reader.int32();
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

  fromJSON(object: any): BossMsg {
    return {
      bossName: isSet(object.bossName) ? globalThis.String(object.bossName) : "",
      grade: isSet(object.grade) ? globalThis.Number(object.grade) : 0,
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
      posX: isSet(object.posX) ? globalThis.Number(object.posX) : 0,
      posY: isSet(object.posY) ? globalThis.Number(object.posY) : 0,
      leftTime: isSet(object.leftTime) ? globalThis.Number(object.leftTime) : 0,
      physicId: isSet(object.physicId) ? globalThis.Number(object.physicId) : 0,
      posId: isSet(object.posId) ? globalThis.Number(object.posId) : 0,
      state: isSet(object.state) ? globalThis.Number(object.state) : 0,
    };
  },

  toJSON(message: BossMsg): unknown {
    const obj: any = {};
    if (message.bossName !== "") {
      obj.bossName = message.bossName;
    }
    if (message.grade !== 0) {
      obj.grade = Math.round(message.grade);
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    if (message.posX !== 0) {
      obj.posX = Math.round(message.posX);
    }
    if (message.posY !== 0) {
      obj.posY = Math.round(message.posY);
    }
    if (message.leftTime !== 0) {
      obj.leftTime = Math.round(message.leftTime);
    }
    if (message.physicId !== 0) {
      obj.physicId = Math.round(message.physicId);
    }
    if (message.posId !== 0) {
      obj.posId = Math.round(message.posId);
    }
    if (message.state !== 0) {
      obj.state = Math.round(message.state);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BossMsg>, I>>(base?: I): BossMsg {
    return BossMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BossMsg>, I>>(object: I): BossMsg {
    const message = createBaseBossMsg();
    message.bossName = object.bossName ?? "";
    message.grade = object.grade ?? 0;
    message.type = object.type ?? 0;
    message.posX = object.posX ?? 0;
    message.posY = object.posY ?? 0;
    message.leftTime = object.leftTime ?? 0;
    message.physicId = object.physicId ?? 0;
    message.posId = object.posId ?? 0;
    message.state = object.state ?? 0;
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
