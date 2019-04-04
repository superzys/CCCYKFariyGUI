"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProtoMap = /** @class */ (function () {
    function ProtoMap() {
    }
    ProtoMap.Add = function (key, type) {
        this.classMap[key] = type;
    };
    ProtoMap.Pack = function (head, data) {
        if (data === void 0) { data = null; }
        var proto = this.protos[head.cmd];
        if (proto == null) {
            console.error("尝试封包一个没有注册的消息 id=" + head.cmd);
            return null;
        }
        var _c = proto.request;
        if (_c != null && data != null) {
            head.contentBuff = this.PackByClasName(_c, data);
        }
        return this.PackByClasName("packbase", head);
    };
    ProtoMap.UnPack = function (head, buff) {
        if (buff === void 0) { buff = null; }
        var proto = this.protos[head.cmd];
        if (proto == null) {
            console.error("尝试解包一个没有注册的消息 id=" + head.cmd);
            return null;
        }
        var _c = proto.response;
        if (_c != null) {
            buff = buff == null ? head.contentBuff : buff;
            return this.UnPackByClasName(_c, buff);
        }
        else {
            return null;
        }
    };
    ProtoMap.UnPackHead = function (buffer) {
        if (buffer == null || buffer.byteLength == 0)
            return null;
        return this.UnPackByClasName("packbase", buffer);
    };
    ProtoMap.PackByClasName = function (cname, data) {
        var c = this.classMap[cname];
        if (c != null) {
            var obj = new c(data);
            return obj.toArrayBuffer();
        }
        else {
            console.error("反序列化一条没有实现的消息id：" + cname);
        }
        return null;
    };
    ProtoMap.UnPackByClasName = function (cname, buff) {
        var c = this.classMap[cname];
        if (c != null && buff != null) {
            return c.decode(buff);
        }
        if (c == null) {
            console.error("反序列化一条没有实现的消息id：" + cname);
        }
        return null;
    };
    ProtoMap.AddProto = function (proto) {
        if (this.protos[proto.id] != null) {
            console.log(this.protos);
            console.error("不能重复注册消息  id=" + proto.id);
        }
        this.protos[proto.id] = proto;
    };
    ProtoMap.protos = {
        1: {
            id: 1,
            request: null,
            response: null,
        },
    };
    ProtoMap.classMap = {};
    return ProtoMap;
}());
exports.ProtoMap = ProtoMap;
