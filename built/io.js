"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TerminalInterface_instances, _TerminalInterface_io, _TerminalInterface_on, _TerminalInterface_isOn, _TerminalInterface_errorHandler;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalInterface = void 0;
var promises_1 = require("readline/promises");
var node_process_1 = require("node:process");
var error_ts_1 = require("./error.ts");
var TerminalInterface = /** @class */ (function () {
    function TerminalInterface() {
        _TerminalInterface_instances.add(this);
        _TerminalInterface_io.set(this, void 0);
        _TerminalInterface_on.set(this, void 0);
        __classPrivateFieldSet(this, _TerminalInterface_io, (0, promises_1.createInterface)({ input: node_process_1.stdin, output: node_process_1.stdout }), "f");
        __classPrivateFieldSet(this, _TerminalInterface_on, false, "f");
    }
    TerminalInterface.prototype.start = function () {
        __classPrivateFieldSet(this, _TerminalInterface_on, true, "f");
    };
    TerminalInterface.prototype.stop = function () {
        __classPrivateFieldSet(this, _TerminalInterface_on, false, "f");
        __classPrivateFieldGet(this, _TerminalInterface_io, "f").close();
    };
    TerminalInterface.prototype.prompt = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!__classPrivateFieldGet(this, _TerminalInterface_instances, "m", _TerminalInterface_isOn).call(this)) {
                            throw error_ts_1.InterfaceNotStartedError;
                        }
                        return [4 /*yield*/, __classPrivateFieldGet(this, _TerminalInterface_io, "f").question(question)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        __classPrivateFieldGet(this, _TerminalInterface_instances, "m", _TerminalInterface_errorHandler).call(this, err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TerminalInterface.prototype.chat = function (message) {
        try {
            if (!__classPrivateFieldGet(this, _TerminalInterface_instances, "m", _TerminalInterface_isOn).call(this)) {
                throw error_ts_1.InterfaceNotStartedError;
            }
            console.log(message);
        }
        catch (err) {
            __classPrivateFieldGet(this, _TerminalInterface_instances, "m", _TerminalInterface_errorHandler).call(this, err);
        }
    };
    return TerminalInterface;
}());
exports.TerminalInterface = TerminalInterface;
_TerminalInterface_io = new WeakMap(), _TerminalInterface_on = new WeakMap(), _TerminalInterface_instances = new WeakSet(), _TerminalInterface_isOn = function _TerminalInterface_isOn() {
    return __classPrivateFieldGet(this, _TerminalInterface_on, "f");
}, _TerminalInterface_errorHandler = function _TerminalInterface_errorHandler(err) {
    console.error(err.stack);
    process.exit(1);
};
