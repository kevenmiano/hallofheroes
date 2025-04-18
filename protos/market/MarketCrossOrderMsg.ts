// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: market/MarketCrossOrderMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.market";

export interface MarketCrossOrderMsg {
  orderId: string;
  type: number;
  templateId: number;
  userName: string;
  site: string;
  count: number;
  point: number;
  status: number;
  createTime: string;
  actionTime: string;
  extract: number;
  extractTime: string;
  tradingOrder: string;
  tradingSite: string;
  tradingPoint: number;
  tax: number;
  isExist: boolean;
}

function createBaseMarketCrossOrderMsg(): MarketCrossOrderMsg {
  return {
    orderId: "",
    type: 0,
    templateId: 0,
    userName: "",
    site: "",
    count: 0,
    point: 0,
    status: 0,
    createTime: "",
    actionTime: "",
    extract: 0,
    extractTime: "",
    tradingOrder: "",
    tradingSite: "",
    tradingPoint: 0,
    tax: 0,
    isExist: false,
  };
}

export const MarketCrossOrderMsg: MessageFns<MarketCrossOrderMsg> = {
  encode(message: MarketCrossOrderMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.templateId !== 0) {
      writer.uint32(24).int32(message.templateId);
    }
    if (message.userName !== "") {
      writer.uint32(34).string(message.userName);
    }
    if (message.site !== "") {
      writer.uint32(42).string(message.site);
    }
    if (message.count !== 0) {
      writer.uint32(48).int32(message.count);
    }
    if (message.point !== 0) {
      writer.uint32(56).int32(message.point);
    }
    if (message.status !== 0) {
      writer.uint32(64).int32(message.status);
    }
    if (message.createTime !== "") {
      writer.uint32(74).string(message.createTime);
    }
    if (message.actionTime !== "") {
      writer.uint32(82).string(message.actionTime);
    }
    if (message.extract !== 0) {
      writer.uint32(88).int32(message.extract);
    }
    if (message.extractTime !== "") {
      writer.uint32(98).string(message.extractTime);
    }
    if (message.tradingOrder !== "") {
      writer.uint32(106).string(message.tradingOrder);
    }
    if (message.tradingSite !== "") {
      writer.uint32(114).string(message.tradingSite);
    }
    if (message.tradingPoint !== 0) {
      writer.uint32(120).int32(message.tradingPoint);
    }
    if (message.tax !== 0) {
      writer.uint32(128).int32(message.tax);
    }
    if (message.isExist !== false) {
      writer.uint32(136).bool(message.isExist);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MarketCrossOrderMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMarketCrossOrderMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.orderId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.templateId = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.userName = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.site = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.count = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.point = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.status = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }

          message.createTime = reader.string();
          continue;
        }
        case 10: {
          if (tag !== 82) {
            break;
          }

          message.actionTime = reader.string();
          continue;
        }
        case 11: {
          if (tag !== 88) {
            break;
          }

          message.extract = reader.int32();
          continue;
        }
        case 12: {
          if (tag !== 98) {
            break;
          }

          message.extractTime = reader.string();
          continue;
        }
        case 13: {
          if (tag !== 106) {
            break;
          }

          message.tradingOrder = reader.string();
          continue;
        }
        case 14: {
          if (tag !== 114) {
            break;
          }

          message.tradingSite = reader.string();
          continue;
        }
        case 15: {
          if (tag !== 120) {
            break;
          }

          message.tradingPoint = reader.int32();
          continue;
        }
        case 16: {
          if (tag !== 128) {
            break;
          }

          message.tax = reader.int32();
          continue;
        }
        case 17: {
          if (tag !== 136) {
            break;
          }

          message.isExist = reader.bool();
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

  fromJSON(object: any): MarketCrossOrderMsg {
    return {
      orderId: isSet(object.orderId) ? globalThis.String(object.orderId) : "",
      type: isSet(object.type) ? globalThis.Number(object.type) : 0,
      templateId: isSet(object.templateId) ? globalThis.Number(object.templateId) : 0,
      userName: isSet(object.userName) ? globalThis.String(object.userName) : "",
      site: isSet(object.site) ? globalThis.String(object.site) : "",
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      point: isSet(object.point) ? globalThis.Number(object.point) : 0,
      status: isSet(object.status) ? globalThis.Number(object.status) : 0,
      createTime: isSet(object.createTime) ? globalThis.String(object.createTime) : "",
      actionTime: isSet(object.actionTime) ? globalThis.String(object.actionTime) : "",
      extract: isSet(object.extract) ? globalThis.Number(object.extract) : 0,
      extractTime: isSet(object.extractTime) ? globalThis.String(object.extractTime) : "",
      tradingOrder: isSet(object.tradingOrder) ? globalThis.String(object.tradingOrder) : "",
      tradingSite: isSet(object.tradingSite) ? globalThis.String(object.tradingSite) : "",
      tradingPoint: isSet(object.tradingPoint) ? globalThis.Number(object.tradingPoint) : 0,
      tax: isSet(object.tax) ? globalThis.Number(object.tax) : 0,
      isExist: isSet(object.isExist) ? globalThis.Boolean(object.isExist) : false,
    };
  },

  toJSON(message: MarketCrossOrderMsg): unknown {
    const obj: any = {};
    if (message.orderId !== "") {
      obj.orderId = message.orderId;
    }
    if (message.type !== 0) {
      obj.type = Math.round(message.type);
    }
    if (message.templateId !== 0) {
      obj.templateId = Math.round(message.templateId);
    }
    if (message.userName !== "") {
      obj.userName = message.userName;
    }
    if (message.site !== "") {
      obj.site = message.site;
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.point !== 0) {
      obj.point = Math.round(message.point);
    }
    if (message.status !== 0) {
      obj.status = Math.round(message.status);
    }
    if (message.createTime !== "") {
      obj.createTime = message.createTime;
    }
    if (message.actionTime !== "") {
      obj.actionTime = message.actionTime;
    }
    if (message.extract !== 0) {
      obj.extract = Math.round(message.extract);
    }
    if (message.extractTime !== "") {
      obj.extractTime = message.extractTime;
    }
    if (message.tradingOrder !== "") {
      obj.tradingOrder = message.tradingOrder;
    }
    if (message.tradingSite !== "") {
      obj.tradingSite = message.tradingSite;
    }
    if (message.tradingPoint !== 0) {
      obj.tradingPoint = Math.round(message.tradingPoint);
    }
    if (message.tax !== 0) {
      obj.tax = Math.round(message.tax);
    }
    if (message.isExist !== false) {
      obj.isExist = message.isExist;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MarketCrossOrderMsg>, I>>(base?: I): MarketCrossOrderMsg {
    return MarketCrossOrderMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MarketCrossOrderMsg>, I>>(object: I): MarketCrossOrderMsg {
    const message = createBaseMarketCrossOrderMsg();
    message.orderId = object.orderId ?? "";
    message.type = object.type ?? 0;
    message.templateId = object.templateId ?? 0;
    message.userName = object.userName ?? "";
    message.site = object.site ?? "";
    message.count = object.count ?? 0;
    message.point = object.point ?? 0;
    message.status = object.status ?? 0;
    message.createTime = object.createTime ?? "";
    message.actionTime = object.actionTime ?? "";
    message.extract = object.extract ?? 0;
    message.extractTime = object.extractTime ?? "";
    message.tradingOrder = object.tradingOrder ?? "";
    message.tradingSite = object.tradingSite ?? "";
    message.tradingPoint = object.tradingPoint ?? 0;
    message.tax = object.tax ?? 0;
    message.isExist = object.isExist ?? false;
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
