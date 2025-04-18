// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: rebate/RebateInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.rebate";

export interface RebateInfoMsg {
  id: string;
  beginDate: string;
  endDate: string;
  type: number;
  packages: number[];
}

function createBaseRebateInfoMsg(): RebateInfoMsg {
  return { id: "", beginDate: "", endDate: "", type: 0, packages: [] };
}

export const RebateInfoMsg: MessageFns<RebateInfoMsg> = {
  encode(message: RebateInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.beginDate !== "") {
      writer.uint32(18).string(message.beginDate);
    }
    if (message.endDate !== "") {
      writer.uint32(26).string(message.endDate);
    }
    if (message.type !== 0) {
      writer.uint32(32).int32(message.type);
    }
    writer.uint32(42).fork();
    for (const v of message.packages) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RebateInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRebateInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.beginDate = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.endDate = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.type = reader.int32();
          continue;
        }
        case 5: {
          if (tag === 40) {
            message.packages.push(reader.int32());

            continue;
          }

          if (tag === 42) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.packages.push(reader.int32());
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

  fromJSON(object: any): RebateInfoMsg {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      beginDate: isSet(object.beginDate) ? globalThis.String(object.beginDate) : "",
      endDate: isSet(object.endDate) ? globalThis.String(object.endDate) : "",
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
      packages: globalThis.Array.isArray(object?.packages) ? object.packages.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: RebateInfoMsg): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.beginDate !== "") {
      obj.beginDate = message.beginDate;
    }
    if (message.endDate !== "") {
      obj.endDate = message.endDate;
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    if (message.packages?.length) {
      obj.packages = message.packages.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RebateInfoMsg>, I>>(base?: I): RebateInfoMsg {
    return RebateInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RebateInfoMsg>, I>>(object: I): RebateInfoMsg {
    const message = createBaseRebateInfoMsg();
    message.id = object.id ?? "";
    message.beginDate = object.beginDate ?? "";
    message.endDate = object.endDate ?? "";
    message.type = object.type ?? 0;
    message.packages = object.packages?.map((e) => e) || [];
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
