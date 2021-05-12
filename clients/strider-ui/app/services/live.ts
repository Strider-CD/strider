import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { cloneDeep } from 'lodash-es';

export interface Job {
  _id: string;
  phase: 'environment' | null;
  phases: Record<string, unknown>;
  started?: unknown;
  status?: 'running' | 'errored';
  std?: {
    out: string;
    err: string;
    merged: string;
  };
  warnings?: string[];
  error?: unknown;
}

export default class Live extends Service {
  @tracked jobs: Job[] = [];
  @tracked selectedJobId?: string;

  get selectedJob() {
    return this.jobs.find((item: Job) => item._id === this.selectedJobId);
  }

  @action
  updateJob(job: Job) {
    let item = this.jobs.find((item: Job) => item._id === job._id);
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
