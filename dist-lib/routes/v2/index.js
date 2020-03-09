"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jobs_1 = __importDefault(require("./jobs"));
function default_1(app) {
    console.log(jobs_1.default);
    app.use('/api/v2/jobs', jobs_1.default);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map