// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: goldenroad/GoldenRoadClientRequestMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.goldenroad";

export interface GoldenRoadClientRequestMsg {
  consumeType: string;
  diceType: string;
  refreshType: string;
  requestBroadcast: string;
  bagOPType: string;
  isBatch: string;
}

function createBaseGoldenRoadClientRequestMsg(): GoldenRoadClientRequestMsg {
  return { consumeType: "", diceType: "", refreshType: "", requestBroadcast: "", bagOPType: "", isBatch: "" };
}

export const GoldenRoadClientRequestMsg: MessageFns<GoldenRoadClientRequestMsg> = {
  encode(message: GoldenRoadClientRequestMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.consumeType !== "") {
      writer.uint32(10).string(message.consumeType);
    }
    if (message.diceType !== "") {
      writer.uint32(18).string(message.diceType);
    }
    if (message.refreshType !== "") {
      writer.uint32(26).string(message.refreshType);
    }
    if (message.requestBroadcast !== "") {
      writer.uint32(34).string(message.requestBroadcast);
    }
    if (message.bagOPType !== "") {
      writer.uint32(42).string(message.bagOPType);
    }
    if (message.isBatch !== "") {
      writer.uint32(50).string(message.isBatch);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GoldenRoadClientRequestMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGoldenRoadClientRequestMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.consumeType = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.diceType = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.refreshType = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.requestBroadcast = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.bagOPType = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.isBatch = reader.string();
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

  fromJSON(object: any): GoldenRoadClientRequestMsg {
    return {
      consumeType: isSet(object.consumeType) ? globalThis.String(object.consumeType) : "",
      diceType: isSet(object.diceType) ? globalThis.String(object.diceType) : "",
      refreshType: isSet(object.refreshType) ? globalThis.String(object.refreshType) : "",
      requestBroadcast: isSet(object.requestBroadcast) ? globalThis.String(object.requestBroadcast) : "",
      bagOPType: isSet(object.bagOPType) ? globalThis.String(object.bagOPType) : "",
      isBatch: isSet(object.isBatch) ? globalThis.String(object.isBatch) : "",
    };
  },

  toJSON(message: GoldenRoadClientRequestMsg): unknown {
    const obj: any = {};
    if (message.consumeType !== "") {
      obj.consumeType = message.consumeType;
    }
    if (message.diceType !== "") {
      obj.diceType = message.diceType;
    }
    if (message.refreshType !== "") {
      obj.refreshType = message.refreshType;
    }
    if (message.requestBroadcast !== "") {
      obj.requestBroadcast = message.requestBroadcast;
    }
    if (message.bagOPType !== "") {
      obj.bagOPType = message.bagOPType;
    }
    if (message.isBatch !== "") {
      obj.isBatch = message.isBatch;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GoldenRoadClientRequestMsg>, I>>(base?: I): GoldenRoadClientRequestMsg {
    return GoldenRoadClientRequestMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GoldenRoadClientRequestMsg>, I>>(object: I): GoldenRoadClientRequestMsg {
    const message = createBaseGoldenRoadClientRequestMsg();
    message.consumeType = object.consumeType ?? "";
    message.diceType = object.diceType ?? "";
    message.refreshType = object.refreshType ?? "";
    message.requestBroadcast = object.requestBroadcast ?? "";
    message.bagOPType = object.bagOPType ?? "";
    message.isBatch = object.isBatch ?? "";
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
