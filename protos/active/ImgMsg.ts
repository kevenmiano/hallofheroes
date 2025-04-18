// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: active/ImgMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.active";

export interface ImgMsg {
  id: string;
  url: string;
  sort: number;
  offsetX: number;
  offsetY: number;
  jumpUrl: string;
}

function createBaseImgMsg(): ImgMsg {
  return { id: "", url: "", sort: 0, offsetX: 0, offsetY: 0, jumpUrl: "" };
}

export const ImgMsg: MessageFns<ImgMsg> = {
  encode(message: ImgMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.url !== "") {
      writer.uint32(18).string(message.url);
    }
    if (message.sort !== 0) {
      writer.uint32(24).int32(message.sort);
    }
    if (message.offsetX !== 0) {
      writer.uint32(32).int32(message.offsetX);
    }
    if (message.offsetY !== 0) {
      writer.uint32(40).int32(message.offsetY);
    }
    if (message.jumpUrl !== "") {
      writer.uint32(50).string(message.jumpUrl);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ImgMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseImgMsg();
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

          message.url = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.sort = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.offsetX = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.offsetY = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.jumpUrl = reader.string();
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

  fromJSON(object: any): ImgMsg {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      sort: isSet(object.sort) ? globalThis.Number(object.sort) : 0,
      offsetX: isSet(object.offsetX) ? globalThis.Number(object.offsetX) : 0,
      offsetY: isSet(object.offsetY) ? globalThis.Number(object.offsetY) : 0,
      jumpUrl: isSet(object.jumpUrl) ? globalThis.String(object.jumpUrl) : "",
    };
  },

  toJSON(message: ImgMsg): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.sort !== 0) {
      obj.sort = Math.round(message.sort);
    }
    if (message.offsetX !== 0) {
      obj.offsetX = Math.round(message.offsetX);
    }
    if (message.offsetY !== 0) {
      obj.offsetY = Math.round(message.offsetY);
    }
    if (message.jumpUrl !== "") {
      obj.jumpUrl = message.jumpUrl;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ImgMsg>, I>>(base?: I): ImgMsg {
    return ImgMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ImgMsg>, I>>(object: I): ImgMsg {
    const message = createBaseImgMsg();
    message.id = object.id ?? "";
    message.url = object.url ?? "";
    message.sort = object.sort ?? 0;
    message.offsetX = object.offsetX ?? 0;
    message.offsetY = object.offsetY ?? 0;
    message.jumpUrl = object.jumpUrl ?? "";
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
