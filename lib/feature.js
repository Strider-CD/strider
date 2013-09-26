var _ = require('underscore')
  , FeatureModel = require('./models').Feature
  , logging = require('./logging')
  , Step = require('step');

function Feature(feature_name, user_obj) {
  this.init(feature_name, user_obj);
}

Feature.prototype.init = function(feature_name, user_obj) {
  var self = this;
  self.user_obj = user_obj;
  self.feature_name = feature_name;
};

/*
 * Feature.is_enabled()
 *
 * Check whether a feature is enabled for the user.
 *
 * A feature is considered enabled for the user if any of the following conditions are true:
 * - the user is admin *and* there is *no* document in the features collection matching the name
 * - there is a document in the features collection matching the name with "global_enabled" property
 *   set to true.
 * - there is a document in the features collection matching the name with their _id ObjectId value
 *   in the "users_enabled" list property.
 */
Feature.prototype.is_enabled = function(callback) {
  var self = this;
  if (!self.user_obj || !self.feature_name) {
    throw new Error("Feature must have a user object and a name");
  }

  Step(
    function findFeature() {
      FeatureModel.findOne({name: self.feature_name}, this);
    },
    function foundFeature(err, feature_obj) {
      
      if (err) throw err;
      
      // current logic - if user is admin, feature is ALWAYS on, whether it is in the db or not
      if (self.user_obj.account_level !== undefined && self.user_obj.account_level > 0) {
        console.debug("Feature.is_enabled() - %s is admin. Feature is enabled.",
            self.feature_name,self.user_obj.email);
        return callback(null, true);
      }
      if (feature_obj !== undefined && feature_obj.global_enabled) {
        console.debug("Feature.is_enabled() - global_enabled flag enabled for feature '%s'.", self.feature_name, self.user_obj.email);
        return callback(null, true);
      }

      if (feature_obj !== undefined && feature_obj.users_enabled !== undefined &&
          typeof(feature_obj.users_enabled) === 'object' &&
          _.indexOf(feature_obj.users_enabled, self.user_obj._id) !== -1) {
        console.debug("Feature.is_enabled() - user %s is in users_enabled list for feature '%s'.",
                      self.user_obj.email, self.feature_name);
        return callback(null, true);
      }
      console.debug("Feature.is_enabled() - user is not admin, feature is not global enabled, user is not in user list. Default to disabled.");
      return callback("feature has no properties. disabled.", false);
    }
  );
};

/*
 * A feature defaults to being on for admin users. 
 *
 * Feature flippers should only be in use for a short period of time during testing and then feature should either
 * be quickly rolled out globally - either by first setting global_enabled or just removing the feature flipping code 
 * for that feature altogether -or the feature should be removed from the app.
 *
 * Today, features can be enabled globally, for admins only and/or for a particular set of users.
 * See Feature.is_enabled() for full details.
 *
 * <feature_name> - string name of feature (unique)
 * <user_obj> - user object to check whether the have feature or not
 * <callback> - function of signature function(err, is_enabled);
 */
function feature(feature_name, user_obj, callback) {
  var f = new Feature(feature_name, user_obj);
  return f.is_enabled(callback);
}

module.exports = feature;
