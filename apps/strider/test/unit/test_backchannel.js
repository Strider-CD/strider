var expect = require('chai').expect;
var BackChannel = require('../../dist-lib/backchannel');
var EventEmitter = require('events').EventEmitter;
var sinon = require('sinon');
var common = require('../../dist-lib/common');

var ObjectId = require('mongoose').Types.ObjectId;

describe('BackChannel', function() {
  describe('#prepareJob()', function() {
    var bc = null;
    var emitter = null;
    var ws = null;
    var Project = null;
    var Job = null;
    var Runner = require('strider-simple-runner').Runner;

    before(function(done) {
      var provider = require('../fixtures/issue_477/common.extensions.provider.json');
      provider.github.getFile = sinon
        .stub()
        .yields(new Error('no strider.json'), null);
      common.extensions = { provider: provider, runner: {} };
      var models = require('../../dist-lib/models');
      Project = models.Project;
      Job = models.Job;

      var User = models.User;

      var project = require('../fixtures/issue_477/realworld_project.json');

      project.creator = new User(project.creator);

      project.branch = sinon.stub().returns({ runner: { id: 'runner-id' } });

      sinon.stub(Project, 'findOne').returns({
        populate: sinon.stub().returns({
          exec: sinon.stub().yields(null, project)
        })
      });

      sinon
        .stub(Job, 'create')
        .yields(null, new Job(require('../fixtures/issue_477/mjob.json')));

      var job = require('../fixtures/issue_477/realworld_job.json');

      sinon.stub(BackChannel.prototype, 'newJob');
      emitter = new EventEmitter();
      bc = new BackChannel(emitter, ws);
      emitter.emit('job.prepare', job);
      done();
    });

    after(function() {
      Project.findOne.restore();
      Job.create.restore();
      BackChannel.prototype.newJob.restore();
    });

    it('calls #newJob() only once', function() {
      expect(BackChannel.prototype.newJob.callCount).to.eq(1);
    });

    it('sends the correct arguments to #newJob()', function() {
      var call = BackChannel.prototype.newJob.getCall(0);
      var job = call.args[0];
      var config = call.args[1];
      expect(Object.keys(job)).to.have.length(13);
      expect(config).to.deep.eq({ runner: { id: 'runner-id' } });
    });
  });
});
