import Route from '@ember/routing/route';
import fetch from 'fetch';

interface Params {
  token: string;
}

export default class Reset extends Route {
  async model({ token }: Params) {
    let response = await fetch(`/reset/${token}`);

    if (response.status !== 200) {
      let result = await response.json();
      throw new Error(result.errors.join('\n'));
    }
  }
}
