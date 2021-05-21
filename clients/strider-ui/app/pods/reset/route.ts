import Route from '@ember/routing/route';
import fetch from 'fetch';

interface Params {
  token: string;
}

export default class Reset extends Route {
  async model({ token }: Params) {
    const response = await fetch(`/reset/${token}`);

    if (response.status !== 200) {
      const result = await response.json();
      throw new Error(result.errors.join('\n'));
    }
  }
}
