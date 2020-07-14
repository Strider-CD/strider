import { Request, Response } from 'express';
import Router from 'co-router';
import UserSchema, { User } from '../../models/user';

const router = new Router();

/*
 * POST /setup
 *
 * Create a admin if none exist
 */
router.post('/', async function (_req: Request, res: Response) {
  const admins = await UserSchema.count({ account_level: 1 });

  if (admins > 0) {
    return res.status(400).json({
      message: 'Admin already exists, setup skipped',
    });
  }

  // TODO: create admin, use same code as cli add-user

  res.status(201).json({ ok: true });
});

/*
 * Get /setup/check
 *
 * Create a admin if none exist
 */
router.get('/check', async function (
  req: Request & { user?: User },
  res: Response
) {
  if (req.user) {
    return res.json({ needsSetup: false });
  }

  const admins = await UserSchema.count({ account_level: 1 });

  if (admins > 0) {
    return res.json({ needsSetup: false });
  }

  res.json({ needsSetup: true });
});

export default router;
