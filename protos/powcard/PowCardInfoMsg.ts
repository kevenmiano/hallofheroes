// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: powcard/PowCardInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.powcard";

export interface PowCardInfoMsg {
  tempId: number;
  grade: number;
  gp: number;
  buf: string;
  isActive: number;
}

function createBasePowCardInfoMsg(): PowCardInfoMsg {
  return { tempId: 0, grade: 0, gp: 0, buf: "", isActive: 0 };
}

export const PowCardInfoMsg: MessageFns<PowCardInfoMsg> = {
  encode(message: PowCardInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.tempId !== 0) {
      writer.uint32(8).int32(message.tempId);
    }
    if (message.grade !== 0) {
      writer.uint32(16).int32(message.grade);
    }
    if (message.gp !== 0) {
      writer.uint32(24).int32(message.gp);
    }
    if (message.buf !== "") {
      writer.uint32(34).string(message.buf);
    }
    if (message.isActive !== 0) {
      writer.uint32(40).int32(message.isActive);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PowCardInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePowCardInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.tempId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.grade = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.gp = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.buf = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.isActive = reader.int32();
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

  fromJSON(object: any): PowCardInfoMsg {
    return {
      tempId: isSet(object.tempId) ? globalThis.Number(object.tempId) : 0,
      grade: isSet(object.grade) ? globalThis.Number(object.grade) : 0,
      gp: isSet(object.gp) ? globalThis.Number(object.gp) : 0,
      buf: isSet(object.buf) ? globalThis.String(object.buf) : "",
      isActive: isSet(object.isActive) ? globalThis.Number(object.isActive) : 0,
    };
  },

  toJSON(message: PowCardInfoMsg): unknown {
    const obj: any = {};
    if (message.tempId !== 0) {
      obj.tempId = Math.round(message.tempId);
    }
    if (message.grade !== 0) {
      obj.grade = Math.round(message.grade);
    }
    if (message.gp !== 0) {
      obj.gp = Math.round(message.gp);
    }
    if (message.buf !== "") {
      obj.buf = message.buf;
    }
    if (message.isActive !== 0) {
      obj.isActive = Math.round(message.isActive);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PowCardInfoMsg>, I>>(base?: I): PowCardInfoMsg {
    return PowCardInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PowCardInfoMsg>, I>>(object: I): PowCardInfoMsg {
    const message = createBasePowCardInfoMsg();
    message.tempId = object.tempId ?? 0;
    message.grade = object.grade ?? 0;
    message.gp = object.gp ?? 0;
    message.buf = object.buf ?? "";
    message.isActive = object.isActive ?? 0;
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
