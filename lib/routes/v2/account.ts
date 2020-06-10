// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import Router from 'co-router';
import { sanitizeUser, gravatar } from '../../utils';
import common from '../../common';
import { User } from '../../models/user';
import { requireUser } from '../../auth';

const router = new Router();

/*
 * GET /account
 */
router.get('/', requireUser, function (
  req: Request & { user?: User },
  res: Response
) {
  const user = sanitizeUser(req.user.toJSON());
  user.gravatar = gravatar(user.email);
  delete user.hash;
  delete user.salt;

  res.json({
    user,
    userConfigs: (common as typeof common & { userConfigs: any }).userConfigs,
  });
});

export default router;
