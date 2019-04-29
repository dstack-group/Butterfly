import {Command, flags} from '@oclif/command';
import { RestRequests } from '../../rest-client/RestRequests'
import {UserRestRequests} from '../../rest-client';
import { BaseCommand } from '../../base/base'
import { User } from '../../rest-client/entities/UserEntities'


export default class Find extends BaseCommand {

  private client: UserRestRequests = new UserRestRequests();

  static description = 'Find a user by email';

  static flags = {
    help: flags.help({char: 'h'}),
    email: flags.string({char: 'e', description: 'email address [required]'}),
    table: flags.boolean({char: 't', description: 'yada yada'})
  };
  


  async run() {

    const cmdParams = this.parse(Find);

    //Some checking (this is only an example)
    /*if(cmdParams.flags.email.length > 0) {
      console.log(await this.client.find({email: cmdParams.flags.email}));
    }*/

    const datiUser: User = await this.client.find({email: cmdParams.flags.email});
    if(cmdParams.flags.table){
      this.list(datiUser)
    } else {
      console.log(datiUser)
    }

  }
}
