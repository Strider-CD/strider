import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { tracked as trackedB } from 'tracked-built-ins';
import { action } from '@ember/object';
import io from 'socket.io-client';
import { cloneDeep } from 'lodash-es';
// import JobMonitor from 'strider/utils/legacy/job-monitor';
import PHASES from 'strider/utils/legacy/phases';
import SKELS from 'strider/utils/legacy/skels';

export default class LiveJob extends Component {
  @tracked latestJob = this.args.job;
  jobs = trackedB(this.args.jobs.map((job) => cloneDeep(job)));

  constructor() {
    super(...arguments);
    let socket = io.connect();
    this.socket = socket;

    socket.on('job.new', this.handleNewJob);
    socket.on('job.status.started', this.handleJobStarted);
    socket.on('job.status.command.start', this.handleCommandStart);
    socket.on('job.status.command.comment', this.handleCommandComment);
    socket.on('job.status.phase.done', this.handleJobPhaseDone);
    socket.on('job.status.stdout', this.handleStdOut);
    socket.on('job.status.command.done', this.handleCommandDone);
    socket.on('job.status.errored', this.handleJobErrored);
    socket.on('job.status.canceled', this.handleJobErrored);
    socket.on('job.status.warning', this.handleJobWarning);

    socket.on('job.done', this.handleJobDone);
  }

  @action
  handleNewJob([job]) {
    if (!job.phase) {
      job.phase = 'environment';
    }
    if (!job.std) {
      job.std = {
        out: '',
        err: '',
        merged: '',
      };
    }
    if (!job.phases) {
      job.phases = {};
      PHASES.forEach((phase) => {
        job.phases[phase] = cloneDeep(SKELS.phase);
      });
      job.phases[job.phase].started = new Date();
    }
    // this.sock.emit('build:job', id, function (job) {
    //       self.jobs[id] = job;
    //       done(null, job);
    //     });
    this.latestJob = job;
    if (!this.jobs.find((item) => item._id === job._id)) {
      this.jobs.unshift(job);
    }
  }

  @action
  handleJobStarted([jobId, time]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = cloneDeep(this.latestJob);

    job.started = time;
    job.phase = 'environment';
    job.status = 'running';

    this.latestJob = job;

    let item = this.jobs.find((item) => item._id === job._id);
    if (item) {
      item = Object.assign(item, job);
      this.jobs.splice(this.jobs.indexOf(item), 1, item);
    }
  }

  @action
  handleCommandStart([jobId, data]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = cloneDeep(this.latestJob);
    let phase = job.phases[job.phase];
    let command = Object.assign({}, SKELS.command, data);

    command.started = data.time;
    phase.commands.push(command);

    this.latestJob = job;
  }

  @action
  handleCommandComment([jobId, data]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = cloneDeep(this.latestJob);
    let phase = job.phases[job.phase];
    let command = Object.assign({}, SKELS.command);

    command.command = data.comment;
    command.comment = true;
    command.plugin = data.plugin;
    command.finished = data.time;
    phase.commands.push(command);

    this.latestJob = job;
  }

  @action
  handleJobPhaseDone([jobId, data]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = cloneDeep(this.latestJob);

    job.phases[data.phase].finished = data.time;
    job.phases[data.phase].duration = data.elapsed;
    job.phases[data.phase].exitCode = data.code;

    if (data.phase === 'test') job.test_status = data.code;
    if (data.phase === 'deploy') job.deploy_status = data.code;
    if (!data.next || !job.phases[data.next]) return;

    job.phase = data.next;

    this.latestJob = job;
  }

  @action
  handleStdOut([jobId, text]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = cloneDeep(this.latestJob);
    let currentPhase = job.phase;
    let phase = job.phases[currentPhase];
    let command = ensureCommand(phase);

    command.merged += text;
    job.phases[currentPhase] = phase;

    this.latestJob = job;
  }

  @action
  handleCommandDone([jobId, data]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = cloneDeep(this.latestJob);
    let phase = job.phases[job.phase];
    let command = phase.commands[phase.commands.length - 1];

    command.finished = data.time;
    command.duration = data.elapsed;
    command.exitCode = data.exitCode;
    command.merged = command._merged;

    this.latestJob = job;
  }

  @action
  handleJobWarning([jobId, warning]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = cloneDeep(this.latestJob);

    if (!job.warnings) {
      job.warnings = [];
    }
    job.warnings.push(warning);

    this.latestJob = job;
  }

  @action
  handleJobErrored([jobId, error]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = cloneDeep(this.latestJob);

    job.error = error;
    job.status = 'errored';

    this.latestJob = job;
  }

  @action
  handleJobDone([job]) {
    this.latestJob = job;
  }
}

function ensureCommand(phase) {
  let command = phase.commands[phase.commands.length - 1];
  if (!command || typeof command.finished !== 'undefined') {
    command = Object.assign({}, SKELS.command);
    phase.commands.push(command);
  }
  return command;
}
