// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: item/BottlePackage.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.item";

export interface BottlePackage {
  param: number;
  item: number[];
}

function createBaseBottlePackage(): BottlePackage {
  return { param: 0, item: [] };
}

export const BottlePackage: MessageFns<BottlePackage> = {
  encode(message: BottlePackage, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.param !== 0) {
      writer.uint32(8).int32(message.param);
    }
    writer.uint32(18).fork();
    for (const v of message.item) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): BottlePackage {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBottlePackage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.param = reader.int32();
          continue;
        }
        case 2: {
          if (tag === 16) {
            message.item.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.item.push(reader.int32());
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

  fromJSON(object: any): BottlePackage {
    return {
      param: isSet(object.param) ? globalThis.Number(object.param) : 0,
      item: globalThis.Array.isArray(object?.item) ? object.item.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: BottlePackage): unknown {
    const obj: any = {};
    if (message.param !== 0) {
      obj.param = Math.round(message.param);
    }
    if (message.item?.length) {
      obj.item = message.item.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BottlePackage>, I>>(base?: I): BottlePackage {
    return BottlePackage.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BottlePackage>, I>>(object: I): BottlePackage {
    const message = createBaseBottlePackage();
    message.param = object.param ?? 0;
    message.item = object.item?.map((e) => e) || [];
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
