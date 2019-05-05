import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
//new
import { FindUser, User } from '../../rest-client/entities/UserEntities';

export class Find extends BaseCommand {

  static description = 'Find all users or a specific user identified by email';

  static flags = {
    ...BaseCommand.flags,
    email: flags.string({char: 'e', description: 'user email address'}),
  };


  //New field: header for the table.
  private static readonly UserColumns : TableColumns<User> = {
    userId:{
      minWidth : 7  
    },
    email :{
      minWidth : 7
    },
    firstname :{
      minWidth : 7
    },
    lastname : {
      minWidth : 7
    },
    enabled :{
      get: user => user.enabled ? 'T' : 'F'
    },
    created :{
      minWidth : 7
    },
    modified :{
      minWidth : 7
    }
  }

  async run() {
    try {
      const client: UserRestRequests = new UserRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Find).flags;
      if (flagss.email === undefined) {
        this.showResult(await client.findAll(), Find.UserColumns, flagss.json);
      } else {
        Validator.isEmailValid(flagss.email);
        this.showResult([await client.find({email: flagss.email})], Find.UserColumns, flagss.json);
      }

    } catch (error) {
      this.error(error.message);
    }
  }
}
