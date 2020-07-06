import Component from '@glimmer/component';
import { action } from '@ember/object';
import io from 'socket.io-client';

interface Args {
  repo: any;
}

export default class RepoControls extends Component<Args> {
  socket: SocketIOClient.Socket;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    let socket = io.connect();
    this.socket = socket;
  }

  @action
  deploy() {
    let branch = this.args.repo.job && this.args.repo.ref.branch;
    this.socket.emit('deploy', this.args.repo.project, branch);
  }

  @action
  test() {
    let branch = this.args.repo.job && this.args.repo.ref.branch;
    this.socket.emit('test', this.args.repo.project, branch);
  }
}
