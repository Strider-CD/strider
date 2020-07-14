import jobs from './jobs';
import account from './account';
import setup from './setup';

import { Application } from 'express';

export default function (app: Application): void {
  app.use('/api/v2/jobs', jobs);
  app.use('/api/v2/account', account);
  app.use('/api/v2/setup', setup);
}
