import Route from '@ember/routing/route';
import fetch from 'fetch';
import { cloneDeep } from 'lodash-es';
import PHASES from 'strider/utils/legacy/phases';
import SKELS from 'strider/utils/legacy/skels';

interface Params {
  repo: string;
}

export default class RepositoryRoute extends Route {
  async model({ repo }: Params) {
    let { org } = this.paramsFor('organization') as any;
    let response = await fetch(`/api/v2/jobs/${org}/${repo}/latest`, {
      headers: { Accept: 'application/json' },
    });
    let job = await response.json();

    if (!job.phases) {
      job.phases = {};
      PHASES.forEach((phase) => {
        job.phases[phase] = cloneDeep(SKELS.phase);
      });
    }

    return job;
  }
}
