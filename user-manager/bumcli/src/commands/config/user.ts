import {Command, flags} from '@oclif/command';
import { BaseCommand } from '../../base/base';
import { Validator } from '../../utils/Validator';
import { LocalDb, Config } from '../../database/LocalDb';
import { UserInfo } from '../../database/UserInfo';

export default class User extends BaseCommand {

  static description = `Set all the user informations or only a subset of them.
  Remember that every time that config:user is invoked all the old user informations will be overwritten`;

  static flags = {
    email: flags.string({char: 'e', description: 'Set a default email'}),
    firstname: flags.string({char: 'f', description: 'Set your firstname'}),
    help: flags.help({char: 'h'}),
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
    this.log(this.db.getValues(Config.User));
  }
}
