import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import io from 'socket.io-client';
import { cloneDeep } from 'lodash-es';
// import JobMonitor from 'strider/utils/legacy/job-monitor';
import PHASES from 'strider/utils/legacy/phases';
import SKELS from 'strider/utils/legacy/skels';

export default class LatestJob extends Component {
  @tracked latestJob = this.args.job;

  constructor() {
    super(...arguments);
    let socket = io.connect();
    this.socket = socket;

    socket.on('job.new', this.handleNewJob);
    socket.on('job.status.phase.done', this.handleJobPhaseDone);
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
  }

  @action
  handleJobPhaseDone([jobId, data], _whos) {
    if (!this.latestJob._id === jobId) {
      return;
    }
    let job = { ...this.latestJob };
    job.phases[data.phase].finished = data.time;
    job.phases[data.phase].duration = data.elapsed;
    job.phases[data.phase].exitCode = data.code;
    // if (['prepare', 'environment', 'cleanup'].indexOf(data.phase) !== -1) {
    //   job.phases[data.phase].collapsed = true;
    // }
    if (data.phase === 'test') job.test_status = data.code;
    if (data.phase === 'deploy') job.deploy_status = data.code;
    if (!data.next || !job.phases[data.next]) return;
    job.phase = data.next;
    debugger;
    this.latestJob = job;
  }
}
