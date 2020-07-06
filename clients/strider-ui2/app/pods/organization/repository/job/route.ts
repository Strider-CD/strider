import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Live from 'strider-ui/services/live';

interface Params {
  jobId: string;
}
// interface OrgParams {
//   org: string;
// }
// interface RepoParams {
//   repo: string;
// }

export default class JobRoute extends Route {
  @service live!: Live;

  model({ jobId }: Params) {
    this.live.selectedJobId = jobId;
  }
}
