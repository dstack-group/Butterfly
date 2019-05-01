import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base'
import { User } from '../../rest-client/entities/UserEntities'
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';

/*
 * THIS IS A TESTING COMMAND: Does not respect any type of conventions
 */
export default class Find extends BaseCommand {

  private client: UserRestRequests = new UserRestRequests(this.db.getValues(Config.Server));

  static description = 'Find a user by email';

  static flags = {
    email: flags.string({char: 'e', description: 'email address [required]', required: true}),
    help: flags.help({char: 'h'}),
    table: flags.boolean({char: 't', description: 'yada yada'})
  };

  async run() {

    const flagss = this.parse(Find).flags;

    if (Validator.isEmailValid(flagss.email)) {
      console.log(await this.client.find({email: flagss.email}));
    }

    /*
    const datiUser: User = await this.client.find({email: cmdParams.flags.email});
    if(cmdParams.flags.table){
      this.list(datiUser)
    } else {
      console.log(datiUser)
    }
    */
  }
}
