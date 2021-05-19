import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import CurrentUserService from 'strider-ui/services/current-user';
import { Job } from 'strider-ui/services/live';

class Project {
  @tracked name;
  @tracked url;
  @tracked providerType;
  @tracked isPublic = false;
  @tracked jobs: Job[] = [];

  constructor(project: any) {
    this.name = project.name;
    this.url = project.display_url;
    this.providerType = project.provider.id;
    this.isPublic = project.public;
    this.jobs = [];
  }

  addJob(job: Job) {
    this.jobs = [job, ...this.jobs];
  }
}

export default class Index extends Controller {
  @service declare currentUser: CurrentUserService;

  get projects() {
    return this.model.projects.map((p: any) => new Project(p));
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    index: Index;
  }
}
