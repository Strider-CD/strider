import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { cloneDeep } from 'lodash-es';

export default class Live extends Service {
  @tracked jobs: any = [];
  @tracked selectedJobId?: string;

  get selectedJob() {
    return this.jobs.find((item: any) => item._id === this.selectedJobId);
  }

  @action
  updateJob(job: any) {
    let item = this.jobs.find((item: any) => item._id === job._id);
    if (item) {
      const original = item;
      item = Object.assign(cloneDeep(item), job);
      this.jobs.splice(this.jobs.indexOf(original), 1, item);
      this.jobs = [...this.jobs];
    } else {
      this.jobs.unshift(job);
      this.jobs = [...this.jobs];
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    live: Live;
  }
}
