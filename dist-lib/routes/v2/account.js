"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const co_router_1 = __importDefault(require("co-router"));
const utils_1 = require("../../utils");
const common_1 = __importDefault(require("../../common"));
const router = new co_router_1.default();
/*
 * GET /account
 */
router.get('/', function (req, res) {
    const user = utils_1.sanitizeUser(req.user.toJSON());
    user.gravatar = utils_1.gravatar(user.email);
    delete user.hash;
    delete user.salt;
    res.json({
        user,
        userConfigs: common_1.default.userConfigs,
    });
});
exports.default = router;
//# sourceMappingURL=account.js.map