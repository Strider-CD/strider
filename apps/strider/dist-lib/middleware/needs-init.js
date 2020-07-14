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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
let needsCheck = true;
function default_1(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!needsCheck) {
            return next();
        }
        const admins = yield user_1.default.count({ account_level: 1 });
        needsCheck = false;
        if (admins === 0) {
            res.redirect('/setup?ember=true');
            return;
        }
        next();
    });
}
exports.default = default_1;
//# sourceMappingURL=needs-init.js.map