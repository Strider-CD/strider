import Service from '@ember/service';

export default class CurrentUserService extends Service {
}

declare module '@ember/service' {
  interface Registry {
    'current-user': CurrentUserService;
  }
}
