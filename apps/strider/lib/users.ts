import { User } from './models';
import sendEmail from './email';

const env = process.env.NODE_ENV;

function getAdmins(done: Function): void {
  User.find({ account_level: 1 }, function (err, admins) {
    done(err, admins);
  });
}

export function makeAdmin(email: string, done: Function): void {
  User.updateOne({ email }, { account_level: 1 }, {}, function (err, num) {
    if (err) return done(err);
    if (!num) return done();

    console.log(`Admin status granted to: ${email}`);

    // if in production, notify all other admins about new admin
    if (env === 'production') {
      getAdmins(function (_err: any, admins: any[]) {
        admins
          .filter(function removeSelf(admin) {
            return admin.email !== email;
          })
          .forEach(function notifyAdmin(admin) {
            sendEmail.notifyNewAdmin(email, admin.email);
          });
      });
    }

    done(null, num);
  });
}
