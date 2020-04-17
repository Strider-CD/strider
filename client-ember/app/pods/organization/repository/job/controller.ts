import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import Live from 'strider/services/live';

export default class JobController extends Controller {
  @service live!: Live;
}
