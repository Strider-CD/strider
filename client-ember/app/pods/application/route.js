import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default class ApplicationRoute extends Route {
  @service currentUser;

  async model() {
    try {
      let response = await fetch('/api/v2/account', {
        headers: { Accept: 'application/json' },
      });
      let account = await response.json();
      debugger;
      this.currentUser.setProperties(account);
      return account;
    } catch (e) {
      // noop
    }
  }
}
