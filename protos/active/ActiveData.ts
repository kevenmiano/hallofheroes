// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: active/ActiveData.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.active";

export interface ActiveData {
  packdata: number[];
  value: number;
  activeId: string;
  isShow: boolean;
  type: number;
  activeCharge: number;
  consumeMsg: number[];
  state: number;
}

function createBaseActiveData(): ActiveData {
  return { packdata: [], value: 0, activeId: "", isShow: false, type: 0, activeCharge: 0, consumeMsg: [], state: 0 };
}

export const ActiveData: MessageFns<ActiveData> = {
  encode(message: ActiveData, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.packdata) {
      writer.int32(v);
    }
    writer.join();
    if (message.value !== 0) {
      writer.uint32(16).int32(message.value);
    }
    if (message.activeId !== "") {
      writer.uint32(26).string(message.activeId);
    }
    if (message.isShow !== false) {
      writer.uint32(32).bool(message.isShow);
    }
    if (message.type !== 0) {
      writer.uint32(40).int32(message.type);
    }
    if (message.activeCharge !== 0) {
      writer.uint32(48).int32(message.activeCharge);
    }
    writer.uint32(58).fork();
    for (const v of message.consumeMsg) {
      writer.int32(v);
    }
    writer.join();
    if (message.state !== 0) {
      writer.uint32(64).int32(message.state);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ActiveData {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActiveData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.packdata.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.packdata.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.value = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.activeId = reader.string();
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
          if (tag !== 40) {
            break;
          }

          message.type = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.activeCharge = reader.int32();
          continue;
        }
        case 7: {
          if (tag === 56) {
            message.consumeMsg.push(reader.int32());

            continue;
          }

          if (tag === 58) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.consumeMsg.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.state = reader.int32();
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

  fromJSON(object: any): ActiveData {
    return {
      packdata: globalThis.Array.isArray(object?.packdata) ? object.packdata.map((e: any) => globalThis.Number(e)) : [],
      value: isSet(object.value) ? globalThis.Number(object.value) : 0,
      activeId: isSet(object.activeId) ? globalThis.String(object.activeId) : "",
      isShow: isSet(object.isShow) ? globalThis.Boolean(object.isShow) : false,
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
      activeCharge: isSet(object.activeCharge) ? globalThis.Number(object.activeCharge) : 0,
      consumeMsg: globalThis.Array.isArray(object?.consumeMsg)
        ? object.consumeMsg.map((e: any) => globalThis.Number(e))
        : [],
      state: isSet(object.state) ? globalThis.Number(object.state) : 0,
    };
  },

  toJSON(message: ActiveData): unknown {
    const obj: any = {};
    if (message.packdata?.length) {
      obj.packdata = message.packdata.map((e) => Math.round(e));
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    if (message.activeId !== "") {
      obj.activeId = message.activeId;
    }
    if (message.isShow !== false) {
      obj.isShow = message.isShow;
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    if (message.activeCharge !== 0) {
      obj.activeCharge = Math.round(message.activeCharge);
    }
    if (message.consumeMsg?.length) {
      obj.consumeMsg = message.consumeMsg.map((e) => Math.round(e));
    }
    if (message.state !== 0) {
      obj.state = Math.round(message.state);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActiveData>, I>>(base?: I): ActiveData {
    return ActiveData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActiveData>, I>>(object: I): ActiveData {
    const message = createBaseActiveData();
    message.packdata = object.packdata?.map((e) => e) || [];
    message.value = object.value ?? 0;
    message.activeId = object.activeId ?? "";
    message.isShow = object.isShow ?? false;
    message.type = object.type ?? 0;
    message.activeCharge = object.activeCharge ?? 0;
    message.consumeMsg = object.consumeMsg?.map((e) => e) || [];
    message.state = object.state ?? 0;
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
