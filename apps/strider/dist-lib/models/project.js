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
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils");
let ProjectModel;
const PluginConfig = new mongoose_1.Schema({
    id: String,
    config: {},
    showStatus: {
        type: Boolean,
        default: true,
    },
    enabled: Boolean,
});
const BranchConfig = new mongoose_1.Schema({
    active: {
        type: Boolean,
        default: true,
    },
    name: { type: String },
    mirror_master: {
        type: Boolean,
        default: true,
    },
    deploy_on_green: {
        type: Boolean,
        default: true,
    },
    deploy_on_pull_request: {
        type: Boolean,
        default: false,
    },
    // ssh keypair
    pubkey: String,
    privkey: String,
    // add the ssh keys to the ENV
    envKeys: Boolean,
    // job & runner plugins
    plugins: [PluginConfig],
    runner: {
        id: String,
        config: {},
    },
    // for persistance, not configuration
    plugin_data: {},
});
const ProjectSchema = new mongoose_1.Schema({
    // name is always lower case!
    name: {
        type: String,
        unique: true,
        index: true,
    },
    display_name: { type: String },
    public: {
        type: Boolean,
        default: false,
        index: true,
    },
    display_url: String,
    // grab the `.strider.json` in advance - could be expensive for some
    // providers (like raw git). This allows runner configuration in the
    // .strider.json file.
    prefetch_config: {
        type: Boolean,
        default: true,
    },
    // used for user-level provider & plugin config.
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        index: true,
    },
    // looks like:
    // { master: BranchConfig, otherbranch: 'master' || BranchConfig, ... }
    // if a branch maps to 'master', it has all of the same configuration, but 'deploy_on_green' is false
    branches: [BranchConfig],
    provider: {
        id: String,
        account: String,
        repo_id: String,
        config: {
        // decided by the provider
        // url: String
        },
    },
});
ProjectSchema.virtual('ownerName').get(function () {
    const split = this.name.split('/');
    return split === null || split === void 0 ? void 0 : split[0];
});
ProjectSchema.virtual('repoName').get(function () {
    const split = this.name.split('/');
    return split === null || split === void 0 ? void 0 : split[1];
});
// name: the name of the new branch
// done(err)
ProjectSchema.methods.addBranch = function (name, done) {
    const branch = {
        name: name,
        mirror_master: true,
    };
    this.branches.push(branch);
    this.collection.updateOne({ _id: this._id }, {
        $push: { branches: branch },
    }, function (err, changed) {
        if (err) {
            return done(err);
        }
        if (!changed) {
            return done(new Error('no projects affected by adding the branch'));
        }
        done(null, branch);
    });
};
ProjectSchema.methods.cloneBranch = function (name, cloneName, done) {
    let clone;
    this.branches.forEach(function (branch) {
        if (branch.name === name) {
            clone = lodash_1.default.merge({}, branch);
        }
    });
    if (!clone) {
        return done(new Error('source branch can not be found'));
    }
    clone.name = cloneName;
    this.branches.push(clone);
    this.collection.updateOne({ _id: this._id }, {
        $push: { branches: clone },
    }, function (err, changed) {
        if (err) {
            return done(err);
        }
        if (!changed) {
            return done(new Error('no projects affected by cloning the branch'));
        }
        done(null, clone);
    });
};
ProjectSchema.methods.branch = function (name) {
    return utils_1.findBranch(this.branches, name);
};
ProjectSchema.statics.forUser = function (user, done) {
    return __awaiter(this, void 0, void 0, function* () {
        // Default to all projects
        let query = {};
        // If we are not an admin i.e account level is not set or < 1, show only user projects
        if (!user.account_level || user.account_level < 1) {
            if (!user.projects) {
                return done(null, []);
            }
            const names = user.projects.map(function (p) {
                return p.name.toLowerCase();
            });
            if (!names.length) {
                return done(null, []);
            }
            query = {
                name: { $in: names },
            };
        }
        return this.find(query, done);
    });
};
// eslint-disable-next-line prefer-const
ProjectModel = mongoose_1.model('Project', ProjectSchema);
exports.default = ProjectModel;
//# sourceMappingURL=project.js.map