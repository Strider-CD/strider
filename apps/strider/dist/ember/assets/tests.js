'use strict';

define("strider-ui/tests/integration/helpers/ansi-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Helper | ansi', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it renders', async function (assert) {
      this.set('inputValue', '1234');
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        {{ansi inputValue}}
      */
      {
        id: "0adhUW3K",
        block: "{\"symbols\":[],\"statements\":[[1,[28,\"ansi\",[[24,[\"inputValue\"]]],null],false]],\"hasEval\":false}",
        meta: {}
      }));
      assert.equal(this.element.textContent.trim(), '1234');
    });
  });
});
define("strider-ui/tests/integration/helpers/duration-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Helper | duration', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it renders', async function (assert) {
      this.set('inputValue', '1234');
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        {{duration this.inputValue}}
      */
      {
        id: "kXDHW8sM",
        block: "{\"symbols\":[],\"statements\":[[1,[28,\"duration\",[[23,0,[\"inputValue\"]]],null],false]],\"hasEval\":false}",
        meta: {}
      }));
      assert.equal(this.element.textContent.trim(), '1234');
    });
  });
});
define("strider-ui/tests/integration/helpers/format-date-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Helper | format-date', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it renders', async function (assert) {
      this.set('inputValue', '1234');
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        {{format-date this.inputValue}}
      */
      {
        id: "g9YuDgXa",
        block: "{\"symbols\":[],\"statements\":[[1,[28,\"format-date\",[[23,0,[\"inputValue\"]]],null],false]],\"hasEval\":false}",
        meta: {}
      }));
      assert.equal(this.element.textContent.trim(), '1234');
    });
  });
});
define("strider-ui/tests/integration/helpers/truncate-test", ["qunit", "ember-qunit", "@ember/test-helpers"], function (_qunit, _emberQunit, _testHelpers) {
  "use strict";

  (0, _qunit.module)('Integration | Helper | truncate', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it renders', async function (assert) {
      this.set('inputValue', '1234');
      await (0, _testHelpers.render)(Ember.HTMLBars.template(
      /*
        {{truncate this.inputValue}}
      */
      {
        id: "P7VqAoH5",
        block: "{\"symbols\":[],\"statements\":[[1,[28,\"truncate\",[[23,0,[\"inputValue\"]]],null],false]],\"hasEval\":false}",
        meta: {}
      }));
      assert.equal(this.element.textContent.trim(), '1234');
    });
  });
});
define("strider-ui/tests/lint/app.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | app');
  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });
  QUnit.test('helpers/ansi.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/ansi.js should pass ESLint\n\n');
  });
  QUnit.test('pods/application/controller.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'pods/application/controller.js should pass ESLint\n\n');
  });
  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });
  QUnit.test('tailwind/config.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'tailwind/config.js should pass ESLint\n\n');
  });
  QUnit.test('utils/legacy/phases.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/legacy/phases.js should pass ESLint\n\n');
  });
  QUnit.test('utils/legacy/skels.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'utils/legacy/skels.js should pass ESLint\n\n');
  });
});
define("strider-ui/tests/lint/templates.template.lint-test", [], function () {
  "use strict";

  QUnit.module('TemplateLint');
  QUnit.test('strider-ui/pods/application/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/application/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/forgot-password/form/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/forgot-password/form/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/forgot-password/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/forgot-password/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/login/form/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/login/form/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/login/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/login/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/organization/repository/-components/controls/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/organization/repository/-components/controls/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/organization/repository/-components/job/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/organization/repository/-components/job/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/organization/repository/-components/live-job/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/organization/repository/-components/live-job/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/organization/repository/-components/status/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/organization/repository/-components/status/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/organization/repository/index/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/organization/repository/index/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/organization/repository/job/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/organization/repository/job/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/organization/repository/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/organization/repository/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/register/form/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/register/form/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/register/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/register/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/reset-error/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/reset-error/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/reset/form/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/reset/form/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/reset/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/reset/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/pods/ui/icon/template.hbs', function (assert) {
    assert.expect(1);
    assert.ok(true, 'strider-ui/pods/ui/icon/template.hbs should pass TemplateLint.\n\n');
  });
  QUnit.test('strider-ui/templates/application.hbs', function (assert) {
    assert.expect(1);
    assert.ok(false, 'strider-ui/templates/application.hbs should pass TemplateLint.\n\nstrider-ui/templates/application.hbs\n  2:2  error  All `<button>` elements should have a valid `type` attribute  require-button-type\n');
  });
});
define("strider-ui/tests/lint/tests.lint-test", [], function () {
  "use strict";

  QUnit.module('ESLint | tests');
  QUnit.test('integration/helpers/ansi-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/ansi-test.js should pass ESLint\n\n');
  });
  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
  QUnit.test('unit/pods/application/controller-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/pods/application/controller-test.js should pass ESLint\n\n');
  });
  QUnit.test('unit/services/current-user-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/current-user-test.js should pass ESLint\n\n');
  });
});
define("strider-ui/tests/test-helper", ["strider-ui/app", "strider-ui/config/environment", "@ember/test-helpers", "ember-qunit"], function (_app, _environment, _testHelpers, _emberQunit) {
  "use strict";

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));
  (0, _emberQunit.start)();
});
define("strider-ui/tests/unit/pods/application/controller-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Controller | application', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let controller = this.owner.lookup('controller:application');
      assert.ok(controller);
    });
  });
});
define("strider-ui/tests/unit/pods/login/route-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | login', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:login');
      assert.ok(route);
    });
  });
});
define("strider-ui/tests/unit/pods/reset/route-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Route | reset', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);
    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:reset');
      assert.ok(route);
    });
  });
});
define("strider-ui/tests/unit/services/current-user-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Service | current-user', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:current-user');
      assert.ok(service);
    });
  });
});
define("strider-ui/tests/unit/services/live-test", ["qunit", "ember-qunit"], function (_qunit, _emberQunit) {
  "use strict";

  (0, _qunit.module)('Unit | Service | live', function (hooks) {
    (0, _emberQunit.setupTest)(hooks); // Replace this with your real tests.

    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:live');
      assert.ok(service);
    });
  });
});
define('strider-ui/config/environment', [], function() {
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

require('strider-ui/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
