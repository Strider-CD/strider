import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import CurrentUserService from 'strider-ui/services/current-user';

export default class Index extends Controller {
  @service currentUser!: CurrentUserService;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    index: Index;
  }
}
