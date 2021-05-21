// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import Router from 'co-router';
import { User } from '../../models/user';
import { requireUser } from '../../auth';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import Project from '../../models/project';

const router = new Router();

/*
 * GET /projects
 */
router.get('/', requireUser, function (
  req: Request & { user?: User },
  res: Response
) {
  (Project as any).forUser(req.user, (err?: Error, projects?: any[]) => {
    if (err) {
      return res.status(400).json(err);
    }
    // debugger;
    res.json(projects);
  });
});

export default router;
