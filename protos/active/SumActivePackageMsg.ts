// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: active/SumActivePackageMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.active";

export interface SumActivePackageMsg {
  packageId: string;
  order: number;
  items: number[];
  conditions: number[];
}

function createBaseSumActivePackageMsg(): SumActivePackageMsg {
  return { packageId: "", order: 0, items: [], conditions: [] };
}

export const SumActivePackageMsg: MessageFns<SumActivePackageMsg> = {
  encode(message: SumActivePackageMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.packageId !== "") {
      writer.uint32(10).string(message.packageId);
    }
    if (message.order !== 0) {
      writer.uint32(16).int32(message.order);
    }
    writer.uint32(26).fork();
    for (const v of message.items) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(34).fork();
    for (const v of message.conditions) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SumActivePackageMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSumActivePackageMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.packageId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.order = reader.int32();
          continue;
        }
        case 3: {
          if (tag === 24) {
            message.items.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.items.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 4: {
          if (tag === 32) {
            message.conditions.push(reader.int32());

            continue;
          }

          if (tag === 34) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.conditions.push(reader.int32());
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

  fromJSON(object: any): SumActivePackageMsg {
    return {
      packageId: isSet(object.packageId) ? globalThis.String(object.packageId) : "",
      order: isSet(object.order) ? globalThis.Number(object.order) : 0,
      items: globalThis.Array.isArray(object?.items) ? object.items.map((e: any) => globalThis.Number(e)) : [],
      conditions: globalThis.Array.isArray(object?.conditions)
        ? object.conditions.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: SumActivePackageMsg): unknown {
    const obj: any = {};
    if (message.packageId !== "") {
      obj.packageId = message.packageId;
    }
    if (message.order !== 0) {
      obj.order = Math.round(message.order);
    }
    if (message.items?.length) {
      obj.items = message.items.map((e) => Math.round(e));
    }
    if (message.conditions?.length) {
      obj.conditions = message.conditions.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SumActivePackageMsg>, I>>(base?: I): SumActivePackageMsg {
    return SumActivePackageMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SumActivePackageMsg>, I>>(object: I): SumActivePackageMsg {
    const message = createBaseSumActivePackageMsg();
    message.packageId = object.packageId ?? "";
    message.order = object.order ?? 0;
    message.items = object.items?.map((e) => e) || [];
    message.conditions = object.conditions?.map((e) => e) || [];
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
