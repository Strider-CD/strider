import jobs from './jobs';
import account from './account';

// eslint-disable-next-line no-unused-vars
import { Application } from 'express';

export default function (app: Application) {
  app.use('/api/v2/jobs', jobs);
  app.use('/api/v2/account', account);
}
