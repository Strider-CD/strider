import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class ApplicationRoute extends Route {
  async model() {
    let response = await fetch('/projects', {
      headers: { Accept: 'application/json' }
    });
    let projects = await response.json();

    return projects;
  }
}
