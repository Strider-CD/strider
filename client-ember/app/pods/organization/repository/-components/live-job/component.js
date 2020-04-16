import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import io from 'socket.io-client';
import { cloneDeep } from 'lodash-es';
// import JobMonitor from 'strider/utils/legacy/job-monitor';
import PHASES from 'strider/utils/legacy/phases';
import SKELS from 'strider/utils/legacy/skels';

export default class LiveJob extends Component {
  @tracked latestJob = this.args.job;
  @tracked jobs = cloneDeep(this.args.jobs);

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
  getJob(jobId) {
    return cloneDeep(
      this.latestJob._id === jobId
        ? this.latestJob
        : this.jobs.find((job) => job._id === jobId)
    );
  }

  @action
  updateLatest() {
    debugger;
    this.latestJob = this.args.job;
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
    this.updateJob(job);
    if (!this.jobs.find((item) => item._id === job._id)) {
      this.jobs.unshift(job);
      this.jobs = [...this.jobs];
    }
  }

  @action
  handleJobStarted([jobId, time]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = this.getJob(jobId);

    job.started = time;
    job.phase = 'environment';
    job.status = 'running';

    this.updateJob(job);
    this.updateJobInList(job);
  }

  @action
  handleCommandStart([jobId, data]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = this.getJob(jobId);
    let phase = job.phases[job.phase];
    let command = Object.assign({}, SKELS.command, data);

    command.started = data.time;
    phase.commands.push(command);

    this.updateJob(job);
  }

  @action
  handleCommandComment([jobId, data]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = this.getJob(jobId);
    let phase = job.phases[job.phase];
    let command = Object.assign({}, SKELS.command);

    command.command = data.comment;
    command.comment = true;
    command.plugin = data.plugin;
    command.finished = data.time;
    phase.commands.push(command);

    this.updateJob(job);
  }

  @action
  handleJobPhaseDone([jobId, data]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = this.getJob(jobId);

    job.phases[data.phase].finished = data.time;
    job.phases[data.phase].duration = data.elapsed;
    job.phases[data.phase].exitCode = data.code;

    if (data.phase === 'test') job.test_status = data.code;
    if (data.phase === 'deploy') job.deploy_status = data.code;
    if (!data.next || !job.phases[data.next]) return;

    job.phase = data.next;

    this.updateJob(job);
  }

  @action
  handleStdOut([jobId, text]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = this.getJob(jobId);
    let currentPhase = job.phase;
    let phase = job.phases[currentPhase];
    let command = ensureCommand(phase);

    command.merged += text;
    job.phases[currentPhase] = phase;

    this.updateJob(job);
  }

  @action
  handleCommandDone([jobId, data]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = this.getJob(jobId);
    let phase = job.phases[job.phase];
    let command = phase.commands[phase.commands.length - 1];

    command.finished = data.time;
    command.duration = data.elapsed;
    command.exitCode = data.exitCode;
    command.merged = command._merged;

    this.updateJob(job);
  }

  @action
  handleJobWarning([jobId, warning]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = this.getJob(jobId);

    if (!job.warnings) {
      job.warnings = [];
    }
    job.warnings.push(warning);

    this.updateJob(job);
  }

  @action
  handleJobErrored([jobId, error]) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = this.getJob(jobId);

    job.error = error;
    job.status = 'errored';

    this.updateJob(job);
    this.updateJobInList(job);
  }

  @action
  handleJobDone([job]) {
    this.updateJob(job);
    this.updateJobInList(job);
  }

  updateJob(job) {
    if (this.args.skipUpdateJob) {
      return;
    }
    this.latestJob = job;
  }

  updateJobInList(job) {
    let item = this.jobs.find((item) => item._id === job._id);
    if (item) {
      let original = item;
      item = Object.assign(cloneDeep(item), job);
      this.jobs.splice(this.jobs.indexOf(original), 1, item);

      this.jobs = [...this.jobs];
    }
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
