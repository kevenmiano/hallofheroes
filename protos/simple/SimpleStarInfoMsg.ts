// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: simple/SimpleStarInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.simple";

export interface SimpleStarInfoMsg {
  id: number;
  templateId: number;
  objectId: number;
  pos: number;
  bagType: number;
  grade: number;
  gp: number;
}

function createBaseSimpleStarInfoMsg(): SimpleStarInfoMsg {
  return { id: 0, templateId: 0, objectId: 0, pos: 0, bagType: 0, grade: 0, gp: 0 };
}

export const SimpleStarInfoMsg: MessageFns<SimpleStarInfoMsg> = {
  encode(message: SimpleStarInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.templateId !== 0) {
      writer.uint32(16).int32(message.templateId);
    }
    if (message.objectId !== 0) {
      writer.uint32(24).int32(message.objectId);
    }
    if (message.pos !== 0) {
      writer.uint32(32).int32(message.pos);
    }
    if (message.bagType !== 0) {
      writer.uint32(40).int32(message.bagType);
    }
    if (message.grade !== 0) {
      writer.uint32(48).int32(message.grade);
    }
    if (message.gp !== 0) {
      writer.uint32(56).int32(message.gp);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SimpleStarInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSimpleStarInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.id = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.templateId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.objectId = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.pos = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.bagType = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.grade = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.gp = reader.int32();
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

  fromJSON(object: any): SimpleStarInfoMsg {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      templateId: isSet(object.templateId) ? globalThis.Number(object.templateId) : 0,
      objectId: isSet(object.objectId) ? globalThis.Number(object.objectId) : 0,
      pos: isSet(object.pos) ? globalThis.Number(object.pos) : 0,
      bagType: isSet(object.bagType) ? globalThis.Number(object.bagType) : 0,
      grade: isSet(object.grade) ? globalThis.Number(object.grade) : 0,
      gp: isSet(object.gp) ? globalThis.Number(object.gp) : 0,
    };
  },

  toJSON(message: SimpleStarInfoMsg): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.templateId !== 0) {
      obj.templateId = Math.round(message.templateId);
    }
    if (message.objectId !== 0) {
      obj.objectId = Math.round(message.objectId);
    }
    if (message.pos !== 0) {
      obj.pos = Math.round(message.pos);
    }
    if (message.bagType !== 0) {
      obj.bagType = Math.round(message.bagType);
    }
    if (message.grade !== 0) {
      obj.grade = Math.round(message.grade);
    }
    if (message.gp !== 0) {
      obj.gp = Math.round(message.gp);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SimpleStarInfoMsg>, I>>(base?: I): SimpleStarInfoMsg {
    return SimpleStarInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SimpleStarInfoMsg>, I>>(object: I): SimpleStarInfoMsg {
    const message = createBaseSimpleStarInfoMsg();
    message.id = object.id ?? 0;
    message.templateId = object.templateId ?? 0;
    message.objectId = object.objectId ?? 0;
    message.pos = object.pos ?? 0;
    message.bagType = object.bagType ?? 0;
    message.grade = object.grade ?? 0;
    message.gp = object.gp ?? 0;
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
