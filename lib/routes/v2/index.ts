import jobs from './jobs';
import type { Application } from 'express';

export default function(app: Application) {
  app.use('/v2/jobs', jobs);
}
