var mongoose = require('../utils/mongoose-shim');
var Schema = mongoose.Schema;
var InviteCodeSchema = new Schema({
    code: { type: String, unique: true },
    created_timestamp: Date,
    consumed_timestamp: Date,
    emailed_to: { type: String, index: true },
    consumed_by_user: { type: Schema.ObjectId, ref: 'user' },
    collaborations: [
        {
            project: String,
            access_level: Number,
            invited_by: { type: Schema.ObjectId, ref: 'user' }
        }
    ]
});
module.exports = mongoose.model('InviteCode', InviteCodeSchema);
//# sourceMappingURL=invite.js.map