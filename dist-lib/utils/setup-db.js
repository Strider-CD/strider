const mongoose = require('./mongoose-shim');
module.exports = function (config, cb) {
    let mongodbUrl = config.db_uri;
    console.log('Connecting to MongoDB URL: %s\n', mongodbUrl);
    mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
        if (error) {
            console.log('Could not connect to DB: %s', error);
        }
        cb && cb(error);
    });
    mongoose.connection.on('error', function (error) {
        console.log('MongoDB connection error: %s', error);
    });
    return mongoose;
};
//# sourceMappingURL=setup-db.js.map