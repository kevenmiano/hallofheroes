// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: crossguild/CrossGuildRequestMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.crossguild";

export interface CrossGuildRequestMsg {
  op: number;
  notice: string;
  timeStamp: string;
  road: number;
}

function createBaseCrossGuildRequestMsg(): CrossGuildRequestMsg {
  return { op: 0, notice: "", timeStamp: "", road: 0 };
}

export const CrossGuildRequestMsg: MessageFns<CrossGuildRequestMsg> = {
  encode(message: CrossGuildRequestMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.op !== 0) {
      writer.uint32(8).int32(message.op);
    }
    if (message.notice !== "") {
      writer.uint32(18).string(message.notice);
    }
    if (message.timeStamp !== "") {
      writer.uint32(26).string(message.timeStamp);
    }
    if (message.road !== 0) {
      writer.uint32(32).int32(message.road);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CrossGuildRequestMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCrossGuildRequestMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.op = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.notice = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.timeStamp = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.road = reader.int32();
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

  fromJSON(object: any): CrossGuildRequestMsg {
    return {
      op: isSet(object.op) ? globalThis.Number(object.op) : 0,
      notice: isSet(object.notice) ? globalThis.String(object.notice) : "",
      timeStamp: isSet(object.timeStamp) ? globalThis.String(object.timeStamp) : "",
      road: isSet(object.road) ? globalThis.Number(object.road) : 0,
    };
  },

  toJSON(message: CrossGuildRequestMsg): unknown {
    const obj: any = {};
    if (message.op !== 0) {
      obj.op = Math.round(message.op);
    }
    if (message.notice !== "") {
      obj.notice = message.notice;
    }
    if (message.timeStamp !== "") {
      obj.timeStamp = message.timeStamp;
    }
    if (message.road !== 0) {
      obj.road = Math.round(message.road);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CrossGuildRequestMsg>, I>>(base?: I): CrossGuildRequestMsg {
    return CrossGuildRequestMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CrossGuildRequestMsg>, I>>(object: I): CrossGuildRequestMsg {
    const message = createBaseCrossGuildRequestMsg();
    message.op = object.op ?? 0;
    message.notice = object.notice ?? "";
    message.timeStamp = object.timeStamp ?? "";
    message.road = object.road ?? 0;
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
