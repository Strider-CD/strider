import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import io from 'socket.io-client';

interface Args {
  job: object;
}

export default class Job extends Component<Args> {
  socket: SocketIOClient.Socket;

  @tracked isErrorStackVisible = false;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    const socket = io.connect();
    this.socket = socket;
  }

  @action
  cancel(jobId: string) {
    this.socket.emit('cancel', jobId);
  }
}
