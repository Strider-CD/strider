import Route from '@ember/routing/route';
import fetch from 'fetch';
import { cloneDeep } from 'lodash-es';
import PHASES from 'strider/utils/legacy/phases';
import SKELS from 'strider/utils/legacy/skels';

interface Params {
  jobId: string;
}
interface OrgParams {
  org: string;
}
interface RepoParams {
  repo: string;
}

export default class JobRoute extends Route {
  async model({ jobId }: Params) {
    let { org } = this.paramsFor('organization') as OrgParams;
    let { repo } = this.paramsFor('organization.repository') as RepoParams;
    let { jobs } = this.modelFor('organization.repository') as any;
    let jobResponse = await fetch(`/api/v2/jobs/${org}/${repo}/job/${jobId}`, {
      headers: { Accept: 'application/json' },
    });

    let job = await jobResponse.json();

    if (!job.phases) {
      job.phases = {};
      PHASES.forEach((phase) => {
        job.phases[phase] = cloneDeep(SKELS.phase);
      });
    }

    return { job, jobs };
  }
}
