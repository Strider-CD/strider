import Component from '@glimmer/component';
import { action } from '@ember/object';
import io from 'socket.io-client';

export default class RepoControls extends Component {
  constructor() {
    super(...arguments);
    let socket = io.connect();

    this.socket = socket;
  }

  @action
  deploy() {
    let branch = this.args.repo.job && this.args.repo.job.ref.branch;
    this.socket.emit('deploy', this.args.repo.project.name, branch);
  }

  @action
  test() {
    let branch = this.args.repo.job && this.args.repo.job.ref.branch;
    this.socket.emit('test', this.args.repo.project.name, branch);
  }
}
