import Route from '@ember/routing/route';
import fetch from 'fetch';

export default class Index extends Route {
  async model() {
    const response = await fetch('/api/jobs');
    const jobs = await response.json();
    const responsep = await fetch('/api/v2/projects');
    const projects = await responsep.json();
    debugger;

    return {
      jobs,
    };
  }
}
