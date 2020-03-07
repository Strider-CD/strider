"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jobs_1 = __importDefault(require("./jobs"));
function default_1(app) {
    app.use('/v2/jobs', jobs_1.default);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map