// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: active/PackageData.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.active";

export interface PackageData {
  packId: string;
  status: number;
  countDown: number;
  isShow: boolean;
  param1: string;
  finishValue: number;
  getCount: number;
}

function createBasePackageData(): PackageData {
  return { packId: "", status: 0, countDown: 0, isShow: false, param1: "", finishValue: 0, getCount: 0 };
}

export const PackageData: MessageFns<PackageData> = {
  encode(message: PackageData, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.packId !== "") {
      writer.uint32(10).string(message.packId);
    }
    if (message.status !== 0) {
      writer.uint32(16).int32(message.status);
    }
    if (message.countDown !== 0) {
      writer.uint32(24).int32(message.countDown);
    }
    if (message.isShow !== false) {
      writer.uint32(32).bool(message.isShow);
    }
    if (message.param1 !== "") {
      writer.uint32(42).string(message.param1);
    }
    if (message.finishValue !== 0) {
      writer.uint32(48).int32(message.finishValue);
    }
    if (message.getCount !== 0) {
      writer.uint32(56).int32(message.getCount);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PackageData {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePackageData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.packId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.status = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.countDown = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.isShow = reader.bool();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.param1 = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.finishValue = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.getCount = reader.int32();
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

  fromJSON(object: any): PackageData {
    return {
      packId: isSet(object.packId) ? globalThis.String(object.packId) : "",
      status: isSet(object.status) ? globalThis.Number(object.status) : 0,
      countDown: isSet(object.countDown) ? globalThis.Number(object.countDown) : 0,
      isShow: isSet(object.isShow) ? globalThis.Boolean(object.isShow) : false,
      param1: isSet(object.param1) ? globalThis.String(object.param1) : "",
      finishValue: isSet(object.finishValue) ? globalThis.Number(object.finishValue) : 0,
      getCount: isSet(object.getCount) ? globalThis.Number(object.getCount) : 0,
    };
  },

  toJSON(message: PackageData): unknown {
    const obj: any = {};
    if (message.packId !== "") {
      obj.packId = message.packId;
    }
    if (message.status !== 0) {
      obj.status = Math.round(message.status);
    }
    if (message.countDown !== 0) {
      obj.countDown = Math.round(message.countDown);
    }
    if (message.isShow !== false) {
      obj.isShow = message.isShow;
    }
    if (message.param1 !== "") {
      obj.param1 = message.param1;
    }
    if (message.finishValue !== 0) {
      obj.finishValue = Math.round(message.finishValue);
    }
    if (message.getCount !== 0) {
      obj.getCount = Math.round(message.getCount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PackageData>, I>>(base?: I): PackageData {
    return PackageData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PackageData>, I>>(object: I): PackageData {
    const message = createBasePackageData();
    message.packId = object.packId ?? "";
    message.status = object.status ?? 0;
    message.countDown = object.countDown ?? 0;
    message.isShow = object.isShow ?? false;
    message.param1 = object.param1 ?? "";
    message.finishValue = object.finishValue ?? 0;
    message.getCount = object.getCount ?? 0;
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
