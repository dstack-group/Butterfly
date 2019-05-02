import { flags } from '@oclif/command';
import { BaseCommand } from '../../base/base';
import { Validator } from '../../utils/Validator';
import { Config } from '../../database/LocalDb';
import { UserInfo } from '../../database/UserInfo';

export class User extends BaseCommand {

  static description = `Set all the user informations or only a subset of them.
  Remember that every time that config:user is invoked all the old user informations will be overwritten`;

  static flags = {
    ...BaseCommand.flags,
    email: flags.string({char: 'e', description: 'Set a default email'}),
    firstname: flags.string({char: 'f', description: 'Set your firstname'}),
    lastname: flags.string({char: 'l', description: 'Set your lastname'}),
  };

  async run() {

    const flagss = this.parse(User).flags;

    // TODO: When all the values of UserInfo are already memorized into the db
    //       and the user set again only a subset of them I need to delete the
    //       values not setted again? Now it removes them
    const userInfo: UserInfo = {};

    // Check if each flag exists before using it

    if (flagss.email !== undefined) {
      if (Validator.isEmailValid(flagss.email)) {
        userInfo.email = flagss.email;
      } else {
        this.error(`${flagss.email} is an invalid email format!`);
      }
    }

    if (flagss.firstname !== undefined) {
      userInfo.firstname = flagss.firstname;
    }

    if (flagss.lastname !== undefined) {
      userInfo.lastname = flagss.lastname;
    }

    this.db.setValues(Config.User, userInfo);
    this.print(this.db.getValues(Config.User), flagss.json);
  }
}
