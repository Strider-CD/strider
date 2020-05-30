import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import fetch from 'fetch';

interface Args {}

export default class LoginForm extends Component<Args> {
  @tracked email?: string;
  password?: string;

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

    throw new Error('Not ok');
  });
}
