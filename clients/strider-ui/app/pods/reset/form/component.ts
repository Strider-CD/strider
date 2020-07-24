import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import fetch from 'fetch';
import { NotificationsService } from '@frontile/notifications';

interface Args {}

export default class RegisterForm extends Component<Args> {
  @service notifications!: NotificationsService;

  @tracked email?: string;
  @tracked password?: string;
  @tracked inviteCode?: string;

  @task async register() {
    let response = await fetch('/register', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inviteCode: this.inviteCode,
        email: this.email,
        password: this.password,
      }),
    });

    if (response.status === 200) {
      // TODO: navigate in ember once the main page is finished
      return (window.location.href = '/');
    }

    try {
      let result = await response.json();

      if (result?.errors) {
        this.notifications.add(result.errors.join('\n'), {
          appearance: 'error',
        });
      }
      return result;
    } catch (e) {
      throw new Error('Not ok');
    }
  }
}
