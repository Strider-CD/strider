import Route from '@ember/routing/route';
import fetch from 'fetch';
import { cloneDeep } from 'lodash-es';
import PHASES from 'strider/utils/legacy/phases';
import SKELS from 'strider/utils/legacy/skels';

export default class RepositoryRoute extends Route {
  async model({ repo }) {
    let { org } = this.paramsFor('organization');
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
