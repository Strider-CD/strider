import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import CurrentUserService from '../../services/current-user';

const publicRoutes = ['login', 'register', 'forgot-password', 'reset'];

export default class ApplicationRoute extends Route {
  @service currentUser!: CurrentUserService;

  async beforeModel(transition: any) {
    try {
      const response = await fetch('/api/v2/account', {
        headers: { Accept: 'application/json' },
      });
      const account = await response.json();
      this.currentUser.setProperties(account);
      return account;
    } catch (e) {
      if (
        !transition.targetName ||
        !publicRoutes.includes(transition.targetName)
      ) {
        this.transitionTo('login');
      }
    }
  }
}
