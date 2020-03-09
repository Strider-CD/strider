import jobs from './jobs';
// eslint-disable-next-line no-unused-vars
import { Application } from 'express';

export default function(app: Application) {
  console.log(jobs);
  app.use('/api/v2/jobs', jobs);
}
