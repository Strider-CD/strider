import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { io, Socket } from 'socket.io-client';
import { cloneDeep } from 'lodash-es';
import PHASES, { Phase } from 'strider-ui/utils/legacy/phases';
import SKELS from 'strider-ui/utils/legacy/skels';
import Live, { Job } from 'strider-ui/services/live';
import { tracked } from '@glimmer/tracking';

interface Args {
  jobs: { yours: Job[]; public: Job[] };
}

export default class LiveProjects extends Component<Args> {
  @service live!: Live;
  @tracked yours!: Job[];
  @tracked public!: Job[];

  socket: Socket;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.yours = this.args.jobs.yours;
    this.public = this.args.jobs.public;
    const socket = io();
    this.socket = socket;

    socket.on('job.new', this.handleNewJob);
    socket.on('job.status.started', this.handleJobStarted);
    // socket.on('job.status.command.start', this.handleCommandStart);
    // socket.on('job.status.command.comment', this.handleCommandComment);
    // socket.on('job.status.command.done', this.handleCommandDone);
    // socket.on('job.status.stdout', this.handleStdOut);
    socket.on('job.status.phase.done', this.handleJobPhaseDone);
    // socket.on('job.status.warning', this.handleJobWarning);
    socket.on('job.status.errored', this.handleJobErrored);
    // socket.on('job.status.canceled', this.handleJobErrored);
    socket.on('job.done', this.handleJobDone);
  }

  @action
  test(job: Job) {
    debugger;
    const branch = job?.ref?.branch;
    this.socket.emit('test', job?.project?.name, branch);
  }

  findJob(_projectName: string, _jobId: string) {
    const yours = this.yours.find((item) => item._id);
  }

  @action
  getJob(whos: 'yours' | 'public', projectName: string, jobId: string) {
    let list = this[whos];
    let job = list.find((item) => item._id === jobId);
    debugger;
    if (!job) {
      return;
    }

    if (!job.phase) {
      job.phase = 'environment';
    }
    if (!job.phases) {
      job.phases = {};
      PHASES.forEach((phase: Phase) => {
        job.phases[phase] = cloneDeep(SKELS.phase);
      });
      job.phases[job.phase].started = new Date();
    }
    return job;
  }

  @action
  handleNewJob([job]: [Job], whos: 'yours' | 'public') {
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

    this.updateJob(whos, job);
  }

  @action
  handleJobStarted(
    [jobId, time]: [string, string],
    whos: 'yours' | 'public',
    projectName: string
  ) {
    const job = this.getJob(whos, projectName, jobId);

    if (!job) {
      return;
    }

    job.started = time;
    job.phase = 'environment';
    job.status = 'running';

    this.updateJob(whos, job);
  }

  // @action
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

  @action
  handleJobPhaseDone(
    [jobId, data]: [string, any],
    whos: 'yours' | 'public',
    projectName: string
  ) {
    let job = this.getJob(whos, projectName, jobId);

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

    this.updateJob(whos, job);
  }

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

  @action
  handleJobErrored(
    [jobId, error]: [string, any],
    whos: 'yours' | 'public',
    projectName: string
  ) {
    let job = this.getJob(whos, projectName, jobId);

    if (!job) {
      return;
    }

    job.error = error;
    job.status = 'errored';
    job.phase = null;

    this.updateJob(whos, { ...job });
  }

  @action
  handleJobDone([job]: [Job], whos) {
    this.updateJob(whos, job);
  }

  updateJob(whos: 'yours' | 'public', job: Job) {
    let list = this[whos];
    let current = list.find((item) => item.project._id === job.project._id);
    let index = list.indexOf(current);
    list.splice(index, 1, job);

    this[whos] = [...list];
  }

  willDestroy() {
    super.willDestroy();
    const socket = this.socket;

    socket.off('job.new', this.handleNewJob);
    socket.off('job.status.started', this.handleJobStarted);
    // socket.off('job.status.command.start', this.handleCommandStart);
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
}

// function ensureCommand(phase: any) {
//   let command = phase.commands[phase.commands.length - 1];
//   if (!command || typeof command.finished !== 'undefined') {
//     command = Object.assign({}, SKELS.command);
//     phase.commands.push(command);
//   }
//   return command;
// }
