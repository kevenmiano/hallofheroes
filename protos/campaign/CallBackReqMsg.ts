// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: campaign/CallBackReqMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.campaign";

export interface CallBackReqMsg {
  mapId: number;
  nodeId: number;
  cmd: number;
  serverName: string;
}

function createBaseCallBackReqMsg(): CallBackReqMsg {
  return { mapId: 0, nodeId: 0, cmd: 0, serverName: "" };
}

export const CallBackReqMsg: MessageFns<CallBackReqMsg> = {
  encode(message: CallBackReqMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.mapId !== 0) {
      writer.uint32(8).int32(message.mapId);
    }
    if (message.nodeId !== 0) {
      writer.uint32(16).int32(message.nodeId);
    }
    if (message.cmd !== 0) {
      writer.uint32(24).int32(message.cmd);
    }
    if (message.serverName !== "") {
      writer.uint32(34).string(message.serverName);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CallBackReqMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCallBackReqMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.mapId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.nodeId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.cmd = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.serverName = reader.string();
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

  fromJSON(object: any): CallBackReqMsg {
    return {
      mapId: isSet(object.mapId) ? globalThis.Number(object.mapId) : 0,
      nodeId: isSet(object.nodeId) ? globalThis.Number(object.nodeId) : 0,
      cmd: isSet(object.cmd) ? globalThis.Number(object.cmd) : 0,
      serverName: isSet(object.serverName) ? globalThis.String(object.serverName) : "",
    };
  },

  toJSON(message: CallBackReqMsg): unknown {
    const obj: any = {};
    if (message.mapId !== 0) {
      obj.mapId = Math.round(message.mapId);
    }
    if (message.nodeId !== 0) {
      obj.nodeId = Math.round(message.nodeId);
    }
    if (message.cmd !== 0) {
      obj.cmd = Math.round(message.cmd);
    }
    if (message.serverName !== "") {
      obj.serverName = message.serverName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CallBackReqMsg>, I>>(base?: I): CallBackReqMsg {
    return CallBackReqMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CallBackReqMsg>, I>>(object: I): CallBackReqMsg {
    const message = createBaseCallBackReqMsg();
    message.mapId = object.mapId ?? 0;
    message.nodeId = object.nodeId ?? 0;
    message.cmd = object.cmd ?? 0;
    message.serverName = object.serverName ?? "";
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
