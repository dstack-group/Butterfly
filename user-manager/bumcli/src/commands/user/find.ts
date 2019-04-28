import {Command, flags} from '@oclif/command';
import {UserRestRequests} from '../../rest-client';

export default class Find extends Command {
  static description = 'Find a user by email';

  static flags = {
    help: flags.help({char: 'h'}),
    email: flags.string({char: 'e', description: 'email address [required]'}),
  };

  async run() {

    const client: UserRestRequests = new UserRestRequests();
    const cmdParams = this.parse(Find);

    //Some checking (this is only an example)
    if(cmdParams.flags.email.length > 0) {
      console.log(await client.find({email: cmdParams.flags.email}));
    }
  }
}
