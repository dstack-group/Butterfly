import { flags } from '@oclif/command';
import { BaseCommand, TableColumns } from '../../base/base';
import { Validator } from '../../utils/Validator';
import { Config } from '../../database/LocalDb';
import { UserInfo } from '../../database/UserInfo';

export class User extends BaseCommand {

  static description = `Set all the user informations or only a subset of them.
  Remember that every time that config:user is invoked all the old user informations will be overwritten`;

  static flags = {
    ...BaseCommand.flags,
    email: flags.string({ char: 'e', description: 'Set a default email' }),
    firstname: flags.string({ char: 'f', description: 'Set your firstname' }),
    lastname: flags.string({ char: 'l', description: 'Set your lastname' }),
  };

  private static readonly columns: TableColumns<UserInfo> = {
    email: { minWidth: 40 },
    firstname: { minWidth: 15 },
    lastname: { minWidth: 15 },
  };

  async run() {

    try {
      const flagss = this.parse(User).flags;

      const userInfo: UserInfo = {};

      // Check if each flag exists before using it

      if (flagss.email !== undefined) {
        Validator.isEmailValid(flagss.email);
        userInfo.email = flagss.email;
      }

      if (flagss.firstname !== undefined) {
        userInfo.firstname = flagss.firstname;
      }

      if (flagss.lastname !== undefined) {
        userInfo.lastname = flagss.lastname;
      }

      this.db.setValues(Config.User, userInfo);
      const result = this.db.getValues(Config.User);
      this.showResult<UserInfo>([result], User.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
