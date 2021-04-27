'use strict';



;define("strider-ui/app", ["exports", "ember-resolver", "ember-load-initializers", "strider-ui/config/environment"], function (_exports, _emberResolver, _emberLoadInitializers, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  class App extends Ember.Application {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "modulePrefix", _environment.default.modulePrefix);

      _defineProperty(this, "podModulePrefix", _environment.default.podModulePrefix);

      _defineProperty(this, "Resolver", _emberResolver.default);
    }

  }

  _exports.default = App;
  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);
});
;define("strider-ui/component-managers/glimmer", ["exports", "@glimmer/component/-private/ember-component-manager"], function (_exports, _emberComponentManager) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberComponentManager.default;
    }
  });
});
;define("strider-ui/components/click-outside", ["exports", "ember-click-outside/component"], function (_exports, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _component.default;
    }
  });
});
;define("strider-ui/components/fa-icon", ["exports", "@fortawesome/ember-fontawesome/components/fa-icon"], function (_exports, _faIcon) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _faIcon.default;
    }
  });
});
;define("strider-ui/components/notification-card", ["exports", "@frontile/notifications/components/notification-card"], function (_exports, _notificationCard) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _notificationCard.default;
    }
  });
});
;define("strider-ui/components/notifications-container", ["exports", "@frontile/notifications/components/notifications-container"], function (_exports, _notificationsContainer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _notificationsContainer.default;
    }
  });
});
;define("strider-ui/components/visually-hidden", ["exports", "@frontile/core/components/visually-hidden"], function (_exports, _visuallyHidden) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _visuallyHidden.default;
    }
  });
});
;define("strider-ui/config/environment.d", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = config;
  /**
   * Type declarations for
   *    import config from './config/environment'
   *
   * For now these need to be managed by the developer
   * since different ember addons can materialize new entries.
   */

  _exports.default = _default;
});
;define("strider-ui/helpers/and", ["exports", "ember-truth-helpers/helpers/and"], function (_exports, _and) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _and.default;
    }
  });
  Object.defineProperty(_exports, "and", {
    enumerable: true,
    get: function () {
      return _and.and;
    }
  });
});
;define("strider-ui/helpers/ansi", ["exports", "strip-ansi", "ansi_up"], function (_exports, _stripAnsi, _ansi_up) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  const ansiUp = new _ansi_up.default();

  var _default = Ember.Helper.helper(function ansi([input], {
    plaintext
  } = {}) {
    if (!input) return '';
    if (input.length > 100000) return input; // handle the characters for "delete line" and "move to start of line"

    let startswithcr = /^[^\n]*\r[^\n]/.test(input);
    /* eslint-disable no-control-regex */

    input = input.replace(/^[^\n\r]*\u001b\[2K/gm, '').replace(/\u001b\[K[^\n\r]*/g, '').replace(/[^\n]*\r([^\n])/g, '$1').replace(/^[^\n]*\u001b\[0G/gm, '');
    if (startswithcr) input = `\r${input}`;
    if (plaintext) return (0, _stripAnsi.default)(input);
    return ansiUp.ansi_to_html(input);
  });

  _exports.default = _default;
});
;define("strider-ui/helpers/app-version", ["exports", "strider-ui/config/environment", "ember-cli-app-version/utils/regexp"], function (_exports, _environment, _regexp) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.appVersion = appVersion;
  _exports.default = void 0;

  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version; // e.g. 1.0.0-alpha.1+4jds75hf
    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility

    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;
    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      } // Fallback to just version


      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  var _default = Ember.Helper.helper(appVersion);

  _exports.default = _default;
});
;define("strider-ui/helpers/cancel-all", ["exports", "ember-concurrency/helpers/cancel-all"], function (_exports, _cancelAll) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _cancelAll.default;
    }
  });
});
;define("strider-ui/helpers/duration", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.duration = duration;
  _exports.default = void 0;

  function duration([value])
  /*, hash*/
  {
    try {
      return Math.round(Number(value) / 1000);
    } catch (e) {
      return value;
    }
  }

  var _default = Ember.Helper.helper(duration);

  _exports.default = _default;
});
;define("strider-ui/helpers/eq", ["exports", "ember-truth-helpers/helpers/equal"], function (_exports, _equal) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _equal.default;
    }
  });
  Object.defineProperty(_exports, "equal", {
    enumerable: true,
    get: function () {
      return _equal.equal;
    }
  });
});
;define("strider-ui/helpers/format-date", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.formatDate = formatDate;
  _exports.default = void 0;

  function formatDate([date])
  /*, hash*/
  {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }).format(new Date(date));
  }

  var _default = Ember.Helper.helper(formatDate);

  _exports.default = _default;
});
;define("strider-ui/helpers/gt", ["exports", "ember-truth-helpers/helpers/gt"], function (_exports, _gt) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _gt.default;
    }
  });
  Object.defineProperty(_exports, "gt", {
    enumerable: true,
    get: function () {
      return _gt.gt;
    }
  });
});
;define("strider-ui/helpers/gte", ["exports", "ember-truth-helpers/helpers/gte"], function (_exports, _gte) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _gte.default;
    }
  });
  Object.defineProperty(_exports, "gte", {
    enumerable: true,
    get: function () {
      return _gte.gte;
    }
  });
});
;define("strider-ui/helpers/is-active", ["exports", "ember-router-helpers/helpers/is-active"], function (_exports, _isActive) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isActive.default;
    }
  });
  Object.defineProperty(_exports, "isActive", {
    enumerable: true,
    get: function () {
      return _isActive.isActive;
    }
  });
});
;define("strider-ui/helpers/is-array", ["exports", "ember-truth-helpers/helpers/is-array"], function (_exports, _isArray) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isArray.default;
    }
  });
  Object.defineProperty(_exports, "isArray", {
    enumerable: true,
    get: function () {
      return _isArray.isArray;
    }
  });
});
;define("strider-ui/helpers/is-empty", ["exports", "ember-truth-helpers/helpers/is-empty"], function (_exports, _isEmpty) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isEmpty.default;
    }
  });
});
;define("strider-ui/helpers/is-equal", ["exports", "ember-truth-helpers/helpers/is-equal"], function (_exports, _isEqual) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _isEqual.default;
    }
  });
  Object.defineProperty(_exports, "isEqual", {
    enumerable: true,
    get: function () {
      return _isEqual.isEqual;
    }
  });
});
;define("strider-ui/helpers/lt", ["exports", "ember-truth-helpers/helpers/lt"], function (_exports, _lt) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _lt.default;
    }
  });
  Object.defineProperty(_exports, "lt", {
    enumerable: true,
    get: function () {
      return _lt.lt;
    }
  });
});
;define("strider-ui/helpers/lte", ["exports", "ember-truth-helpers/helpers/lte"], function (_exports, _lte) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _lte.default;
    }
  });
  Object.defineProperty(_exports, "lte", {
    enumerable: true,
    get: function () {
      return _lte.lte;
    }
  });
});
;define("strider-ui/helpers/not-eq", ["exports", "ember-truth-helpers/helpers/not-equal"], function (_exports, _notEqual) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _notEqual.default;
    }
  });
  Object.defineProperty(_exports, "notEq", {
    enumerable: true,
    get: function () {
      return _notEqual.notEq;
    }
  });
});
;define("strider-ui/helpers/not", ["exports", "ember-truth-helpers/helpers/not"], function (_exports, _not) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _not.default;
    }
  });
  Object.defineProperty(_exports, "not", {
    enumerable: true,
    get: function () {
      return _not.not;
    }
  });
});
;define("strider-ui/helpers/or", ["exports", "ember-truth-helpers/helpers/or"], function (_exports, _or) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _or.default;
    }
  });
  Object.defineProperty(_exports, "or", {
    enumerable: true,
    get: function () {
      return _or.or;
    }
  });
});
;define("strider-ui/helpers/perform", ["exports", "ember-concurrency/helpers/perform"], function (_exports, _perform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _perform.default;
    }
  });
});
;define("strider-ui/helpers/prevent-default", ["exports", "ember-event-helpers/helpers/prevent-default"], function (_exports, _preventDefault) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _preventDefault.default;
    }
  });
  Object.defineProperty(_exports, "preventDefault", {
    enumerable: true,
    get: function () {
      return _preventDefault.preventDefault;
    }
  });
});
;define("strider-ui/helpers/route-params", ["exports", "ember-router-helpers/helpers/route-params"], function (_exports, _routeParams) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _routeParams.default;
    }
  });
  Object.defineProperty(_exports, "routeParams", {
    enumerable: true,
    get: function () {
      return _routeParams.routeParams;
    }
  });
});
;define("strider-ui/helpers/set", ["exports", "ember-simple-set-helper/helpers/set"], function (_exports, _set) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _set.default;
    }
  });
});
;define("strider-ui/helpers/stop-propagation", ["exports", "ember-event-helpers/helpers/stop-propagation"], function (_exports, _stopPropagation) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _stopPropagation.default;
    }
  });
  Object.defineProperty(_exports, "stopPropagation", {
    enumerable: true,
    get: function () {
      return _stopPropagation.stopPropagation;
    }
  });
});
;define("strider-ui/helpers/task", ["exports", "ember-concurrency/helpers/task"], function (_exports, _task) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _task.default;
    }
  });
});
;define("strider-ui/helpers/transition-to", ["exports", "ember-router-helpers/helpers/transition-to"], function (_exports, _transitionTo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _transitionTo.default;
    }
  });
  Object.defineProperty(_exports, "transitionTo", {
    enumerable: true,
    get: function () {
      return _transitionTo.transitionTo;
    }
  });
});
;define("strider-ui/helpers/truncate", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.truncate = truncate;
  _exports.default = void 0;

  function truncate([value])
  /*, hash*/
  {
    try {
      return value && value.slice(0, 10);
    } catch (e) {
      return value;
    }
  }

  var _default = Ember.Helper.helper(truncate);

  _exports.default = _default;
});
;define("strider-ui/helpers/url-for", ["exports", "ember-router-helpers/helpers/url-for"], function (_exports, _urlFor) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _urlFor.default;
    }
  });
  Object.defineProperty(_exports, "urlFor", {
    enumerable: true,
    get: function () {
      return _urlFor.urlFor;
    }
  });
});
;define("strider-ui/helpers/xor", ["exports", "ember-truth-helpers/helpers/xor"], function (_exports, _xor) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _xor.default;
    }
  });
  Object.defineProperty(_exports, "xor", {
    enumerable: true,
    get: function () {
      return _xor.xor;
    }
  });
});
;define("strider-ui/initializers/app-version", ["exports", "ember-cli-app-version/initializer-factory", "strider-ui/config/environment"], function (_exports, _initializerFactory, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  let name, version;

  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  var _default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
  _exports.default = _default;
});
;define("strider-ui/initializers/container-debug-adapter", ["exports", "ember-resolver/resolvers/classic/container-debug-adapter"], function (_exports, _containerDebugAdapter) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];
      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }

  };
  _exports.default = _default;
});
;define("strider-ui/initializers/ember-concurrency", ["exports", "ember-concurrency/initializers/ember-concurrency"], function (_exports, _emberConcurrency) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _emberConcurrency.default;
    }
  });
});
;define("strider-ui/initializers/export-application-global", ["exports", "strider-ui/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.initialize = initialize;
  _exports.default = void 0;

  function initialize() {
    var application = arguments[1] || arguments[0];

    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;

      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;
        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);

            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  var _default = {
    name: 'export-application-global',
    initialize: initialize
  };
  _exports.default = _default;
});
;define("strider-ui/mixins/click-outside", ["exports", "ember-click-outside/mixin"], function (_exports, _mixin) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _mixin.default;
    }
  });
});
;define("strider-ui/modifiers/did-insert", ["exports", "@ember/render-modifiers/modifiers/did-insert"], function (_exports, _didInsert) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _didInsert.default;
    }
  });
});
;define("strider-ui/modifiers/did-update", ["exports", "@ember/render-modifiers/modifiers/did-update"], function (_exports, _didUpdate) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _didUpdate.default;
    }
  });
});
;define("strider-ui/modifiers/on-click-outside", ["exports", "ember-click-outside/modifier"], function (_exports, _modifier) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _modifier.default;
    }
  });
});
;define("strider-ui/modifiers/will-destroy", ["exports", "@ember/render-modifiers/modifiers/will-destroy"], function (_exports, _willDestroy) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _willDestroy.default;
    }
  });
});
;define("strider-ui/pods/application/controller", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _class, _descriptor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let ApplicationController = (_dec = Ember.inject.service, (_class = class ApplicationController extends Ember.Controller {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "currentUser", _descriptor, this);

      _defineProperty(this, "queryParams", ['ember']);

      _defineProperty(this, "ember", false);
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "currentUser", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  _exports.default = ApplicationController;
});
;define("strider-ui/pods/application/route", ["exports", "fetch"], function (_exports, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _class, _descriptor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  const publicRoutes = ['login', 'register', 'forgot-password', 'reset'];
  let ApplicationRoute = (_dec = Ember.inject.service, (_class = class ApplicationRoute extends Ember.Route {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "currentUser", _descriptor, this);
    }

    async beforeModel(transition) {
      try {
        let response = await (0, _fetch.default)('/api/v2/account', {
          headers: {
            Accept: 'application/json'
          }
        });
        let account = await response.json();
        this.currentUser.setProperties(account);
        return account;
      } catch (e) {
        if (!transition.targetName || !publicRoutes.includes(transition.targetName)) {
          this.transitionTo('login');
        }
      }
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "currentUser", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  _exports.default = ApplicationRoute;
});
;define("strider-ui/pods/application/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "+bWtJ0uH",
    "block": "{\"symbols\":[],\"statements\":[[10,\"div\"],[12],[2,\"\\n  \"],[10,\"nav\"],[14,0,\"bg-gray-800\"],[12],[2,\"\\n    \"],[10,\"div\"],[14,0,\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\"],[12],[2,\"\\n      \"],[10,\"div\"],[14,0,\"flex items-center justify-between h-16\"],[12],[2,\"\\n        \"],[10,\"div\"],[14,0,\"flex items-center\"],[12],[2,\"\\n          \"],[10,\"div\"],[14,0,\"flex-shrink-0\"],[12],[2,\"\\n            \"],[10,\"img\"],[14,0,\"h-8 w-8\"],[14,\"src\",\"/assets/images/logo-250x250-transp.png\"],[14,\"alt\",\"Strider\"],[12],[13],[2,\"\\n          \"],[13],[2,\"\\n          \"],[10,\"div\"],[14,0,\"hidden md:block\"],[12],[2,\"\\n\"],[6,[37,0],[[32,0,[\"currentUser\",\"user\"]]],null,[[\"default\"],[{\"statements\":[[2,\"              \"],[10,\"div\"],[14,0,\"ml-4 flex items-baseline\"],[12],[2,\"\\n                \"],[10,\"a\"],[14,6,\"/\"],[14,0,\"ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700\"],[12],[2,\"\\n                  Dashboard\\n                \"],[13],[2,\"\\n\\n                \"],[10,\"a\"],[14,6,\"/projects\"],[14,0,\"ml-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700\"],[12],[2,\"\\n                  Projects\\n                \"],[13],[2,\"\\n\\n                \"],[10,\"div\"],[14,0,\"ml-2 relative\"],[12],[2,\"\\n                  \"],[10,\"div\"],[12],[2,\"\\n                    \"],[11,\"button\"],[24,0,\"max-w-xs px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700\"],[24,4,\"button\"],[4,[38,4],[\"click\",[30,[36,1],[[32,0],\"openAdmin\",[30,[36,3],[[32,0,[\"openAdmin\"]]],null]],null]],null],[12],[2,\"\\n                      Admin\\n                    \"],[13],[2,\"\\n                  \"],[13],[2,\"\\n\\n\"],[6,[37,0],[[32,0,[\"openAdmin\"]]],null,[[\"default\"],[{\"statements\":[[2,\"                    \"],[11,\"div\"],[24,0,\"origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg\"],[4,[38,2],[[30,[36,1],[[32,0],\"openAdmin\",false],null]],null],[12],[2,\"\\n                      \"],[10,\"div\"],[14,0,\"py-1 rounded-md bg-white shadow-xs\"],[12],[2,\"\\n                        \"],[10,\"a\"],[14,6,\"/admin/invites\"],[14,0,\"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100\"],[12],[2,\"\\n                          Invites\\n                        \"],[13],[2,\"\\n                        \"],[10,\"a\"],[14,6,\"/admin/users\"],[14,0,\"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100\"],[12],[2,\"\\n                          Users\\n                        \"],[13],[2,\"\\n                        \"],[10,\"a\"],[14,6,\"/admin/projects\"],[14,0,\"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100\"],[12],[2,\"\\n                          Projects\\n                        \"],[13],[2,\"\\n                        \"],[10,\"a\"],[14,6,\"/admin/plugins\"],[14,0,\"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100\"],[12],[2,\"\\n                          Plugins\\n                        \"],[13],[2,\"\\n                      \"],[13],[2,\"\\n                    \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"                \"],[13],[2,\"\\n              \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"          \"],[13],[2,\"\\n        \"],[13],[2,\"\\n        \"],[10,\"div\"],[14,0,\"hidden md:block\"],[12],[2,\"\\n          \"],[10,\"div\"],[14,0,\"ml-4 flex items-center md:ml-6\"],[12],[2,\"\\n\"],[6,[37,0],[[32,0,[\"currentUser\",\"user\"]]],null,[[\"default\"],[{\"statements\":[[2,\"              \"],[10,\"div\"],[14,0,\"ml-3 relative\"],[12],[2,\"\\n                \"],[10,\"div\"],[12],[2,\"\\n                  \"],[11,\"button\"],[24,0,\"max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid\"],[24,4,\"button\"],[4,[38,4],[\"click\",[30,[36,1],[[32,0],\"isAccountMenuOpen\",[30,[36,3],[[32,0,[\"isAccountMenuOpen\"]]],null]],null]],null],[12],[2,\"\\n                    \"],[10,\"img\"],[14,0,\"h-8 w-8 rounded-full\"],[15,\"src\",[32,0,[\"currentUser\",\"user\",\"gravatar\"]]],[14,\"alt\",\"avatar\"],[12],[13],[2,\"\\n                  \"],[13],[2,\"\\n                \"],[13],[2,\"\\n\\n\"],[6,[37,0],[[32,0,[\"isAccountMenuOpen\"]]],null,[[\"default\"],[{\"statements\":[[2,\"                  \"],[11,\"div\"],[24,0,\"origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg\"],[4,[38,2],[[30,[36,1],[[32,0],\"isAccountMenuOpen\",false],null]],null],[12],[2,\"\\n                    \"],[10,\"div\"],[14,0,\"py-1 rounded-md bg-white shadow-xs\"],[12],[2,\"\\n                      \"],[10,\"a\"],[14,6,\"/account\"],[14,0,\"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100\"],[12],[2,\"\\n                        Account\\n                      \"],[13],[2,\"\\n                      \"],[10,\"a\"],[14,6,\"/logout\"],[14,0,\"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100\"],[12],[2,\"\\n                        Sign out\\n                      \"],[13],[2,\"\\n                    \"],[13],[2,\"\\n                  \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"              \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"          \"],[13],[2,\"\\n        \"],[13],[2,\"\\n        \"],[10,\"div\"],[14,0,\"-mr-2 flex md:hidden\"],[12],[2,\"\\n          \"],[11,\"button\"],[24,0,\"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white\"],[24,4,\"button\"],[4,[38,4],[\"click\",[30,[36,1],[[32,0],\"isAccountMenuOpen\",[30,[36,3],[[32,0,[\"isAccountMenuOpen\"]]],null]],null]],null],[12],[2,\"\\n            \"],[10,\"svg\"],[14,0,\"h-6 w-6\"],[14,\"stroke\",\"currentColor\"],[14,\"fill\",\"none\"],[14,\"viewBox\",\"0 0 24 24\"],[12],[2,\"\\n              \"],[10,\"path\"],[15,0,[30,[36,0],[[32,0,[\"isAccountMenuOpen\"]],\"hidden\",\"inline-flex\"],null]],[14,\"stroke-linecap\",\"round\"],[14,\"stroke-linejoin\",\"round\"],[14,\"stroke-width\",\"2\"],[14,\"d\",\"M4 6h16M4 12h16M4 18h16\"],[12],[13],[2,\"\\n              \"],[10,\"path\"],[15,0,[30,[36,0],[[32,0,[\"isAccountMenuOpen\"]],\"inline-flex\",\"hidden\"],null]],[14,\"stroke-linecap\",\"round\"],[14,\"stroke-linejoin\",\"round\"],[14,\"stroke-width\",\"2\"],[14,\"d\",\"M6 18L18 6M6 6l12 12\"],[12],[13],[2,\"\\n            \"],[13],[2,\"\\n          \"],[13],[2,\"\\n        \"],[13],[2,\"\\n      \"],[13],[2,\"\\n    \"],[13],[2,\"\\n\\n\"],[6,[37,0],[[32,0,[\"currentUser\",\"user\"]]],null,[[\"default\"],[{\"statements\":[[2,\"      \"],[10,\"div\"],[15,0,[31,[\"hidden md:hidden \",[30,[36,0],[[32,0,[\"isAccountMenuOpen\"]],\"block\",\"hidden\"],null]]]],[12],[2,\"\\n        \"],[10,\"div\"],[14,0,\"px-2 pt-2 pb-3 sm:px-3\"],[12],[2,\"\\n          \"],[10,\"a\"],[14,6,\"/\"],[14,0,\"block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700\"],[12],[2,\"\\n            Dashboard\\n          \"],[13],[2,\"\\n\\n          \"],[10,\"a\"],[14,6,\"/projects\"],[14,0,\"block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700\"],[12],[2,\"\\n            Projects\\n          \"],[13],[2,\"\\n        \"],[13],[2,\"\\n        \"],[10,\"div\"],[14,0,\"pt-4 pb-3 border-t border-gray-700\"],[12],[2,\"\\n          \"],[10,\"div\"],[14,0,\"flex items-center px-5\"],[12],[2,\"\\n            \"],[10,\"div\"],[14,0,\"flex-shrink-0\"],[12],[2,\"\\n              \"],[10,\"img\"],[14,0,\"h-10 w-10 rounded-full\"],[15,\"src\",[32,0,[\"currentUser\",\"user\",\"gravatar\"]]],[14,\"alt\",\"User avatar\"],[12],[13],[2,\"\\n            \"],[13],[2,\"\\n            \"],[10,\"div\"],[14,0,\"ml-3\"],[12],[2,\"\\n              \"],[10,\"div\"],[14,0,\"text-base font-medium leading-none text-white\"],[12],[2,\"\\n                \"],[1,[32,0,[\"currentUser\",\"user\",\"name\"]]],[2,\"\\n              \"],[13],[2,\"\\n              \"],[10,\"div\"],[14,0,\"mt-1 text-sm font-medium leading-none text-gray-400\"],[12],[2,\"\\n                \"],[1,[32,0,[\"currentUser\",\"user\",\"email\"]]],[2,\"\\n              \"],[13],[2,\"\\n            \"],[13],[2,\"\\n          \"],[13],[2,\"\\n          \"],[10,\"div\"],[14,0,\"mt-3 px-2\"],[12],[2,\"\\n            \"],[10,\"a\"],[14,6,\"/account\"],[14,0,\"block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700\"],[12],[2,\"\\n              Account\\n            \"],[13],[2,\"\\n            \"],[10,\"a\"],[14,6,\"/logout\"],[14,0,\"mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700\"],[12],[2,\"\\n              Sign out\\n            \"],[13],[2,\"\\n          \"],[13],[2,\"\\n        \"],[13],[2,\"\\n      \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"  \"],[13],[2,\"\\n\"],[2,\"  \"],[10,\"main\"],[14,0,\"bg-gray-100 main\"],[12],[2,\"\\n    \"],[10,\"div\"],[14,0,\"max-w-7xl mx-auto py-6 sm:px-6 lg:px-8\"],[12],[2,\"\\n      \"],[1,[30,[36,6],[[30,[36,5],null,null]],null]],[2,\"\\n\"],[2,\"    \"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"],[13],[2,\"\\n\\n\"],[8,\"notifications-container\",[],[[\"@placement\"],[\"bottom-right\"]],null],[2,\"\\n\"]],\"hasEval\":false,\"upvars\":[\"if\",\"set\",\"on-click-outside\",\"not\",\"on\",\"-outlet\",\"component\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/application/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/components/controls/component", ["exports", "@glimmer/component", "socket.io-client"], function (_exports, _component, _socket) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _dec2, _class;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  let RepoControls = (_dec = Ember._action, _dec2 = Ember._action, (_class = class RepoControls extends _component.default {
    constructor(owner, args) {
      super(owner, args);

      _defineProperty(this, "socket", void 0);

      let socket = _socket.default.connect();

      this.socket = socket;
    }

    deploy() {
      let branch = this.args.repo.job && this.args.repo.ref.branch;
      this.socket.emit('deploy', this.args.repo.project, branch);
    }

    test() {
      let branch = this.args.repo.job && this.args.repo.ref.branch;
      this.socket.emit('test', this.args.repo.project, branch);
    }

  }, (_applyDecoratedDescriptor(_class.prototype, "deploy", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "deploy"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "test", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "test"), _class.prototype)), _class));
  _exports.default = RepoControls;
});
;define("strider-ui/pods/components/controls/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "zUK3CF/0",
    "block": "{\"symbols\":[\"&attrs\",\"@repo\",\"@onToggleRecentBuilds\"],\"statements\":[[11,\"div\"],[24,0,\"flex items-center\"],[17,1],[12],[2,\"\\n  \"],[11,\"button\"],[24,0,\"bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white text-sm py-1 px-2 border border-blue-500 hover:border-transparent rounded-full shadow mr-2\"],[24,4,\"button\"],[4,[38,0],[\"click\",[32,0,[\"deploy\"]]],null],[12],[2,\"\\n    Deploy\\n  \"],[13],[2,\"\\n\\n  \"],[11,\"button\"],[24,0,\"bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white text-sm py-1 px-2 border border-blue-500 hover:border-transparent rounded-full shadow\"],[24,4,\"button\"],[4,[38,0],[\"click\",[32,0,[\"test\"]]],null],[12],[2,\"\\n    Test\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"a\"],[15,6,[31,[\"/\",[32,2,[\"project\"]],\"/config/\"]]],[14,0,\"ml-2 bg-white hover:bg-gray-100 text-gray-800 text-sm py-1 px-2 border border-gray-400 rounded-full shadow\"],[12],[2,\"\\n    \"],[8,\"fa-icon\",[],[[\"@icon\",\"@prefix\"],[\"cog\",\"fas\"]],null],[2,\"\\n  \"],[13],[2,\"\\n\\n  \"],[11,\"button\"],[24,0,\"ml-2 bg-white hover:bg-gray-100 text-gray-800 text-sm py-1 px-2 border border-gray-400 rounded-full shadow\"],[24,4,\"button\"],[4,[38,0],[\"click\",[32,3]],null],[12],[2,\"\\n    \"],[8,\"fa-icon\",[[24,0,\"mr-2\"]],[[\"@icon\",\"@prefix\"],[\"tasks\",\"fas\"]],null],[2,\"\\n    Recent Builds\\n  \"],[13],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[\"on\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/components/controls/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/components/job/component", ["exports", "@glimmer/component", "socket.io-client"], function (_exports, _component, _socket) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _dec2, _class, _descriptor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let Job = (_dec = Ember._tracked, _dec2 = Ember._action, (_class = class Job extends _component.default {
    constructor(owner, args) {
      super(owner, args);

      _defineProperty(this, "socket", void 0);

      _initializerDefineProperty(this, "isErrorStackVisible", _descriptor, this);

      let socket = _socket.default.connect();

      this.socket = socket;
    }

    cancel(jobId) {
      this.socket.emit('cancel', jobId);
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "isErrorStackVisible", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _applyDecoratedDescriptor(_class.prototype, "cancel", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "cancel"), _class.prototype)), _class));
  _exports.default = Job;
});
;define("strider-ui/pods/components/job/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "EKmNTsKB",
    "block": "{\"symbols\":[\"phase\",\"command\",\"phase\",\"key\",\"@job\",\"&attrs\"],\"statements\":[[11,\"div\"],[24,0,\"flex\"],[17,6],[12],[2,\"\\n  \"],[10,\"section\"],[14,0,\"flex flex-1 flex-col w-8/12\"],[12],[2,\"\\n    \"],[10,\"div\"],[14,0,\"bg-white p-4 mb-4 rounded-lg shadow-lg\"],[12],[2,\"\\n      \"],[10,\"div\"],[14,0,\"flex flex-col justify-center mb-4\"],[12],[2,\"\\n        \"],[10,\"div\"],[14,0,\"flex justify-between items-start\"],[12],[2,\"\\n          \"],[10,\"div\"],[14,0,\"flex\"],[12],[2,\"\\n            \"],[8,\"status\",[[24,0,\"flex text-3xl mr-2\"]],[[\"@status\"],[[32,5,[\"status\"]]]],null],[2,\"\\n\\n            \"],[10,\"div\"],[14,0,\"flex flex-col\"],[12],[2,\"\\n              \"],[1,[32,5,[\"trigger\",\"message\"]]],[2,\"\\n\\n              \"],[10,\"div\"],[14,0,\"text-gray-800 text-sm\"],[12],[2,\"\\n                \"],[1,[32,5,[\"ref\",\"branch\"]]],[2,\"\\n                \"],[1,[30,[36,16],[[32,5,[\"ref\",\"id\"]]],null]],[2,\"\\n              \"],[13],[2,\"\\n\\n              \"],[10,\"div\"],[14,0,\"mt-1 text-gray-800 text-sm\"],[12],[2,\"\\n                \"],[1,[30,[36,17],[[32,5,[\"created\"]]],null]],[2,\"\\n              \"],[13],[2,\"\\n            \"],[13],[2,\"\\n          \"],[13],[2,\"\\n\\n\"],[6,[37,2],[[30,[36,12],[[32,5,[\"status\"]],\"running\"],null]],null,[[\"default\"],[{\"statements\":[[2,\"            \"],[11,\"button\"],[24,0,\"bg-transparent hover:bg-gray-100 text-gray-800 text-sm py-1 px-2 border border-gray-400 rounded-full shadow\"],[24,4,\"button\"],[4,[38,10],[\"click\",[30,[36,15],[[32,0,[\"cancel\"]],[32,5,[\"_id\"]]],null]],null],[12],[2,\"\\n              Cancel\\n            \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"        \"],[13],[2,\"\\n\\n        \"],[10,\"div\"],[14,0,\"flex items-center mt-2\"],[12],[2,\"\\n          \"],[10,\"img\"],[15,\"src\",[32,5,[\"trigger\",\"author\",\"image\"]]],[14,0,\"rounded-full w-8 mr-2\"],[14,\"alt\",\"Author avatar\"],[12],[13],[2,\"\\n          \"],[1,[32,5,[\"trigger\",\"author\",\"name\"]]],[2,\"\\n        \"],[13],[2,\"\\n      \"],[13],[2,\"\\n\\n      \"],[10,\"ul\"],[14,0,\"flex flex-wrap\"],[12],[2,\"\\n\"],[6,[37,5],[[30,[36,18],[[32,5,[\"phases\"]]],null]],null,[[\"default\"],[{\"statements\":[[2,\"          \"],[10,\"li\"],[12],[2,\"\\n            \"],[11,\"button\"],[16,0,[31,[\"\\n\\n                \",[30,[36,2],[[30,[36,12],[[32,0,[\"selectedPhase\"]],[32,4]],null],\"bg-blue-800 border-blue-800 text-white\"],null],\"\\n\\n\\n                \",[30,[36,2],[[30,[36,12],[[32,5,[\"phase\"]],[32,4]],null],\"border-pink-400\"],null],\"\\n\\n                 flex items-center border border-gray-300 rounded-full flex item-center text-center px-3 py-1 mr-2\\n                mb-2 md:mb-0\\n                \"]]],[24,4,\"button\"],[4,[38,10],[\"click\",[30,[36,15],[[30,[36,14],[[32,0,[\"selectedPhase\"]]],null],[32,4]],null]],null],[12],[2,\"\\n\"],[6,[37,2],[[30,[36,12],[[32,5,[\"phase\"]],[32,4]],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"                \"],[8,\"fa-icon\",[[24,0,\"text-gray-400 mr-2\"]],[[\"@icon\",\"@spin\",\"@prefix\"],[\"circle-notch\",true,\"fas\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,2],[[30,[36,13],[[32,3,[\"exitCode\"]],0],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"                \"],[8,\"fa-icon\",[[24,0,\"text-red-500 mr-2\"]],[[\"@icon\",\"@prefix\"],[\"times-circle\",\"fas\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,2],[[30,[36,12],[[32,3,[\"exitCode\"]],0],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"                \"],[8,\"fa-icon\",[[24,0,\"text-green-500 mr-2\"]],[[\"@icon\",\"@prefix\"],[\"check-circle\",\"fas\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,2],[[30,[36,12],[[32,3,[\"exitCode\"]],-1],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"                \"],[8,\"fa-icon\",[[24,0,\"text-gray-300 mr-2\"]],[[\"@icon\",\"@prefix\"],[\"lock\",\"fas\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,2],[[30,[36,11],[[30,[36,8],[[32,3,[\"exitCode\"]]],null],[32,3,[\"finished\"]],[32,3,[\"commands\",\"length\"]]],null]],null,[[\"default\"],[{\"statements\":[[2,\"                \"],[8,\"fa-icon\",[[24,0,\"text-orange-500 mr-2\"]],[[\"@icon\",\"@prefix\"],[\"exclamation-triangle\",\"fas\"]],null],[2,\"\\n              \"]],\"parameters\":[]}]]]],\"parameters\":[]}]]]],\"parameters\":[]}]]]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"\\n              \"],[1,[32,4]],[2,\"\\n            \"],[13],[2,\"\\n          \"],[13],[2,\"\\n\"]],\"parameters\":[3,4]}]]],[2,\"      \"],[13],[2,\"\\n    \"],[13],[2,\"\\n\\n\"],[6,[37,2],[[32,5,[\"error\"]]],null,[[\"default\"],[{\"statements\":[[2,\"      \"],[10,\"div\"],[14,0,\"bg-white p-4 mb-4 rounded-lg shadow\"],[12],[2,\"\\n        \"],[11,\"button\"],[24,4,\"button\"],[4,[38,10],[\"click\",[30,[36,9],[[32,0],\"isErrorStackVisible\",[30,[36,8],[[32,0,[\"isErrorStackVisible\"]]],null]],null]],null],[12],[2,\"\\n          \"],[1,[32,5,[\"error\",\"message\"]]],[2,\"\\n        \"],[13],[2,\"\\n\\n\"],[6,[37,2],[[32,0,[\"isErrorStackVisible\"]]],null,[[\"default\"],[{\"statements\":[[2,\"          \"],[10,\"pre\"],[14,0,\"text-sm whitespace-normal mt-2 text-gray-600\"],[12],[2,\"            \"],[1,[32,5,[\"error\",\"stack\"]]],[2,\"          \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"      \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"\\n\"],[6,[37,2],[[32,0,[\"selectedPhase\"]]],null,[[\"default\"],[{\"statements\":[[2,\"      \"],[10,\"div\"],[12],[2,\"\\n\"],[6,[37,7],[[30,[36,6],[[32,5,[\"phases\"]],[32,0,[\"selectedPhase\"]]],null]],null,[[\"default\"],[{\"statements\":[[6,[37,5],[[30,[36,4],[[30,[36,4],[[32,1,[\"commands\"]]],null]],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"            \"],[10,\"section\"],[14,0,\"mb-2\"],[12],[2,\"\\n              \"],[10,\"header\"],[14,0,\"flex justify-between bg-gray-700 text-white text-sm rounded rounded-b-none p-2 block\"],[12],[2,\"\\n                \"],[10,\"div\"],[12],[2,\"\\n                  \"],[10,\"span\"],[14,0,\"inline-flex p-1 rounded bg-gray-500 mr-2\"],[12],[2,\"\\n                    \"],[1,[32,2,[\"plugin\"]]],[2,\"\\n                  \"],[13],[2,\"\\n\\n                  \"],[10,\"span\"],[12],[2,\"\\n                    \"],[1,[30,[36,2],[[32,2,[\"comment\"]],\"#\",\"$\"],null]],[2,\" \"],[1,[32,2,[\"command\"]]],[2,\"\\n                  \"],[13],[2,\"\\n                \"],[13],[2,\"\\n\\n\"],[6,[37,2],[[30,[36,3],[[32,2,[\"duration\"]],0],null]],null,[[\"default\"],[{\"statements\":[[2,\"                  \"],[10,\"div\"],[14,0,\"rounded p-1 bg-gray-600\"],[12],[2,\"\\n                    \"],[1,[30,[36,1],[[32,2,[\"duration\"]]],null]],[2,\"s\\n                  \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"              \"],[13],[2,\"\\n\\n\"],[6,[37,2],[[32,2,[\"merged\"]]],null,[[\"default\"],[{\"statements\":[[2,\"                \"],[10,\"code\"],[14,0,\"text-xs\"],[12],[2,\"\\n                  \"],[10,\"pre\"],[14,0,\"bg-gray-800 text-white rounded rounded-t-none p-2 text-xs overflow-x-auto whitespace-normal\"],[12],[2,\"                    \"],[2,[30,[36,0],[[32,2,[\"merged\"]]],null]],[2,\"                  \"],[13],[2,\"\\n                \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"            \"],[13],[2,\"\\n\"]],\"parameters\":[2]},{\"statements\":[[2,\"            No output to display\\n\"]],\"parameters\":[]}]]]],\"parameters\":[1]}]]],[2,\"      \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"  \"],[13],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[\"ansi\",\"duration\",\"if\",\"gte\",\"-track-array\",\"each\",\"get\",\"let\",\"not\",\"set\",\"on\",\"and\",\"eq\",\"gt\",\"mut\",\"fn\",\"truncate\",\"format-date\",\"-each-in\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/components/job/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/components/live-job/component", ["exports", "@glimmer/component", "socket.io-client", "lodash-es", "strider-ui/utils/legacy/phases", "strider-ui/utils/legacy/skels"], function (_exports, _component, _socket, _lodashEs, _phases, _skels) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _descriptor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let LiveJob = (_dec = Ember.inject.service, _dec2 = Ember._action, _dec3 = Ember._action, _dec4 = Ember._action, _dec5 = Ember._action, _dec6 = Ember._action, _dec7 = Ember._action, _dec8 = Ember._action, _dec9 = Ember._action, _dec10 = Ember._action, _dec11 = Ember._action, _dec12 = Ember._action, (_class = class LiveJob extends _component.default {
    constructor(owner, args) {
      super(owner, args);

      _initializerDefineProperty(this, "live", _descriptor, this);

      _defineProperty(this, "socket", void 0);

      let socket = _socket.default.connect();

      this.socket = socket;
      socket.on('job.new', this.handleNewJob);
      socket.on('job.status.started', this.handleJobStarted);
      socket.on('job.status.command.start', this.handleCommandStart);
      socket.on('job.status.command.comment', this.handleCommandComment);
      socket.on('job.status.command.done', this.handleCommandDone);
      socket.on('job.status.stdout', this.handleStdOut);
      socket.on('job.status.phase.done', this.handleJobPhaseDone);
      socket.on('job.status.warning', this.handleJobWarning);
      socket.on('job.status.errored', this.handleJobErrored);
      socket.on('job.status.canceled', this.handleJobErrored);
      socket.on('job.done', this.handleJobDone);
    }

    getJob(jobId) {
      let job = (0, _lodashEs.cloneDeep)(this.live.jobs.find(item => item._id === jobId));

      if (!job.phase) {
        job.phase = 'environment';
      }

      if (!job.phases) {
        job.phases = {};

        _phases.default.forEach(phase => {
          job.phases[phase] = (0, _lodashEs.cloneDeep)(_skels.default.phase);
        });

        job.phases[job.phase].started = new Date();
      }

      return job;
    }

    handleNewJob([job]) {
      if (!job.phase) {
        job.phase = 'environment';
      }

      if (!job.std) {
        job.std = {
          out: '',
          err: '',
          merged: ''
        };
      }

      if (!job.phases) {
        job.phases = {};

        _phases.default.forEach(phase => {
          job.phases[phase] = (0, _lodashEs.cloneDeep)(_skels.default.phase);
        });

        job.phases[job.phase].started = new Date();
      }

      this.updateJob(job);
    }

    handleJobStarted([jobId, time]) {
      let job = this.getJob(jobId);

      if (!job) {
        return;
      }

      job.started = time;
      job.phase = 'environment';
      job.status = 'running';
      this.updateJob(job);
    }

    handleCommandStart([jobId, data]) {
      let job = this.getJob(jobId);

      if (!job) {
        return;
      }

      let phase = job.phases[job.phase];
      let command = Object.assign({}, _skels.default.command, data);
      command.started = data.time;
      phase.commands.push(command);
      this.updateJob(job);
    }

    handleCommandComment([jobId, data]) {
      let job = this.getJob(jobId);

      if (!job) {
        return;
      }

      let phase = job.phases[job.phase];
      let command = Object.assign({}, _skels.default.command);
      command.command = data.comment;
      command.comment = true;
      command.plugin = data.plugin;
      command.finished = data.time;
      phase.commands.push(command);
      this.updateJob(job);
    }

    handleCommandDone([jobId, data]) {
      let job = this.getJob(jobId);

      if (!job) {
        return;
      }

      let phase = job.phases[job.phase];
      let command = phase.commands[phase.commands.length - 1];
      command.finished = data.time;
      command.duration = data.elapsed;
      command.exitCode = data.exitCode;
      command.merged = command._merged;
      this.updateJob(job);
    }

    handleJobPhaseDone([jobId, data]) {
      let job = this.getJob(jobId);

      if (!job) {
        return;
      }

      job.phases[data.phase].finished = data.time;
      job.phases[data.phase].duration = data.elapsed;
      job.phases[data.phase].exitCode = data.code;
      if (data.phase === 'test') job.test_status = data.code;
      if (data.phase === 'deploy') job.deploy_status = data.code;
      if (!data.next || !job.phases[data.next]) return;
      job.phase = data.next;
      this.updateJob(job);
    }

    handleStdOut([jobId, text]) {
      let job = this.getJob(jobId);

      if (!job) {
        return;
      }

      let currentPhase = job.phase;
      let phase = job.phases[currentPhase];
      let command = ensureCommand(phase);
      command.merged += text;
      job.phases[currentPhase] = phase;
      this.updateJob(job);
    }

    handleJobWarning([jobId, warning]) {
      let job = this.getJob(jobId);

      if (!job) {
        return;
      }

      if (!job.warnings) {
        job.warnings = [];
      }

      job.warnings.push(warning);
      this.updateJob(job);
    }

    handleJobErrored([jobId, error]) {
      let job = this.getJob(jobId);

      if (!job) {
        return;
      }

      job.error = error;
      job.status = 'errored';
      job.phase = null;
      this.updateJob(job);
    }

    handleJobDone([job]) {
      debugger;
      this.updateJob(job);
    }

    updateJob(job) {
      this.live.updateJob(job);
    }

    willDestroy() {
      super.willDestroy();
      const socket = this.socket;
      socket.off('job.new', this.handleNewJob);
      socket.off('job.status.started', this.handleJobStarted);
      socket.off('job.status.command.start', this.handleCommandStart);
      socket.off('job.status.command.comment', this.handleCommandComment);
      socket.off('job.status.command.done', this.handleCommandDone);
      socket.off('job.status.stdout', this.handleStdOut);
      socket.off('job.status.phase.done', this.handleJobPhaseDone);
      socket.off('job.status.warning', this.handleJobWarning);
      socket.off('job.status.errored', this.handleJobErrored);
      socket.off('job.status.canceled', this.handleJobErrored);
      socket.off('job.done', this.handleJobDone);
      socket.close();
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "live", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class.prototype, "getJob", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "getJob"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleNewJob", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "handleNewJob"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleJobStarted", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "handleJobStarted"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleCommandStart", [_dec5], Object.getOwnPropertyDescriptor(_class.prototype, "handleCommandStart"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleCommandComment", [_dec6], Object.getOwnPropertyDescriptor(_class.prototype, "handleCommandComment"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleCommandDone", [_dec7], Object.getOwnPropertyDescriptor(_class.prototype, "handleCommandDone"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleJobPhaseDone", [_dec8], Object.getOwnPropertyDescriptor(_class.prototype, "handleJobPhaseDone"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleStdOut", [_dec9], Object.getOwnPropertyDescriptor(_class.prototype, "handleStdOut"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleJobWarning", [_dec10], Object.getOwnPropertyDescriptor(_class.prototype, "handleJobWarning"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleJobErrored", [_dec11], Object.getOwnPropertyDescriptor(_class.prototype, "handleJobErrored"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleJobDone", [_dec12], Object.getOwnPropertyDescriptor(_class.prototype, "handleJobDone"), _class.prototype)), _class));
  _exports.default = LiveJob;

  function ensureCommand(phase) {
    let command = phase.commands[phase.commands.length - 1];

    if (!command || typeof command.finished !== 'undefined') {
      command = Object.assign({}, _skels.default.command);
      phase.commands.push(command);
    }

    return command;
  }
});
;define("strider-ui/pods/components/live-job/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "dZLUHJda",
    "block": "{\"symbols\":[\"&default\"],\"statements\":[[18,1,[[32,0,[\"live\",\"jobs\"]]]]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "strider-ui/pods/components/live-job/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/components/live-projects/component", ["exports", "@glimmer/component", "socket.io-client", "lodash-es", "strider-ui/utils/legacy/phases", "strider-ui/utils/legacy/skels"], function (_exports, _component, _socket, _lodashEs, _phases, _skels) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _descriptor, _descriptor2, _descriptor3;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let LiveProjects = (_dec = Ember.inject.service, _dec2 = Ember._tracked, _dec3 = Ember._tracked, _dec4 = Ember._action, _dec5 = Ember._action, _dec6 = Ember._action, _dec7 = Ember._action, (_class = class LiveProjects extends _component.default {
    constructor(owner, args) {
      super(owner, args);

      _initializerDefineProperty(this, "live", _descriptor, this);

      _initializerDefineProperty(this, "yours", _descriptor2, this);

      _initializerDefineProperty(this, "public", _descriptor3, this);

      _defineProperty(this, "socket", void 0);

      this.yours = this.args.jobs.yours;
      this.public = this.args.jobs.public;

      let socket = _socket.default.connect();

      this.socket = socket;
      socket.on('job.new', this.handleNewJob);
      socket.on('job.status.started', this.handleJobStarted); // socket.on('job.status.command.start', this.handleCommandStart);
      // socket.on('job.status.command.comment', this.handleCommandComment);
      // socket.on('job.status.command.done', this.handleCommandDone);
      // socket.on('job.status.stdout', this.handleStdOut);
      // socket.on('job.status.phase.done', this.handleJobPhaseDone);
      // socket.on('job.status.warning', this.handleJobWarning);
      // socket.on('job.status.errored', this.handleJobErrored);
      // socket.on('job.status.canceled', this.handleJobErrored);

      socket.on('job.done', this.handleJobDone);
    }

    findJob(projectName, jobId) {
      let yours = this.yours.find(item => item._id);
    }

    getJob(projectName, jobId) {
      debugger;
      let job = (0, _lodashEs.cloneDeep)(this.live.jobs.find(item => item._id === jobId));

      if (!job.phase) {
        job.phase = 'environment';
      }

      if (!job.phases) {
        job.phases = {};

        _phases.default.forEach(phase => {
          job.phases[phase] = (0, _lodashEs.cloneDeep)(_skels.default.phase);
        });

        job.phases[job.phase].started = new Date();
      }

      return job;
    }

    handleNewJob([job]) {
      debugger;

      if (!job.phase) {
        job.phase = 'environment';
      }

      if (!job.std) {
        job.std = {
          out: '',
          err: '',
          merged: ''
        };
      }

      if (!job.phases) {
        job.phases = {};

        _phases.default.forEach(phase => {
          job.phases[phase] = (0, _lodashEs.cloneDeep)(_skels.default.phase);
        });

        job.phases[job.phase].started = new Date();
      }

      this.updateJob(job);
    }

    handleJobStarted([jobId, time, whos, projectName]) {
      let job = this.getJob(projectName, jobId);

      if (!job) {
        return;
      }

      job.started = time;
      job.phase = 'environment';
      job.status = 'running';
      this.updateJob(job);
    } // @action
    // handleCommandStart([jobId, data]: [string, any]) {
    //   let job = this.getJob(jobId);
    //   if (!job) {
    //     return;
    //   }
    //   let phase = job.phases[job.phase];
    //   let command = Object.assign({}, SKELS.command, data);
    //   command.started = data.time;
    //   phase.commands.push(command);
    //   this.updateJob(job);
    // }
    // @action
    // handleCommandComment([jobId, data]: [string, any]) {
    //   let job = this.getJob(jobId);
    //   if (!job) {
    //     return;
    //   }
    //   let phase = job.phases[job.phase];
    //   let command = Object.assign({}, SKELS.command) as any;
    //   command.command = data.comment;
    //   command.comment = true;
    //   command.plugin = data.plugin;
    //   command.finished = data.time;
    //   phase.commands.push(command);
    //   this.updateJob(job);
    // }
    // @action
    // handleCommandDone([jobId, data]: [string, any]) {
    //   let job = this.getJob(jobId);
    //   if (!job) {
    //     return;
    //   }
    //   let phase = job.phases[job.phase];
    //   let command = phase.commands[phase.commands.length - 1];
    //   command.finished = data.time;
    //   command.duration = data.elapsed;
    //   command.exitCode = data.exitCode;
    //   command.merged = command._merged;
    //   this.updateJob(job);
    // }
    // @action
    // handleJobPhaseDone([jobId, data]: [string, any]) {
    //   let job = this.getJob(jobId);
    //   if (!job) {
    //     return;
    //   }
    //   job.phases[data.phase].finished = data.time;
    //   job.phases[data.phase].duration = data.elapsed;
    //   job.phases[data.phase].exitCode = data.code;
    //   if (data.phase === 'test') job.test_status = data.code;
    //   if (data.phase === 'deploy') job.deploy_status = data.code;
    //   if (!data.next || !job.phases[data.next]) return;
    //   job.phase = data.next;
    //   this.updateJob(job);
    // }
    // @action
    // handleStdOut([jobId, text]: [string, string]) {
    //   let job = this.getJob(jobId);
    //   if (!job) {
    //     return;
    //   }
    //   let currentPhase = job.phase;
    //   let phase = job.phases[currentPhase];
    //   let command = ensureCommand(phase);
    //   command.merged += text;
    //   job.phases[currentPhase] = phase;
    //   this.updateJob(job);
    // }
    // @action
    // handleJobWarning([jobId, warning]: [string, string]) {
    //   let job = this.getJob(jobId);
    //   if (!job) {
    //     return;
    //   }
    //   if (!job.warnings) {
    //     job.warnings = [];
    //   }
    //   job.warnings.push(warning);
    //   this.updateJob(job);
    // }
    // @action
    // handleJobErrored([jobId, error]: [string, any]) {
    //   let job = this.getJob(jobId);
    //   if (!job) {
    //     return;
    //   }
    //   job.error = error;
    //   job.status = 'errored';
    //   job.phase = null;
    //   this.updateJob(job);
    // }


    handleJobDone([job]) {
      this.updateJob(job);
    }

    updateJob(job) {
      this.live.updateJob(job);
    }

    willDestroy() {
      super.willDestroy();
      const socket = this.socket;
      socket.off('job.new', this.handleNewJob);
      socket.off('job.status.started', this.handleJobStarted); // socket.off('job.status.command.start', this.handleCommandStart);
      // socket.off('job.status.command.comment', this.handleCommandComment);
      // socket.off('job.status.command.done', this.handleCommandDone);
      // socket.off('job.status.stdout', this.handleStdOut);
      // socket.off('job.status.phase.done', this.handleJobPhaseDone);
      // socket.off('job.status.warning', this.handleJobWarning);
      // socket.off('job.status.errored', this.handleJobErrored);
      // socket.off('job.status.canceled', this.handleJobErrored);

      socket.off('job.done', this.handleJobDone);
      socket.close();
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "live", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "yours", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "public", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class.prototype, "getJob", [_dec4], Object.getOwnPropertyDescriptor(_class.prototype, "getJob"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleNewJob", [_dec5], Object.getOwnPropertyDescriptor(_class.prototype, "handleNewJob"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleJobStarted", [_dec6], Object.getOwnPropertyDescriptor(_class.prototype, "handleJobStarted"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "handleJobDone", [_dec7], Object.getOwnPropertyDescriptor(_class.prototype, "handleJobDone"), _class.prototype)), _class)); // function ensureCommand(phase: any) {
  //   let command = phase.commands[phase.commands.length - 1];
  //   if (!command || typeof command.finished !== 'undefined') {
  //     command = Object.assign({}, SKELS.command);
  //     phase.commands.push(command);
  //   }
  //   return command;
  // }

  _exports.default = LiveProjects;
});
;define("strider-ui/pods/components/live-projects/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "qLfwD3tR",
    "block": "{\"symbols\":[\"&default\"],\"statements\":[[18,1,[[30,[36,0],null,[[\"yours\",\"public\"],[[32,0,[\"yours\"]],[32,0,[\"public\"]]]]]]]],\"hasEval\":false,\"upvars\":[\"hash\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/components/live-projects/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/components/project/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "7J1hiOtU",
    "block": "{\"symbols\":[\"@job\",\"&attrs\"],\"statements\":[[8,\"link-to\",[[24,0,\"bg-white p-4 mb-4 rounded-lg shadow hover:shadow-lg block\"],[17,2]],[[\"@route\",\"@models\",\"@queryParams\"],[\"organization.repository.job\",[30,[36,0],[[32,1,[\"project\",\"ownerName\"]],[32,1,[\"project\",\"repoName\"]],[32,1,[\"_id\"]]],null],[30,[36,1],null,[[\"ember\"],[true]]]]],[[\"default\"],[{\"statements\":[[2,\"\\n  \"],[10,\"div\"],[14,0,\"flex justify-between\"],[12],[2,\"\\n    \"],[10,\"div\"],[14,0,\"text-lg\"],[12],[2,\"\\n      \"],[1,[32,1,[\"project\",\"display_name\"]]],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[10,\"div\"],[14,0,\"flex items-center\"],[12],[2,\"\\n      \"],[10,\"img\"],[15,\"src\",[32,1,[\"trigger\",\"author\",\"image\"]]],[14,0,\"rounded-full w-8 mr-2\"],[14,\"alt\",\"Author avatar\"],[12],[13],[2,\"\\n      \"],[1,[32,1,[\"trigger\",\"author\",\"name\"]]],[2,\"\\n    \"],[13],[2,\"\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"div\"],[14,0,\"flex flex-cols mt-2\"],[12],[2,\"\\n    \"],[8,\"status\",[[24,0,\"mr-2\"]],[[\"@status\"],[[32,1,[\"status\"]]]],null],[2,\"\\n    \"],[1,[32,1,[\"trigger\",\"message\"]]],[2,\"\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"div\"],[14,0,\"flex flex-cols justify-between items-center\"],[12],[2,\"\\n    \"],[10,\"div\"],[14,0,\"text-gray-800 text-sm\"],[12],[2,\"\\n      \"],[1,[32,1,[\"ref\",\"branch\"]]],[2,\"\\n      \"],[1,[30,[36,2],[[32,1,[\"ref\",\"id\"]]],null]],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[10,\"div\"],[14,0,\"mt-1 text-gray-800 text-sm\"],[12],[2,\"\\n      \"],[1,[30,[36,3],[[32,1,[\"created\"]]],null]],[2,\"\\n    \"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]]],\"hasEval\":false,\"upvars\":[\"array\",\"hash\",\"truncate\",\"format-date\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/components/project/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/components/status/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "ELnSihAY",
    "block": "{\"symbols\":[\"@status\",\"&attrs\"],\"statements\":[[11,\"div\"],[17,2],[12],[2,\"\\n\"],[6,[37,1],[[30,[36,0],[[32,1],\"running\"],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"    \"],[8,\"fa-icon\",[[24,0,\"text-blue-500\"]],[[\"@icon\",\"@spin\",\"@prefix\"],[\"circle-notch\",true,\"fas\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,1],[[30,[36,0],[[32,1],\"submitted\"],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"    \"],[8,\"fa-icon\",[[24,0,\"text-purple-500\"]],[[\"@icon\",\"@prefix\"],[\"satellite-dish\",\"fas\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,1],[[30,[36,0],[[32,1],\"passed\"],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"    \"],[8,\"fa-icon\",[[24,0,\"text-green-500\"]],[[\"@icon\",\"@prefix\"],[\"check-circle\",\"fas\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,1],[[30,[36,0],[[32,1],\"failed\"],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"    \"],[8,\"fa-icon\",[[24,0,\"text-red-500\"]],[[\"@icon\",\"@prefix\"],[\"times-circle\",\"fas\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[6,[37,1],[[30,[36,0],[[32,1],\"errored\"],null]],null,[[\"default\",\"else\"],[{\"statements\":[[2,\"    \"],[8,\"fa-icon\",[[24,0,\"text-orange-500\"]],[[\"@icon\",\"@prefix\"],[\"exclamation-triangle\",\"fas\"]],null],[2,\"\\n\"]],\"parameters\":[]},{\"statements\":[[2,\"    \"],[1,[32,1]],[2,\"\\n  \"]],\"parameters\":[]}]]]],\"parameters\":[]}]]]],\"parameters\":[]}]]]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[13]],\"hasEval\":false,\"upvars\":[\"eq\",\"if\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/components/status/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/forgot-password/form/component", ["exports", "@glimmer/component", "ember-concurrency-decorators", "fetch"], function (_exports, _component, _emberConcurrencyDecorators, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _dec2, _class, _descriptor, _descriptor2;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let ForgotPasswordForm = (_dec = Ember.inject.service, _dec2 = Ember._tracked, (_class = class ForgotPasswordForm extends _component.default {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "notifications", _descriptor, this);

      _initializerDefineProperty(this, "email", _descriptor2, this);
    }

    *requestReset() {
      let response = yield (0, _fetch.default)('/forgot', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email
        })
      });

      if (response.status === 200) {
        // TODO: navigate in ember once the main page is finished
        let result = yield response.json();

        if (result === null || result === void 0 ? void 0 : result.ok) {
          this.notifications.add(result.message);
        }

        return;
      }

      try {
        let result = yield response.json();

        if (result === null || result === void 0 ? void 0 : result.errors) {
          this.notifications.add(result.errors.join('\n'), {
            appearance: 'error'
          });
        }
      } catch (e) {
        throw new Error('Not ok');
      }
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "notifications", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "email", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class.prototype, "requestReset", [_emberConcurrencyDecorators.task], Object.getOwnPropertyDescriptor(_class.prototype, "requestReset"), _class.prototype)), _class));
  _exports.default = ForgotPasswordForm;
});
;define("strider-ui/pods/forgot-password/form/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "6Czyp32x",
    "block": "{\"symbols\":[\"&attrs\"],\"statements\":[[11,\"form\"],[24,0,\"bg-white shadow-md rounded px-8 pt-6 pb-8 my-4\"],[17,1],[4,[38,2],[\"submit\",[30,[36,1],[[30,[36,0],[[32,0,[\"requestReset\"]]],null]],null]],null],[12],[2,\"\\n  \"],[10,\"h2\"],[12],[2,\"Request Password Reset\"],[13],[2,\"\\n  \"],[10,\"p\"],[14,0,\"text-sm mt-2 mb-4 max-w-lg\"],[12],[2,\"\\n    If an account with the specified email exists, we'll send you an email with details on how to reset your password.\\n  \"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"mb-4\"],[12],[2,\"\\n    \"],[10,\"label\"],[14,0,\"block text-gray-700 text-sm font-medium mb-2\"],[14,\"for\",\"email\"],[12],[2,\"\\n      Email\\n    \"],[13],[2,\"\\n    \"],[8,\"input\",[[24,0,\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\"],[24,1,\"email\"],[24,\"placeholder\",\"Email\"]],[[\"@type\",\"@required\",\"@value\"],[\"email\",true,[32,0,[\"email\"]]]],null],[2,\"\\n  \"],[13],[2,\"\\n\\n  \"],[10,\"div\"],[14,0,\"flex items-center justify-between\"],[12],[2,\"\\n    \"],[10,\"div\"],[14,0,\"flex flex-col\"],[12],[2,\"\\n      \"],[8,\"link-to\",[[24,0,\"block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800\"]],[[\"@route\"],[\"login\"]],[[\"default\"],[{\"statements\":[[2,\"\\n        Login\\n      \"]],\"parameters\":[]}]]],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[10,\"button\"],[14,0,\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4\"],[14,4,\"submit\"],[12],[2,\"\\n      Submit\\n    \"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[\"perform\",\"prevent-default\",\"on\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/forgot-password/form/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/forgot-password/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "xFObkp2N",
    "block": "{\"symbols\":[],\"statements\":[[10,\"div\"],[14,0,\"flex justify-center w-full\"],[12],[2,\"\\n  \"],[8,\"forgot-password/form\",[],[[],[]],null],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "strider-ui/pods/forgot-password/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/index/controller", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _class, _descriptor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let Index = (_dec = Ember.inject.service, (_class = class Index extends Ember.Controller {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "currentUser", _descriptor, this);
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "currentUser", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class)); // DO NOT DELETE: this is how TypeScript knows how to look up your controllers.

  _exports.default = Index;
});
;define("strider-ui/pods/index/route", ["exports", "fetch"], function (_exports, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class Index extends Ember.Route {
    async model() {
      let response = await (0, _fetch.default)('/api/jobs');
      let jobs = await response.json();
      let responsep = await (0, _fetch.default)('/api/v2/projects');
      let projects = await responsep.json();
      debugger;
      return {
        jobs
      };
    }

  }

  _exports.default = Index;
});
;define("strider-ui/pods/index/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "gvgoH9g+",
    "block": "{\"symbols\":[\"jobs\",\"job\",\"provider\",\"job\",\"@model\"],\"statements\":[[10,\"h2\"],[14,0,\"flex justify-between items-center text-2xl mb-3\"],[12],[2,\"\\n  \"],[10,\"div\"],[14,0,\"flex items-center\"],[12],[2,\"\\n    Your Projects\\n  \"],[13],[2,\"\\n\"],[13],[2,\"\\n\\n\"],[8,\"live-projects\",[],[[\"@jobs\"],[[32,5,[\"jobs\"]]]],[[\"default\"],[{\"statements\":[[2,\"\\n  \"],[10,\"ul\"],[12],[2,\"\\n\"],[6,[37,2],[[32,1,[\"yours\",\"length\"]]],null,[[\"default\",\"else\"],[{\"statements\":[[6,[37,1],[[30,[36,0],[[30,[36,0],[[32,1,[\"yours\"]]],null]],null]],null,[[\"default\"],[{\"statements\":[[2,\"        \"],[10,\"li\"],[12],[2,\"\\n          \"],[8,\"project\",[],[[\"@job\"],[[32,4]]],null],[2,\"\\n        \"],[13],[2,\"\\n\"]],\"parameters\":[4]}]]]],\"parameters\":[]},{\"statements\":[[2,\"      \"],[10,\"li\"],[12],[2,\"\\n        You have no projects yet.\\n      \"],[13],[2,\"\\n\\n\"],[6,[37,2],[[32,0,[\"currentUser\",\"availableProviders\",\"length\"]]],null,[[\"default\"],[{\"statements\":[[2,\"        \"],[10,\"li\"],[12],[2,\"\\n          \"],[10,\"h3\"],[12],[2,\"\\n            Link Accounts\\n          \"],[13],[2,\"\\n\\n          \"],[10,\"ul\"],[12],[2,\"\\n\"],[6,[37,1],[[30,[36,0],[[30,[36,0],[[32,0,[\"currentUser\",\"availableProviders\"]]],null]],null]],null,[[\"default\"],[{\"statements\":[[6,[37,2],[[32,3,[\"setupLink\"]]],null,[[\"default\"],[{\"statements\":[[2,\"                \"],[10,\"span\"],[14,0,\"link-accounts\"],[12],[2,\"\\n                  \"],[10,\"a\"],[15,6,[32,3,[\"setupLink\"]]],[14,0,\"bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white text-sm py-1 px-2 border border-blue-500 hover:border-transparent rounded-full shadow mr-2\"],[12],[2,\"\\n\"],[6,[37,2],[[32,3,[\"inline_icon\"]]],null,[[\"default\"],[{\"statements\":[[2,\"                      \"],[8,\"fa-icon\",[],[[\"@icon\",\"@prefix\"],[[32,3,[\"id\"]],\"fab\"]],null],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"                    \"],[1,[32,3,[\"title\"]]],[2,\"\\n                  \"],[13],[2,\"\\n                \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]]],\"parameters\":[3]}]]],[2,\"          \"],[13],[2,\"\\n        \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]]],\"parameters\":[]}]]],[2,\"  \"],[13],[2,\"\\n\\n\"],[6,[37,2],[[32,1,[\"public\",\"length\"]]],null,[[\"default\"],[{\"statements\":[[2,\"    \"],[10,\"h2\"],[14,0,\"flex justify-between items-center text-2xl mb-3\"],[12],[2,\"\\n      \"],[10,\"div\"],[14,0,\"flex items-center\"],[12],[2,\"\\n        Public Projects\\n      \"],[13],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[10,\"ul\"],[12],[2,\"\\n\"],[6,[37,2],[[32,1,[\"public\",\"length\"]]],null,[[\"default\"],[{\"statements\":[[6,[37,1],[[30,[36,0],[[30,[36,0],[[32,1,[\"public\"]]],null]],null]],null,[[\"default\"],[{\"statements\":[[2,\"          \"],[10,\"li\"],[12],[2,\"\\n            \"],[8,\"project\",[],[[\"@job\"],[[32,2]]],null],[2,\"\\n          \"],[13],[2,\"\\n\"]],\"parameters\":[2]}]]]],\"parameters\":[]}]]],[2,\"    \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]]],\"parameters\":[1]}]]]],\"hasEval\":false,\"upvars\":[\"-track-array\",\"each\",\"if\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/index/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/login/form/component", ["exports", "@glimmer/component", "ember-concurrency-decorators", "fetch"], function (_exports, _component, _emberConcurrencyDecorators, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _dec2, _dec3, _class, _descriptor, _descriptor2, _descriptor3;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let LoginForm = (_dec = Ember.inject.service, _dec2 = Ember._tracked, _dec3 = Ember._tracked, (_class = class LoginForm extends _component.default {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "notifications", _descriptor, this);

      _initializerDefineProperty(this, "email", _descriptor2, this);

      _initializerDefineProperty(this, "password", _descriptor3, this);
    }

    *login() {
      let response = yield (0, _fetch.default)('/login', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      });

      if (response.status === 200) {
        // TODO: navigate in ember once the main page is finished
        return window.location.href = '/';
      }

      try {
        let result = yield response.json();

        if (result === null || result === void 0 ? void 0 : result.errors) {
          this.notifications.add(result.errors.join('\n'), {
            appearance: 'error'
          });
        }

        return;
      } catch (e) {
        throw new Error('Not ok');
      }
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "notifications", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "email", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "password", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class.prototype, "login", [_emberConcurrencyDecorators.task], Object.getOwnPropertyDescriptor(_class.prototype, "login"), _class.prototype)), _class));
  _exports.default = LoginForm;
});
;define("strider-ui/pods/login/form/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "w7yhhELC",
    "block": "{\"symbols\":[\"&attrs\"],\"statements\":[[11,\"form\"],[24,0,\"bg-white shadow-md rounded px-8 pt-6 pb-8 my-4\"],[17,1],[4,[38,2],[\"submit\",[30,[36,1],[[30,[36,0],[[32,0,[\"login\"]]],null]],null]],null],[12],[2,\"\\n  \"],[10,\"h2\"],[12],[2,\"Log In\"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"my-4\"],[12],[2,\"\\n    \"],[10,\"label\"],[14,0,\"block text-gray-700 text-sm font-medium mb-2\"],[14,\"for\",\"email\"],[12],[2,\"\\n      Email\\n    \"],[13],[2,\"\\n    \"],[8,\"input\",[[24,0,\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\"],[24,1,\"email\"],[24,\"placeholder\",\"Email\"]],[[\"@type\",\"@required\",\"@value\"],[\"email\",true,[32,0,[\"email\"]]]],null],[2,\"\\n  \"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"mb-6\"],[12],[2,\"\\n    \"],[10,\"label\"],[14,0,\"block text-gray-700 text-sm font-medium mb-2\"],[14,\"for\",\"password\"],[12],[2,\"\\n      Password\\n    \"],[13],[2,\"\\n    \"],[8,\"input\",[[24,0,\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline\"],[24,1,\"password\"],[24,\"placeholder\",\"******************\"]],[[\"@type\",\"@required\",\"@value\"],[\"password\",true,[32,0,[\"password\"]]]],null],[2,\"\\n\"],[2,\"  \"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"flex items-center justify-between\"],[12],[2,\"\\n     \"],[10,\"div\"],[14,0,\"flex flex-col\"],[12],[2,\"\\n      \"],[8,\"link-to\",[[24,0,\"block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800\"]],[[\"@route\"],[\"register\"]],[[\"default\"],[{\"statements\":[[2,\"\\n        I have an invite code.\\n      \"]],\"parameters\":[]}]]],[2,\"\\n      \"],[8,\"link-to\",[[24,0,\"block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800\"]],[[\"@route\"],[\"forgot-password\"]],[[\"default\"],[{\"statements\":[[2,\"\\n        Forgot Password?\\n      \"]],\"parameters\":[]}]]],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[10,\"button\"],[14,0,\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4\"],[14,4,\"submit\"],[12],[2,\"\\n      Submit\\n    \"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[\"perform\",\"prevent-default\",\"on\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/login/form/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/login/route", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class Login extends Ember.Route {}

  _exports.default = Login;
});
;define("strider-ui/pods/login/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "pHyQDQir",
    "block": "{\"symbols\":[],\"statements\":[[10,\"div\"],[14,0,\"flex justify-center w-full\"],[12],[2,\"\\n  \"],[8,\"login/form\",[],[[],[]],null],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "strider-ui/pods/login/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/organization/repository/index/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "9DDDY0hx",
    "block": "{\"symbols\":[\"@model\"],\"statements\":[[8,\"job\",[],[[\"@job\",\"@jobs\"],[[32,1,[\"job\"]],[32,1,[\"jobs\"]]]],null]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "strider-ui/pods/organization/repository/index/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/organization/repository/job/controller", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _class, _descriptor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let JobController = (_dec = Ember.inject.service, (_class = class JobController extends Ember.Controller {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "live", _descriptor, this);
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "live", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  _exports.default = JobController;
});
;define("strider-ui/pods/organization/repository/job/route", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _class, _descriptor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  // interface OrgParams {
  //   org: string;
  // }
  // interface RepoParams {
  //   repo: string;
  // }
  let JobRoute = (_dec = Ember.inject.service, (_class = class JobRoute extends Ember.Route {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "live", _descriptor, this);
    }

    model({
      jobId
    }) {
      this.live.selectedJobId = jobId;
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "live", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  _exports.default = JobRoute;
});
;define("strider-ui/pods/organization/repository/job/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "b1HEQtgS",
    "block": "{\"symbols\":[],\"statements\":[[8,\"job\",[],[[\"@job\"],[[32,0,[\"live\",\"selectedJob\"]]]],null]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "strider-ui/pods/organization/repository/job/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/organization/repository/route", ["exports", "fetch", "lodash-es", "strider-ui/utils/legacy/phases", "strider-ui/utils/legacy/skels"], function (_exports, _fetch, _lodashEs, _phases, _skels) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _class, _descriptor;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let RepositoryRoute = (_dec = Ember.inject.service, (_class = class RepositoryRoute extends Ember.Route {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "live", _descriptor, this);
    }

    async model({
      repo
    }) {
      let {
        org
      } = this.paramsFor('organization');
      let jobResponse = await (0, _fetch.default)(`/api/v2/jobs/${org}/${repo}/latest`, {
        headers: {
          Accept: 'application/json'
        }
      });
      let jobsResponse = await (0, _fetch.default)(`/api/v2/jobs/${org}/${repo}`, {
        headers: {
          Accept: 'application/json'
        }
      });
      let [job, jobs] = await Promise.all([jobResponse.json(), jobsResponse.json()]);

      if (!job.phases) {
        job.phases = {};

        _phases.default.forEach(phase => {
          job.phases[phase] = (0, _lodashEs.cloneDeep)(_skels.default.phase);
        });
      }

      this.live.jobs = jobs;
      return {
        job,
        jobs
      };
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "live", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class));
  _exports.default = RepositoryRoute;
});
;define("strider-ui/pods/organization/repository/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "2RxKnfA3",
    "block": "{\"symbols\":[\"jobs\",\"jobItem\",\"@model\"],\"statements\":[[10,\"h2\"],[14,0,\"flex justify-between items-center text-2xl mb-3\"],[12],[2,\"\\n  \"],[10,\"div\"],[14,0,\"flex items-center\"],[12],[2,\"\\n    \"],[1,[32,3,[\"job\",\"project\"]]],[2,\"\\n  \"],[13],[2,\"\\n  \"],[8,\"controls\",[],[[\"@repo\",\"@onToggleRecentBuilds\"],[[32,3,[\"job\"]],[30,[36,9],[[30,[36,8],[[32,0,[\"showRecentBuilds\"]]],null],[30,[36,7],[[32,0,[\"showRecentBuilds\"]]],null]],null]]],null],[2,\"\\n\"],[13],[2,\"\\n\\n\"],[10,\"div\"],[14,0,\"relative\"],[12],[2,\"\\n  \"],[1,[30,[36,11],[[30,[36,10],null,null]],null]],[2,\"\\n\\n  \"],[8,\"live-job\",[],[[],[]],[[\"default\"],[{\"statements\":[[2,\"\\n\"],[6,[37,3],[[32,0,[\"showRecentBuilds\"]]],null,[[\"default\"],[{\"statements\":[[2,\"      \"],[10,\"section\"],[14,0,\"h-screen p-3 overflow-y-auto origin-top-right absolute right-0 top-0 w-64 bg-gray-200 rounded-lg shadow-lg\"],[12],[2,\"\\n        \"],[10,\"h3\"],[14,0,\"mb-4 bg-white text-gray-600 px-2 py-1 rounded-full\"],[12],[2,\"\\n          Recent Builds\\n        \"],[13],[2,\"\\n        \"],[10,\"ul\"],[12],[2,\"\\n\"],[6,[37,6],[[30,[36,5],[[30,[36,5],[[32,1]],null]],null]],null,[[\"default\"],[{\"statements\":[[2,\"            \"],[10,\"li\"],[14,0,\"mb-3\"],[12],[2,\"\\n              \"],[8,\"link-to\",[[16,0,[31,[\"flex flex-col bg-white p-2 rounded-lg shadow\\n                  \",[30,[36,3],[[30,[36,2],[\"organization.repository.job\",[32,2,[\"_id\"]]],null],\"border border-pink-400\"],null]]]]],[[\"@route\",\"@model\",\"@queryParams\"],[\"organization.repository.job\",[32,2,[\"_id\"]],[30,[36,1],null,[[\"ember\"],[true]]]]],[[\"default\"],[{\"statements\":[[2,\"\\n                \"],[10,\"div\"],[14,0,\"flex items-center mb-2\"],[12],[2,\"\\n                  \"],[8,\"status\",[[24,0,\"mr-2\"]],[[\"@status\"],[[32,2,[\"status\"]]]],null],[2,\"\\n                  \"],[1,[32,2,[\"trigger\",\"message\"]]],[2,\"\\n                \"],[13],[2,\"\\n\\n                \"],[10,\"div\"],[14,0,\"flex justify-between items-end\"],[12],[2,\"\\n                  \"],[10,\"div\"],[14,0,\"flex flex-col\"],[12],[2,\"\\n                    \"],[10,\"div\"],[14,0,\"flex items-center mt-2\"],[12],[2,\"\\n                      \"],[10,\"img\"],[15,\"src\",[32,2,[\"trigger\",\"author\",\"image\"]]],[14,0,\"rounded-full w-6 mr-2\"],[14,\"alt\",\"Author avatar\"],[12],[13],[2,\"\\n                      \"],[1,[32,2,[\"trigger\",\"author\",\"name\"]]],[2,\"\\n                    \"],[13],[2,\"\\n\\n                    \"],[10,\"div\"],[14,0,\"mt-1 text-gray-800 text-sm\"],[12],[2,\"\\n                      \"],[1,[30,[36,4],[[32,2,[\"created\"]]],null]],[2,\"\\n                    \"],[13],[2,\"\\n                  \"],[13],[2,\"\\n\\n                  \"],[10,\"div\"],[14,0,\"flex flex-col text-gray-800 text-sm\"],[12],[2,\"\\n                    \"],[1,[32,2,[\"ref\",\"branch\"]]],[2,\"\\n\"],[6,[37,3],[[32,2,[\"ref\",\"id\"]]],null,[[\"default\"],[{\"statements\":[[2,\"                      \"],[10,\"div\"],[14,0,\"mt-1\"],[12],[2,\"\\n                        \"],[1,[30,[36,0],[[32,2,[\"ref\",\"id\"]]],null]],[2,\"\\n                      \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"                  \"],[13],[2,\"\\n                \"],[13],[2,\"\\n              \"]],\"parameters\":[]}]]],[2,\"\\n            \"],[13],[2,\"\\n\"]],\"parameters\":[2]}]]],[2,\"        \"],[13],[2,\"\\n      \"],[13],[2,\"\\n\"]],\"parameters\":[]}]]],[2,\"  \"]],\"parameters\":[1]}]]],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[\"truncate\",\"hash\",\"is-active\",\"if\",\"format-date\",\"-track-array\",\"each\",\"not\",\"mut\",\"fn\",\"-outlet\",\"component\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/organization/repository/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/register/form/component", ["exports", "@glimmer/component", "ember-concurrency-decorators", "fetch"], function (_exports, _component, _emberConcurrencyDecorators, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let RegisterForm = (_dec = Ember.inject.service, _dec2 = Ember._tracked, _dec3 = Ember._tracked, _dec4 = Ember._tracked, (_class = class RegisterForm extends _component.default {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "notifications", _descriptor, this);

      _initializerDefineProperty(this, "email", _descriptor2, this);

      _initializerDefineProperty(this, "password", _descriptor3, this);

      _initializerDefineProperty(this, "inviteCode", _descriptor4, this);
    }

    *register() {
      let response = yield (0, _fetch.default)('/register', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inviteCode: this.inviteCode,
          email: this.email,
          password: this.password
        })
      });

      if (response.status === 200) {
        // TODO: navigate in ember once the main page is finished
        return window.location.href = '/';
      }

      try {
        let result = yield response.json();

        if (result === null || result === void 0 ? void 0 : result.errors) {
          this.notifications.add(result.errors.join('\n'), {
            appearance: 'error'
          });
        }

        return result;
      } catch (e) {
        throw new Error('Not ok');
      }
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "notifications", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "email", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "password", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "inviteCode", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class.prototype, "register", [_emberConcurrencyDecorators.task], Object.getOwnPropertyDescriptor(_class.prototype, "register"), _class.prototype)), _class));
  _exports.default = RegisterForm;
});
;define("strider-ui/pods/register/form/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "w7UoNOzh",
    "block": "{\"symbols\":[\"&attrs\"],\"statements\":[[11,\"form\"],[24,0,\"bg-white shadow-md rounded px-8 pt-6 pb-8 my-4\"],[17,1],[4,[38,2],[\"submit\",[30,[36,1],[[30,[36,0],[[32,0,[\"register\"]]],null]],null]],null],[12],[2,\"\\n  \"],[10,\"h2\"],[12],[2,\"Register\"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"my-4\"],[12],[2,\"\\n    \"],[10,\"label\"],[14,0,\"block text-gray-700 text-sm font-medium mb-2\"],[14,\"for\",\"invite-code\"],[12],[2,\"\\n      Invite Code\\n    \"],[13],[2,\"\\n    \"],[8,\"input\",[[24,0,\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\"],[24,1,\"invite-code\"],[24,\"placeholder\",\"abc123\"]],[[\"@required\",\"@value\"],[true,[32,0,[\"inviteCode\"]]]],null],[2,\"\\n  \"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"mb-4\"],[12],[2,\"\\n    \"],[10,\"label\"],[14,0,\"block text-gray-700 text-sm font-medium mb-2\"],[14,\"for\",\"email\"],[12],[2,\"\\n      Email\\n    \"],[13],[2,\"\\n    \"],[8,\"input\",[[24,0,\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\"],[24,1,\"email\"],[24,\"placeholder\",\"Email\"]],[[\"@type\",\"@required\",\"@value\"],[\"email\",true,[32,0,[\"email\"]]]],null],[2,\"\\n  \"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"mb-6\"],[12],[2,\"\\n    \"],[10,\"label\"],[14,0,\"block text-gray-700 text-sm font-medium mb-2\"],[14,\"for\",\"password\"],[12],[2,\"\\n      Password\\n    \"],[13],[2,\"\\n    \"],[8,\"input\",[[24,0,\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline\"],[24,1,\"password\"],[24,\"placeholder\",\"******************\"]],[[\"@type\",\"@value\"],[\"password\",[32,0,[\"password\"]]]],null],[2,\"\\n\"],[2,\"  \"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"flex items-center justify-between\"],[12],[2,\"\\n     \"],[10,\"div\"],[14,0,\"flex flex-col\"],[12],[2,\"\\n      \"],[8,\"link-to\",[[24,0,\"block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800\"]],[[\"@route\"],[\"login\"]],[[\"default\"],[{\"statements\":[[2,\"\\n        Login\\n      \"]],\"parameters\":[]}]]],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[10,\"button\"],[14,0,\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4\"],[14,4,\"submit\"],[12],[2,\"\\n      Submit\\n    \"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[\"perform\",\"prevent-default\",\"on\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/register/form/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/register/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "BHRlE9ES",
    "block": "{\"symbols\":[],\"statements\":[[10,\"div\"],[14,0,\"flex justify-center w-full\"],[12],[2,\"\\n  \"],[8,\"register/form\",[],[[],[]],null],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "strider-ui/pods/register/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/reset-error/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "3rZ402og",
    "block": "{\"symbols\":[\"@model\"],\"statements\":[[10,\"div\"],[14,0,\"flex justify-center w-full\"],[12],[2,\"\\n  \"],[10,\"div\"],[14,0,\"bg-white shadow-md rounded px-8 pt-6 pb-8 my-4\"],[12],[2,\"\\n    \"],[10,\"h2\"],[12],[2,\"\\n      Password Reset\\n    \"],[13],[2,\"\\n    \"],[10,\"p\"],[14,0,\"my-4 text-red-500\"],[12],[2,\"\\n      \"],[1,[32,1]],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[8,\"link-to\",[[24,0,\"block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800\"]],[[\"@route\"],[\"forgot-password\"]],[[\"default\"],[{\"statements\":[[2,\"\\n      Try Resetting Again\\n    \"]],\"parameters\":[]}]]],[2,\"\\n  \"],[13],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "strider-ui/pods/reset-error/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/reset/form/component", ["exports", "@glimmer/component", "ember-concurrency-decorators", "fetch"], function (_exports, _component, _emberConcurrencyDecorators, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let RegisterForm = (_dec = Ember.inject.service, _dec2 = Ember._tracked, _dec3 = Ember._tracked, _dec4 = Ember._tracked, (_class = class RegisterForm extends _component.default {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "notifications", _descriptor, this);

      _initializerDefineProperty(this, "email", _descriptor2, this);

      _initializerDefineProperty(this, "password", _descriptor3, this);

      _initializerDefineProperty(this, "inviteCode", _descriptor4, this);
    }

    *register() {
      let response = yield (0, _fetch.default)('/register', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inviteCode: this.inviteCode,
          email: this.email,
          password: this.password
        })
      });

      if (response.status === 200) {
        // TODO: navigate in ember once the main page is finished
        return window.location.href = '/';
      }

      try {
        let result = yield response.json();

        if (result === null || result === void 0 ? void 0 : result.errors) {
          this.notifications.add(result.errors.join('\n'), {
            appearance: 'error'
          });
        }

        return result;
      } catch (e) {
        throw new Error('Not ok');
      }
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "notifications", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "email", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "password", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, "inviteCode", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class.prototype, "register", [_emberConcurrencyDecorators.task], Object.getOwnPropertyDescriptor(_class.prototype, "register"), _class.prototype)), _class));
  _exports.default = RegisterForm;
});
;define("strider-ui/pods/reset/form/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "0gRiFBEa",
    "block": "{\"symbols\":[\"&attrs\"],\"statements\":[[11,\"form\"],[24,0,\"bg-white shadow-md rounded px-8 pt-6 pb-8 my-4\"],[17,1],[4,[38,2],[\"submit\",[30,[36,1],[[30,[36,0],[[32,0,[\"register\"]]],null]],null]],null],[12],[2,\"\\n  \"],[10,\"h2\"],[12],[2,\"Register\"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"my-4\"],[12],[2,\"\\n    \"],[10,\"label\"],[14,0,\"block text-gray-700 text-sm font-medium mb-2\"],[14,\"for\",\"invite-code\"],[12],[2,\"\\n      Invite Code\\n    \"],[13],[2,\"\\n    \"],[8,\"input\",[[24,0,\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\"],[24,1,\"invite-code\"],[24,\"placeholder\",\"abc123\"]],[[\"@required\",\"@value\"],[true,[32,0,[\"inviteCode\"]]]],null],[2,\"\\n  \"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"mb-4\"],[12],[2,\"\\n    \"],[10,\"label\"],[14,0,\"block text-gray-700 text-sm font-medium mb-2\"],[14,\"for\",\"email\"],[12],[2,\"\\n      Email\\n    \"],[13],[2,\"\\n    \"],[8,\"input\",[[24,0,\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline\"],[24,1,\"email\"],[24,\"placeholder\",\"Email\"]],[[\"@type\",\"@required\",\"@value\"],[\"email\",true,[32,0,[\"email\"]]]],null],[2,\"\\n  \"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"mb-6\"],[12],[2,\"\\n    \"],[10,\"label\"],[14,0,\"block text-gray-700 text-sm font-medium mb-2\"],[14,\"for\",\"password\"],[12],[2,\"\\n      Password\\n    \"],[13],[2,\"\\n    \"],[8,\"input\",[[24,0,\"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline\"],[24,1,\"password\"],[24,\"placeholder\",\"******************\"]],[[\"@type\",\"@value\"],[\"password\",[32,0,[\"password\"]]]],null],[2,\"\\n\"],[2,\"  \"],[13],[2,\"\\n  \"],[10,\"div\"],[14,0,\"flex items-center justify-between\"],[12],[2,\"\\n     \"],[10,\"div\"],[14,0,\"flex flex-col\"],[12],[2,\"\\n      \"],[8,\"link-to\",[[24,0,\"block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800\"]],[[\"@route\"],[\"login\"]],[[\"default\"],[{\"statements\":[[2,\"\\n        Login\\n      \"]],\"parameters\":[]}]]],[2,\"\\n    \"],[13],[2,\"\\n\\n    \"],[10,\"button\"],[14,0,\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4\"],[14,4,\"submit\"],[12],[2,\"\\n      Submit\\n    \"],[13],[2,\"\\n  \"],[13],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[\"perform\",\"prevent-default\",\"on\"]}",
    "meta": {
      "moduleName": "strider-ui/pods/reset/form/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/reset/route", ["exports", "fetch"], function (_exports, _fetch) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class Reset extends Ember.Route {
    async model({
      token
    }) {
      let response = await (0, _fetch.default)(`/reset/${token}`);

      if (response.status !== 200) {
        let result = await response.json();
        throw new Error(result.errors.join('\n'));
      }
    }

  }

  _exports.default = Reset;
});
;define("strider-ui/pods/reset/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "2DH6uIg6",
    "block": "{\"symbols\":[],\"statements\":[[10,\"div\"],[14,0,\"flex justify-center w-full\"],[12],[2,\"\\n  \"],[8,\"reset/form\",[],[[],[]],null],[2,\"\\n\"],[13]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "strider-ui/pods/reset/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/pods/ui/icon/component", ["exports", "@glimmer/component"], function (_exports, _component) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class UiIcon extends _component.default {}

  _exports.default = UiIcon;
});
;define("strider-ui/pods/ui/icon/template", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _default = Ember.HTMLBars.template({
    "id": "0UBxCTF+",
    "block": "{\"symbols\":[\"@name\",\"@spin\"],\"statements\":[[8,\"fa-icon\",[],[[\"@icon\",\"@prefix\",\"@spin\"],[[32,1],\"fal\",[32,2]]],null]],\"hasEval\":false,\"upvars\":[]}",
    "meta": {
      "moduleName": "strider-ui/pods/ui/icon/template.hbs"
    }
  });

  _exports.default = _default;
});
;define("strider-ui/router", ["exports", "strider-ui/config/environment"], function (_exports, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  class Router extends Ember.Router {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "location", _environment.default.locationType);

      _defineProperty(this, "rootURL", _environment.default.rootURL);
    }

  }

  _exports.default = Router;
  Router.map(function () {
    this.route('login');
    this.route('forgot-password');
    this.route('register');
    this.route('reset', {
      path: 'reset/:token'
    });
    this.route('organization', {
      path: ':org'
    }, function () {
      this.route('repository', {
        path: ':repo'
      }, function () {
        this.route('job', {
          path: '/job/:jobId'
        });
      });
    });
  });
});
;define("strider-ui/services/current-user", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  class CurrentUserService extends Ember.Service {
    get availableProviders() {
      const availableProviders = Object.keys(this.userConfigs.provider).map(k => {
        return this.userConfigs.provider[k];
      });
      return availableProviders;
    }

  }

  _exports.default = CurrentUserService;
});
;define("strider-ui/services/live", ["exports", "lodash-es"], function (_exports, _lodashEs) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  var _dec, _dec2, _dec3, _class, _descriptor, _descriptor2;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  let Live = (_dec = Ember._tracked, _dec2 = Ember._tracked, _dec3 = Ember._action, (_class = class Live extends Ember.Service {
    constructor(...args) {
      super(...args);

      _initializerDefineProperty(this, "jobs", _descriptor, this);

      _initializerDefineProperty(this, "selectedJobId", _descriptor2, this);
    }

    get selectedJob() {
      return this.jobs.find(item => item._id === this.selectedJobId);
    }

    updateJob(job) {
      let item = this.jobs.find(item => item._id === job._id);

      if (item) {
        let original = item;
        item = Object.assign((0, _lodashEs.cloneDeep)(item), job);
        this.jobs.splice(this.jobs.indexOf(original), 1, item);
        this.jobs = [...this.jobs];
      } else {
        this.jobs.unshift(job);
        this.jobs = [...this.jobs];
      }
    }

  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "jobs", [_dec], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "selectedJobId", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class.prototype, "updateJob", [_dec3], Object.getOwnPropertyDescriptor(_class.prototype, "updateJob"), _class.prototype)), _class)); // DO NOT DELETE: this is how TypeScript knows how to look up your services.

  _exports.default = Live;
});
;define("strider-ui/services/notifications", ["exports", "@frontile/notifications/services/notifications"], function (_exports, _notifications) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _notifications.default;
    }
  });
});
;define("strider-ui/tailwind/config", [], function () {
  "use strict";

  /* eslint-disable no-undef */
  const defaultTheme = require("tailwindcss/defaultTheme");

  module.exports = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter var', ...defaultTheme.fontFamily.sans]
        }
      }
    },
    variants: {},
    plugins: [require("@tailwindcss/ui"), require("@frontile/notifications/tailwind")]
  };
});
;define("strider-ui/utils/legacy/phases", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var _default = ['environment', 'prepare', 'test', 'deploy', 'cleanup'];
  _exports.default = _default;
});
;define("strider-ui/utils/legacy/skels", ["exports", "strider-ui/utils/legacy/phases"], function (_exports, _phases) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var SKELS = {
    job: {
      id: null,
      data: null,
      phases: {},
      phase: _phases.default[0],
      queued: null,
      started: null,
      finished: null,
      test_status: null,
      deploy_status: null,
      plugin_data: {},
      warnings: [],
      std: {
        out: '',
        err: '',
        merged: '',
        merged_latest: ''
      }
    },
    command: {
      out: '',
      err: '',
      merged: '',
      _merged: '',
      started: null,
      command: '',
      plugin: ''
    },
    phase: {
      finished: null,
      exitCode: null,
      commands: []
    }
  };
  var _default = SKELS;
  _exports.default = _default;
});
;

;define('strider-ui/config/environment', [], function() {
  var prefix = 'strider-ui';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("strider-ui/app")["default"].create({"name":"strider-ui","version":"0.0.0+8f92f317"});
          }
        
//# sourceMappingURL=strider-ui.map
