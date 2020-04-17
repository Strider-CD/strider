import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import io from 'socket.io-client';
import { cloneDeep } from 'lodash-es';
// import { localCopy } from 'tracked-toolbox';
// import JobMonitor from 'strider/utils/legacy/job-monitor';
import PHASES from 'strider/utils/legacy/phases';
import SKELS from 'strider/utils/legacy/skels';

export default class LiveJob extends Component {
  @service live;

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
    let job = cloneDeep(this.live.jobs.find((item) => item._id === jobId));

    if (!job.phase) {
      job.phase = 'environment';
    }
    if (!job.phases) {
      job.phases = {};
      PHASES.forEach((phase) => {
        job.phases[phase] = cloneDeep(SKELS.phase);
      });
      job.phases[job.phase].started = new Date();
    }
    return job;
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
  }

  @action
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

  @action
  handleCommandStart([jobId, data]) {
    let job = this.getJob(jobId);

    if (!job) {
      return;
    }
    let phase = job.phases[job.phase];
    let command = Object.assign({}, SKELS.command, data);

    command.started = data.time;
    phase.commands.push(command);

    this.updateJob(job);
  }

  @action
  handleCommandComment([jobId, data]) {
    let job = this.getJob(jobId);

    if (!job) {
      return;
    }
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

  @action
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

  @action
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

  @action
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

  @action
  handleJobErrored([jobId, error]) {
    let job = this.getJob(jobId);

    if (!job) {
      return;
    }

    job.error = error;
    job.status = 'errored';

    this.updateJob(job);
  }

  @action
  handleJobDone([job]) {
    this.updateJob(job);
  }

  updateJob(job) {
    this.live.updateJob(job);
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
