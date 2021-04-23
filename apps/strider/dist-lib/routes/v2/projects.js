"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const co_router_1 = __importDefault(require("co-router"));
const auth_1 = require("../../auth");
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const project_1 = __importDefault(require("../../models/project"));
const router = new co_router_1.default();
/*
 * GET /projects
 */
router.get('/', auth_1.requireUser, function (req, res) {
    project_1.default.forUser(req.user, (err, projects) => {
        if (err) {
            return res.status(400).json(err);
        }
        // debugger;
        res.json(projects);
    });
});
exports.default = router;
//# sourceMappingURL=projects.js.map