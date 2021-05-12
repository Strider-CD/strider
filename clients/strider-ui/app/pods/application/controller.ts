import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import CurrentUserService from 'strider-ui/services/current-user';

export default class ApplicationController extends Controller {
  @service declare currentUser: CurrentUserService;

  queryParams = ['ember'];
  ember = false;
}

declare module '@ember/controller' {
  interface Registry {
    application: ApplicationController;
  }
}
