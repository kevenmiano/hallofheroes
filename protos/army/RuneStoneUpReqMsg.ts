// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: army/RuneStoneUpReqMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.army";

export interface RuneStoneUpReqMsg {
  pos: number;
  id: number;
  runeNum: number;
  bagType: number;
  runeId: number;
}

function createBaseRuneStoneUpReqMsg(): RuneStoneUpReqMsg {
  return { pos: 0, id: 0, runeNum: 0, bagType: 0, runeId: 0 };
}

export const RuneStoneUpReqMsg: MessageFns<RuneStoneUpReqMsg> = {
  encode(message: RuneStoneUpReqMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.pos !== 0) {
      writer.uint32(8).int32(message.pos);
    }
    if (message.id !== 0) {
      writer.uint32(16).int32(message.id);
    }
    if (message.runeNum !== 0) {
      writer.uint32(24).int32(message.runeNum);
    }
    if (message.bagType !== 0) {
      writer.uint32(32).int32(message.bagType);
    }
    if (message.runeId !== 0) {
      writer.uint32(40).int32(message.runeId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RuneStoneUpReqMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRuneStoneUpReqMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.pos = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.id = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.runeNum = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.bagType = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.runeId = reader.int32();
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

  fromJSON(object: any): RuneStoneUpReqMsg {
    return {
      pos: isSet(object.pos) ? globalThis.Number(object.pos) : 0,
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      runeNum: isSet(object.runeNum) ? globalThis.Number(object.runeNum) : 0,
      bagType: isSet(object.bagType) ? globalThis.Number(object.bagType) : 0,
      runeId: isSet(object.runeId) ? globalThis.Number(object.runeId) : 0,
    };
  },

  toJSON(message: RuneStoneUpReqMsg): unknown {
    const obj: any = {};
    if (message.pos !== 0) {
      obj.pos = Math.round(message.pos);
    }
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.runeNum !== 0) {
      obj.runeNum = Math.round(message.runeNum);
    }
    if (message.bagType !== 0) {
      obj.bagType = Math.round(message.bagType);
    }
    if (message.runeId !== 0) {
      obj.runeId = Math.round(message.runeId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RuneStoneUpReqMsg>, I>>(base?: I): RuneStoneUpReqMsg {
    return RuneStoneUpReqMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RuneStoneUpReqMsg>, I>>(object: I): RuneStoneUpReqMsg {
    const message = createBaseRuneStoneUpReqMsg();
    message.pos = object.pos ?? 0;
    message.id = object.id ?? 0;
    message.runeNum = object.runeNum ?? 0;
    message.bagType = object.bagType ?? 0;
    message.runeId = object.runeId ?? 0;
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
