"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
const email_1 = __importDefault(require("./email"));
const env = process.env.NODE_ENV;
function getAdmins(done) {
    models_1.User.find({ account_level: 1 }, function (err, admins) {
        done(err, admins);
    });
}
function makeAdmin(email, done) {
    models_1.User.updateOne({ email }, { account_level: 1 }, {}, function (err, num) {
        if (err)
            return done(err);
        if (!num)
            return done();
        console.log(`Admin status granted to: ${email}`);
        // if in production, notify all other admins about new admin
        if (env === 'production') {
            getAdmins(function (_err, admins) {
                admins
                    .filter(function removeSelf(admin) {
                    return admin.email !== email;
                })
                    .forEach(function notifyAdmin(admin) {
                    email_1.default.notifyNewAdmin(email, admin.email);
                });
            });
        }
        done(null, num);
    });
}
exports.makeAdmin = makeAdmin;
//# sourceMappingURL=users.js.map