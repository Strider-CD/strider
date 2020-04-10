import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class RepositoryRoute extends Route {
  async model({ repo }) {
    let { org } = this.paramsFor('organization');
    let response = await fetch(`/api/v2/jobs/${org}/${repo}/latest`, {
      headers: { Accept: 'application/json' },
    });
    let results = await response.json();
    debugger;
    return results;
  }
}
