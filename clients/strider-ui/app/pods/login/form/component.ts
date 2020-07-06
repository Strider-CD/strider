import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import fetch from 'fetch';
import { NotificationsService } from '@frontile/notifications';

interface Args {}

export default class LoginForm extends Component<Args> {
  @service notifications!: NotificationsService;

  @tracked email?: string;
  @tracked password?: string;

  login = task(function* (this: LoginForm) {
    let response = yield fetch('/login', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password,
      }),
    });
    if (response.status === 200) {
      // TODO: navigate in ember once the main page is finished
      return (window.location.href = '/');
    }

    try {
      let result = yield response.json();

      if (result?.errors) {
        this.notifications.add(result.errors.join('\n'), {
          appearance: 'error',
        });
      }
      return;
    } catch (e) {
      throw new Error('Not ok');
    }
  });
}
