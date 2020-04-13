// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import Router from 'co-router';
import { sanitizeUser, gravatar } from '../../utils';
import common from '../../common';

const router = new Router();

/*
 * GET /account
 */
router.get('/', function (req: Request & { user: any }, res: Response) {
  let user = sanitizeUser(req.user.toJSON());
  user.gravatar = gravatar(user.email);
  delete user.hash;
  delete user.salt;

  res.json({
    user,
    userConfigs: (common as typeof common & { userConfigs: any }).userConfigs,
  });
});

export default router;
