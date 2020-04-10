import Component from '@glimmer/component';
import { action } from '@ember/object';
import io from 'socket.io-client';
// import { cloneDeep } from 'lodash-es';
// import JobMonitor from 'strider/utils/legacy/job-monitor';
// import PHASES from 'strider/utils/legacy/phases';
// import SKELS from 'strider/utils/legacy/skels';

export default class RepoControls extends Component {
  constructor() {
    super(...arguments);
    let socket = io.connect();
    this.socket = socket;
    // let repo = this.args.repo;
    // let repoJobs = this.args.repo.jobs;

    // class Monitor extends JobMonitor {
    //   emits = {
    //     getUnknown: 'build:job',
    //   };

    //   constructor(socket, change) {
    //     super(socket, change);
    //     this.jobs = {};
    //     this.project = repo.project.name;
    //     this.phases = repo.job.phases;
    //   }

    //   job(id) {
    //     return this.jobs[id];
    //   }

    //   addJob(job) {
    //     if ((job.project.name || job.project) !== this.project) return;
    //     this.jobs[job._id] = job;
    //     var found = -1;

    //     // for (var i = 0; i < this.scope.jobs.length; i++) {
    //     for (var i = 0; i < this.repoJobs.length; i++) {
    //       // if (this.scope.jobs[i]._id === job._id) {
    //       if (this.jobs[i]._id === job._id) {
    //         found = i;
    //         break;
    //       }
    //     }
    //     if (found !== -1) {
    //       // this.scope.jobs.splice(found, 1);
    //       this.repoJobs.splice(found, 1);
    //     }
    //     if (!job.phase) job.phase = 'environment';
    //     if (!job.std) {
    //       job.std = {
    //         out: '',
    //         err: '',
    //         merged: '',
    //       };
    //     }
    //     if (!job.phases) {
    //       job.phases = {};
    //       for (i = 0; i < PHASES.length; i++) {
    //         job.phases[PHASES[i]] = cloneDeep(SKELS.phase);
    //       }
    //       job.phases[job.phase].started = new Date();
    //     } else {
    //       if (job.phases.test.commands.length) {
    //         if (job.phases.environment) {
    //           job.phases.environment.collapsed = true;
    //         }
    //         if (job.phases.prepare) {
    //           job.phases.prepare.collapsed = true;
    //         }
    //         if (job.phases.cleanup) {
    //           job.phases.cleanup.collapsed = true;
    //         }
    //       }
    //     }

    //     // this.scope.jobs.unshift(job);
    //     // this.scope.job = job;
    //     this.repoJobs.unshift(job);
    //     this.repoJobs = job;
    //   }

    //   get(id, done) {
    //     if (this.jobs[id]) {
    //       done(null, this.jobs[id], true);
    //       return true;
    //     }
    //     var self = this;
    //     this.sock.emit('build:job', id, function (job) {
    //       self.jobs[id] = job;
    //       done(null, job);
    //     });
    //   }
    // }

    // const monitor = new Monitor(this.socket, function () {
    //   console.log(repoJobs, this.phases, this.std);
    // });
    // this.monitor = monitor;
  }

  @action
  deploy() {
    let branch = this.args.repo.job && this.args.repo.ref.branch;
    this.socket.emit('deploy', this.args.repo.project, branch);
  }

  @action
  test() {
    let branch = this.args.repo.job && this.args.repo.ref.branch;
    this.socket.emit('test', this.args.repo.project, branch);
  }
}
