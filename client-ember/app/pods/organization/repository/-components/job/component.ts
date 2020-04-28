import Component from '@glimmer/component';
import { action } from '@ember/object';
import io from 'socket.io-client';

interface Args {
  job: object;
}

export default class Job extends Component<Args> {
  socket: SocketIOClient.Socket;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    let socket = io.connect();
    this.socket = socket;
  }

  @action
  cancel(jobId: string) {
    this.socket.emit('cancel', jobId);
  }
}
