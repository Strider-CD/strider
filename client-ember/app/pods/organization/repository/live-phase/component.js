import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { tracked as trackedB } from 'tracked-built-ins';
import { cloneDeep } from 'lodash-es';
// import JobMonitor from 'strider/utils/legacy/job-monitor';
import PHASES from 'strider/utils/legacy/phases';
import SKELS from 'strider/utils/legacy/skels';

export default class LivePhase extends Component {
  @tracked livePhase = trackedB(this.args.phase);

  constructor() {
    super(...arguments);
    if (this.args.isRunning) {
      // this.args.socket.on('job.new', this.handleNewJob);
      this.args.socket.on('job.status.stdout', this.handleStdOut);
    }
  }

  @action
  setLive() {
    this.livePhase = trackedB(this.args.phase);
  }

  @action
  setSockets() {
    if (this.args.isRunning) {
      // this.args.socket.on('job.new', this.handleNewJob);
      this.args.socket.on('job.status.stdout', this.handleStdOut);
    } else {
      this.args.socket.off('job.status.stdout', this.handleStdOut);
    }
  }

  @action
  handleStdOut([jobId, text]) {
    let phase = this.livePhase;
    let newPhase = { ...phase };
    if (!this.args.job._id === jobId || !phase) {
      return;
    }
    let command = ensureCommand(newPhase);
    // command.out += text;
    command.merged += text;
    // this.std.out += text;
    // this.std.merged += text;
    // this.std.merged_latest = text;
    // this.livePhase = newPhase;
  }
}

function ensureCommand(phase) {
  var command = phase.commands[phase.commands.length - 1];
  if (!command || typeof command.finished !== 'undefined') {
    command = Object.assign({}, SKELS.command);
    phase.commands.push(command);
  }
  return command;
}
