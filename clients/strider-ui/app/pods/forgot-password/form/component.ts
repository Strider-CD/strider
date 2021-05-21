import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import fetch from 'fetch';
import { NotificationsService } from '@frontile/notifications';

interface Args {}

export default class ForgotPasswordForm extends Component<Args> {
  @service notifications!: NotificationsService;

  @tracked email?: string;

  @task async requestReset() {
    const response = await fetch('/forgot', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.email,
      }),
    });

    if (response.status === 200) {
      // TODO: navigate in ember once the main page is finished
      const result = await response.json();

      if (result?.ok) {
        this.notifications.add(result.message);
      }
      return;
    }

    try {
      const result = await response.json();

      if (result?.errors) {
        this.notifications.add(result.errors.join('\n'), {
          appearance: 'error',
        });
      }
    } catch (e) {
      throw new Error('Not ok');
    }
  }
}
