// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: player/VicePasswordMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.player";

export interface VicePasswordMsg {
  opType: number;
  inputPass: string;
  prePass: string;
  newPass: string;
  result: number;
}

function createBaseVicePasswordMsg(): VicePasswordMsg {
  return { opType: 0, inputPass: "", prePass: "", newPass: "", result: 0 };
}

export const VicePasswordMsg: MessageFns<VicePasswordMsg> = {
  encode(message: VicePasswordMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.opType !== 0) {
      writer.uint32(8).int32(message.opType);
    }
    if (message.inputPass !== "") {
      writer.uint32(18).string(message.inputPass);
    }
    if (message.prePass !== "") {
      writer.uint32(26).string(message.prePass);
    }
    if (message.newPass !== "") {
      writer.uint32(34).string(message.newPass);
    }
    if (message.result !== 0) {
      writer.uint32(40).int32(message.result);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): VicePasswordMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVicePasswordMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.opType = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.inputPass = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.prePass = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.newPass = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.result = reader.int32();
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

  fromJSON(object: any): VicePasswordMsg {
    return {
      opType: isSet(object.opType) ? globalThis.Number(object.opType) : 0,
      inputPass: isSet(object.inputPass) ? globalThis.String(object.inputPass) : "",
      prePass: isSet(object.prePass) ? globalThis.String(object.prePass) : "",
      newPass: isSet(object.newPass) ? globalThis.String(object.newPass) : "",
      result: isSet(object.result) ? globalThis.Number(object.result) : 0,
    };
  },

  toJSON(message: VicePasswordMsg): unknown {
    const obj: any = {};
    if (message.opType !== 0) {
      obj.opType = Math.round(message.opType);
    }
    if (message.inputPass !== "") {
      obj.inputPass = message.inputPass;
    }
    if (message.prePass !== "") {
      obj.prePass = message.prePass;
    }
    if (message.newPass !== "") {
      obj.newPass = message.newPass;
    }
    if (message.result !== 0) {
      obj.result = Math.round(message.result);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VicePasswordMsg>, I>>(base?: I): VicePasswordMsg {
    return VicePasswordMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VicePasswordMsg>, I>>(object: I): VicePasswordMsg {
    const message = createBaseVicePasswordMsg();
    message.opType = object.opType ?? 0;
    message.inputPass = object.inputPass ?? "";
    message.prePass = object.prePass ?? "";
    message.newPass = object.newPass ?? "";
    message.result = object.result ?? 0;
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
