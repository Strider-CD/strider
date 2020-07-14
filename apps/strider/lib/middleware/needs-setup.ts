import { Request, Response } from 'express';
import UserSchema from '../models/user';

let needsCheck = true;

export default async function (
  _req: Request,
  res: Response,
  next: Function
): Promise<void> {
  if (!needsCheck) {
    return next();
  }

  const admins = await UserSchema.count({ account_level: 1 });
  needsCheck = false;

  if (admins === 0) {
    res.redirect('/setup?ember=true');
    return;
  }

  next();
}
