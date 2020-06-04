import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import fetch from 'fetch';

interface Args {}

export default class ForgotPasswordForm extends Component<Args> {
  @tracked email?: string;

  requestReset = task(function* (this: ForgotPasswordForm) {
    let response = yield fetch('/forgot', {
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
      return (window.location.href = '/');
    }

    throw new Error('Not ok');
  });
}
