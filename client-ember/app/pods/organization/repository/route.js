import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class RepositoryRoute extends Route {
  async model({ repo }) {
    let { org } = this.paramsFor('organization');
    debugger;
    let response = await fetch(`/api/v2/jobs/${org}/${repo}`, {
      headers: { Accept: 'application/json' }
    });
    let result = await response.json();
    return result;
  }
}
