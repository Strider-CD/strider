import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class Index extends Route {
  async model() {
    let response = await fetch('/api/jobs');
    let jobs = await response.json();
    let responsep = await fetch('/api/v2/projects');
    let projects = await responsep.json();
    debugger;

    return {
      jobs,
    };
  }
}
