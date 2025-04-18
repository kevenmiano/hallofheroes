// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: battle/DropInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.battle";

export interface DropInfoMsg {
  dropId: number;
  dropCount: number;
  winnerIds: number[];
  param1: number;
  param2: number;
}

function createBaseDropInfoMsg(): DropInfoMsg {
  return { dropId: 0, dropCount: 0, winnerIds: [], param1: 0, param2: 0 };
}

export const DropInfoMsg: MessageFns<DropInfoMsg> = {
  encode(message: DropInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.dropId !== 0) {
      writer.uint32(8).int32(message.dropId);
    }
    if (message.dropCount !== 0) {
      writer.uint32(16).int32(message.dropCount);
    }
    writer.uint32(26).fork();
    for (const v of message.winnerIds) {
      writer.int32(v);
    }
    writer.join();
    if (message.param1 !== 0) {
      writer.uint32(32).int32(message.param1);
    }
    if (message.param2 !== 0) {
      writer.uint32(40).int32(message.param2);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DropInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDropInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.dropId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.dropCount = reader.int32();
          continue;
        }
        case 3: {
          if (tag === 24) {
            message.winnerIds.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.winnerIds.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.param1 = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.param2 = reader.int32();
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

  fromJSON(object: any): DropInfoMsg {
    return {
      dropId: isSet(object.dropId) ? globalThis.Number(object.dropId) : 0,
      dropCount: isSet(object.dropCount) ? globalThis.Number(object.dropCount) : 0,
      winnerIds: globalThis.Array.isArray(object?.winnerIds)
        ? object.winnerIds.map((e: any) => globalThis.Number(e))
        : [],
      param1: isSet(object.param1) ? globalThis.Number(object.param1) : 0,
      param2: isSet(object.param2) ? globalThis.Number(object.param2) : 0,
    };
  },

  toJSON(message: DropInfoMsg): unknown {
    const obj: any = {};
    if (message.dropId !== 0) {
      obj.dropId = Math.round(message.dropId);
    }
    if (message.dropCount !== 0) {
      obj.dropCount = Math.round(message.dropCount);
    }
    if (message.winnerIds?.length) {
      obj.winnerIds = message.winnerIds.map((e) => Math.round(e));
    }
    if (message.param1 !== 0) {
      obj.param1 = Math.round(message.param1);
    }
    if (message.param2 !== 0) {
      obj.param2 = Math.round(message.param2);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DropInfoMsg>, I>>(base?: I): DropInfoMsg {
    return DropInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DropInfoMsg>, I>>(object: I): DropInfoMsg {
    const message = createBaseDropInfoMsg();
    message.dropId = object.dropId ?? 0;
    message.dropCount = object.dropCount ?? 0;
    message.winnerIds = object.winnerIds?.map((e) => e) || [];
    message.param1 = object.param1 ?? 0;
    message.param2 = object.param2 ?? 0;
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
