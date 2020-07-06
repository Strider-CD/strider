import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import { cloneDeep } from 'lodash-es';
import PHASES from 'strider-ui/utils/legacy/phases';
import SKELS from 'strider-ui/utils/legacy/skels';
import Live from 'strider-ui/services/live';

interface Params {
  repo: string;
}
interface OrgParams {
  org: string;
}

export default class RepositoryRoute extends Route {
  @service live!: Live;

  async model({ repo }: Params) {
    let { org } = this.paramsFor('organization') as OrgParams;
    let jobResponse = await fetch(`/api/v2/jobs/${org}/${repo}/latest`, {
      headers: { Accept: 'application/json' },
    });
    let jobsResponse = await fetch(`/api/v2/jobs/${org}/${repo}`, {
      headers: { Accept: 'application/json' },
    });
    let [job, jobs] = await Promise.all([
      jobResponse.json(),
      jobsResponse.json(),
    ]);

    if (!job.phases) {
      job.phases = {};
      PHASES.forEach((phase) => {
        job.phases[phase] = cloneDeep(SKELS.phase);
      });
    }

    this.live.jobs = jobs;

    return { job, jobs };
  }
}
