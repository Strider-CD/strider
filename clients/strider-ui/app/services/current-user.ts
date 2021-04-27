import Service from '@ember/service';

export default class CurrentUserService extends Service {
  get availableProviders() {
    const availableProviders = Object.keys(this.userConfigs.provider).map(
      (k) => {
        return this.userConfigs.provider[k];
      }
    );

    return availableProviders;
  }
}

declare module '@ember/service' {
  interface Registry {
    'current-user': CurrentUserService;
  }
}
