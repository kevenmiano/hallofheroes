// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: stackhead/StackHeadReportListMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.stackhead";

export interface StackHeadReportListMsg {
  op: number;
  type: number;
  list: number[];
}

function createBaseStackHeadReportListMsg(): StackHeadReportListMsg {
  return { op: 0, type: 0, list: [] };
}

export const StackHeadReportListMsg: MessageFns<StackHeadReportListMsg> = {
  encode(message: StackHeadReportListMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.op !== 0) {
      writer.uint32(8).int32(message.op);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    writer.uint32(26).fork();
    for (const v of message.list) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): StackHeadReportListMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStackHeadReportListMsg();
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
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32();
          continue;
        }
        case 3: {
          if (tag === 24) {
            message.list.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.list.push(reader.int32());
            }

            continue;
          }

          break;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StackHeadReportListMsg {
    return {
      op: isSet(object.op) ? globalThis.Number(object.op) : 0,
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
      list: globalThis.Array.isArray(object?.list) ? object.list.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: StackHeadReportListMsg): unknown {
    const obj: any = {};
    if (message.op !== 0) {
      obj.op = Math.round(message.op);
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    if (message.list?.length) {
      obj.list = message.list.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StackHeadReportListMsg>, I>>(base?: I): StackHeadReportListMsg {
    return StackHeadReportListMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StackHeadReportListMsg>, I>>(object: I): StackHeadReportListMsg {
    const message = createBaseStackHeadReportListMsg();
    message.op = object.op ?? 0;
    message.type = object.type ?? 0;
    message.list = object.list?.map((e) => e) || [];
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
