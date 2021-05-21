import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import Network from 'strider-ui/services/network';

export default class Index extends Route {
  @service declare network: Network;

  model() {
    return hash({
      jobs: this.network.request('/api/jobs'),
      projects: this.network.request('/api/v2/projects'),
    });
  }

  afterModel() {
    debugger;
  }
}
